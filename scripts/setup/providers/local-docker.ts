import { spawnSync } from "child_process"
import inquirer from "inquirer"
import chalk from "chalk"
import { genAlphanumericPassword, genRandomIdentifier } from "../utils/db-utils.js"

/**
 * Set up local PostgreSQL using Docker and return DATABASE_URL
 */
export const setupLocalDocker = async (): Promise<string> => {
  console.log(
    chalk.magentaBright("\n================ Local Docker PostgreSQL Setup ================\n"),
  )

  // Check if Docker is installed and running
  const dockerCheck = spawnSync("docker", ["--version"], {
    encoding: "utf-8",
    shell: true,
    stdio: "pipe",
  })

  if (dockerCheck.status !== 0) {
    console.log(chalk.red("❌ Docker is not installed or not running"))
    console.log(
      chalk.cyan("Please install Docker Desktop: https://www.docker.com/products/docker-desktop\n"),
    )
    process.exit(1)
  }

  console.log(chalk.greenBright("✅ Docker is installed"))

  // Generate credentials
  const containerName = `zerostarter-postgres-${genRandomIdentifier(6)}`
  const dbUser = "postgres"
  const dbPassword = genAlphanumericPassword(24)
  const dbName = "zerostarter"
  const dbPort = 5432

  console.log(chalk.blueBright(`\nCreating PostgreSQL container '${containerName}'...`))

  // Run PostgreSQL container
  const dockerRun = spawnSync(
    "docker",
    [
      "run",
      "--name",
      containerName,
      "-e",
      `POSTGRES_USER=${dbUser}`,
      "-e",
      `POSTGRES_PASSWORD=${dbPassword}`,
      "-e",
      `POSTGRES_DB=${dbName}`,
      "-p",
      `${dbPort}:5432`,
      "-d",
      "postgres:16-alpine",
    ],
    {
      encoding: "utf-8",
      shell: true,
      stdio: "inherit",
    },
  )

  if (dockerRun.status !== 0) {
    console.error(chalk.red("❌ Failed to create PostgreSQL container"))
    process.exit(1)
  }

  console.log(chalk.greenBright("\n✅ PostgreSQL container created successfully!"))

  // Construct DATABASE_URL
  const databaseUrl = `postgresql://${dbUser}:${dbPassword}@localhost:${dbPort}/${dbName}`

  console.log(chalk.greenBright(`\nYour DATABASE_URL is:\n${databaseUrl}\n`))
  console.log(chalk.cyan(`Container name: ${containerName}`))
  console.log(chalk.cyan(`\nTo stop: docker stop ${containerName}`))
  console.log(chalk.cyan(`To start: docker start ${containerName}`))
  console.log(chalk.cyan(`To remove: docker rm -f ${containerName}\n`))
  console.log(chalk.yellow("--------------------------------"))

  return databaseUrl
}
