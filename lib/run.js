// Ours
const report = require('./report')

async function run (github, repo, sha, deps) {
  // Tell GitHub we are working on it
  await report(github, repo, sha, 'pending')

  // Helpers
  let pass = true
  let blockers = []

  // Filter possible duplication
  deps = Array.from(new Set(deps))

  for (const issue_number of deps) {
    // Get issue details
    const issue = await github.issues.get({ ...repo, issue_number })

    // The actual test
    if (issue.data.state === 'open') {
      pass = false
      blockers.push(issue_number)
    }
  }

  // Update the state
  return report(github, repo, sha, pass ? 'success' : 'failure', blockers)
}

module.exports = run
