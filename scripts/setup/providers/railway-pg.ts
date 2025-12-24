import { spawnSync } from "child_process"
import inquirer from "inquirer"
import chalk from "chalk"

const railway = (args: string[], inherit = false) =>
  spawnSync("bunx", ["@railway/cli", ...args], {
    shell: true,
    stdio: inherit ? "inherit" : "pipe",
    encoding: "utf-8",
  })

const ensureRailwayCli = () => {
  const check = railway(["--version"])
  if (check.status !== 0) {
    console.log(chalk.yellowBright("Railway CLI not found. Installing..."))
    const install = spawnSync("bun", ["install", "@railway/cli", "--no-save"], {
      shell: true,
      stdio: "inherit",
    })
    if (install.status !== 0) process.exit(1)
  }
}

const ensureAuth = () => {
  const whoami = railway(["whoami"])
  if (whoami.status !== 0) railway(["login"], true)
}

const getDatabaseUrls = (): { internal: string | null; public: string | null } => {
  const vars = railway(["variables", "--kv"])

  if (vars.status !== 0) {
    console.log(chalk.red("Failed to fetch variables."))
    return { internal: null, public: null }
  }

  const lines = vars.stdout.split("\n")

  // Get both URLs
  const internalLine = lines.find((l: string) => l.startsWith("DATABASE_URL="))
  const publicLine = lines.find((l: string) => l.startsWith("DATABASE_PUBLIC_URL="))

  const internal = internalLine ? internalLine.slice("DATABASE_URL=".length).trim() : null
  const public_ = publicLine ? publicLine.slice("DATABASE_PUBLIC_URL=".length).trim() : null

  return { internal, public: public_ }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const setupRailway = async (): Promise<string> => {
  console.log(chalk.magentaBright("\n================ Railway Setup ================\n"))

  ensureRailwayCli()
  ensureAuth()

  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Do you want to create/link a Railway project with PostgreSQL?",
      default: true,
    },
  ])
  if (!confirm) return ""

  console.log(chalk.blueBright("\nInitializing Railway project..."))
  const initResult = railway(["init"], true)
  if (initResult.status !== 0) {
    console.log(chalk.red("\n❌ Failed to initialize Railway project."))
    process.exit(1)
  }

  console.log(chalk.blueBright("\nAdding PostgreSQL database..."))
  const addResult = railway(["add", "--database", "postgres"], true)

  if (addResult.status !== 0) {
    console.log(chalk.red("\n❌ Failed to add PostgreSQL. Please try manually with 'railway add'"))
    process.exit(1)
  }

  console.log(chalk.blueBright("\nLinking project..."))
  const linkResult = railway(["link"], true)
  if (linkResult.status !== 0) {
    console.log(chalk.red("\n❌ Failed to link Railway project."))
    process.exit(1)
  }

  console.log(chalk.blueBright("\nFetching DATABASE_URL..."))

  let urls: { internal: string | null; public: string | null } = { internal: null, public: null }
  const maxRetries = 5
  const retryDelay = 2000

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(chalk.dim(`Attempt ${attempt}/${maxRetries}...`))

    urls = getDatabaseUrls()

    if (urls.public) {
      console.log(chalk.greenBright("✅ Found DATABASE_PUBLIC_URL!"))
      break
    }

    if (attempt < maxRetries) {
      console.log(
        chalk.yellow(`DATABASE_PUBLIC_URL not found. Retrying in ${retryDelay / 1000}s...`),
      )
      await sleep(retryDelay)
    }
  }

  if (!urls.public) {
    console.log(
      chalk.red(
        "\n❌ Could not retrieve DATABASE_PUBLIC_URL automatically.\n" +
          "Please run 'railway variables --kv' manually to check.\n",
      ),
    )
    process.exit(1)
  }

  console.log(chalk.greenBright("\n✅ Railway PostgreSQL is ready!"))
  console.log(chalk.blueBright("\n📋 Database URLs:"))
  console.log(chalk.dim("  Internal (for Railway deployments):"))
  console.log(chalk.white(`  ${urls.internal || "Not found"}`))
  console.log(chalk.dim("\n  Public (for local development):"))
  console.log(chalk.white(`  ${urls.public}`))
  console.log(
    chalk.yellowBright("\n💡 Use DATABASE_PUBLIC_URL for local migrations and development"),
  )
  console.log(chalk.yellow("--------------------------------"))

  // Return the public URL for local use
  return urls.public
}
