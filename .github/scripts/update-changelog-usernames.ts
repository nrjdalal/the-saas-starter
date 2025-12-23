import { readFileSync, writeFileSync } from "node:fs"
import githubUsername from "github-username"

const CHANGELOG_PATH = "CHANGELOG.md"
const EMAIL_REGEX = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g

async function getUsernameFromEmail(email: string): Promise<string | null> {
  try {
    const username = await githubUsername(email)
    return username
  } catch {
    return null
  }
}

async function processChangelog() {
  const content = readFileSync(CHANGELOG_PATH, "utf-8")
  const lines = content.split("\n")
  const updatedLines: string[] = []
  let inContributorsSection = false
  const emailToUsername = new Map<string, string | null>()

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Detect contributors section
    if (line.includes("### ❤️ Contributors")) {
      inContributorsSection = true
      updatedLines.push(line)
      continue
    }

    // End of contributors section (next section or end of version)
    if (inContributorsSection && (line.startsWith("##") || line.startsWith("###"))) {
      inContributorsSection = false
    }

    if (inContributorsSection && line.trim().startsWith("-")) {
      // Extract email from line
      const emailMatch = line.match(EMAIL_REGEX)
      if (emailMatch) {
        const email = emailMatch[0]

        // Check cache first
        if (!emailToUsername.has(email)) {
          const username = await getUsernameFromEmail(email)
          emailToUsername.set(email, username)
        }

        const username = emailToUsername.get(email)

        if (username) {
          // Replace email with @username
          const updatedLine = line.replace(EMAIL_REGEX, `@${username}`)
          updatedLines.push(updatedLine)
        } else {
          // Remove the line if username not found
          console.log(`Skipping ${email} - GitHub username not found`)
        }
      } else {
        // Keep line as is if no email found
        updatedLines.push(line)
      }
    } else {
      updatedLines.push(line)
    }
  }

  writeFileSync(CHANGELOG_PATH, updatedLines.join("\n"), "utf-8")
  console.log("Changelog updated successfully!")
}

processChangelog().catch(console.error)
