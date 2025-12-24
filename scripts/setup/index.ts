#!/usr/bin/env node
import { writeFileSync, copyFileSync, readFileSync, existsSync } from "fs"
import chalk from "chalk"
import { handleDatabaseSetup } from "./database.ts"

/**
 * Copy .env.example to .env if it doesn't exist
 */
const initializeEnvFile = () => {
  console.log(chalk.magentaBright("\n================ Initializing Environment ================\n"))

  if (!existsSync(".env.example")) {
    console.log(chalk.red("❌ .env.example file not found in project root"))
    process.exit(1)
  }

  if (existsSync(".env")) {
    console.log(chalk.yellowBright("⚠️  .env file already exists"))
    return
  }

  try {
    copyFileSync(".env.example", ".env")
    console.log(chalk.greenBright("✅ Created .env file from .env.example"))
  } catch (error) {
    console.log(chalk.red("❌ Failed to copy .env.example to .env"))
    console.log(chalk.red((error as Error).message))
    process.exit(1)
  }
}

/**
 * Update POSTGRES_URL in .env file
 */
const updateDatabaseUrlInEnv = (databaseUrl: string) => {
  console.log(chalk.magentaBright("\n================ Updating .env ================\n"))

  try {
    let envContent = readFileSync(".env", "utf-8")

    // Check if POSTGRES_URL already exists
    if (/^POSTGRES_URL=/m.test(envContent)) {
      // Replace existing POSTGRES_URL
      // Escape $ in replacement string to prevent regex replacement issues
      const escapedUrl = databaseUrl.replace(/\$/g, "$$$$")
      envContent = envContent.replace(/^POSTGRES_URL=.*/m, `POSTGRES_URL=${escapedUrl}`)
      console.log(chalk.greenBright("✅ Updated POSTGRES_URL in .env"))
    } else {
      // Append POSTGRES_URL if it doesn't exist
      if (!envContent.endsWith("\n")) {
        envContent += "\n"
      }
      envContent += `\n# Database\nPOSTGRES_URL=${databaseUrl}\n`
      console.log(chalk.greenBright("✅ Added POSTGRES_URL to .env"))
    }

    writeFileSync(".env", envContent)
  } catch (error) {
    console.log(chalk.red("❌ Failed to update .env file"))
    console.log(chalk.red((error as Error).message))
    process.exit(1)
  }
}

async function main() {
  console.log(
    chalk.magentaBright("\n================ ZeroStarter Database Setup ================\n"),
  )

  // Step 1: Initialize .env file from .env.example
  initializeEnvFile()

  // Step 2: Handle database setup
  const databaseUrl = await handleDatabaseSetup()

  // Step 3: Update .env with POSTGRES_URL if provided
  if (databaseUrl) {
    updateDatabaseUrlInEnv(databaseUrl)
  }

  // Done
  console.log(chalk.greenBright("\n🎉 Setup complete! 🎉\n"))

  if (databaseUrl) {
    console.log(chalk.cyan("Next steps:\n"))
    console.log(chalk.cyan("1. Review your .env file in the project root"))
    console.log(chalk.cyan("2. Set up your database tables:"))
    console.log(chalk.whiteBright("   bun db:generate && bun db:migrate\n"))
    console.log(chalk.cyan("3. Start your application"))
  } else {
    console.log(
      chalk.yellowBright(
        "Don't forget to add your POSTGRES_URL to .env before starting your application!\n",
      ),
    )
  }
}

main()
