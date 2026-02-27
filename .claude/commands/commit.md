Create a git commit for all uncommitted changes using a semantic commit message.

Steps:
1. Run `git branch --show-current` to get the current branch name.
   - If the branch is `main`, STOP immediately and warn the user: "Cannot commit directly to main. Please switch to a feature branch first (e.g. git checkout -b feat/your-feature)." Do NOT proceed.
2. Run `git status` to see untracked and modified files
3. Run `git diff` and `git diff --cached` to understand what changed
4. Run `git log --oneline -5` to understand the recent commit style of this repo
5. Analyze all changes and determine the appropriate semantic commit type:
   - `feat`: new feature
   - `fix`: bug fix
   - `docs`: documentation only
   - `chore`: build, config, tooling, dependencies
   - `refactor`: code restructuring without behavior change
   - `style`: formatting, whitespace
   - `test`: adding or updating tests
6. Stage all changes with `git add -A` (warn the user if any sensitive files like `.env` are about to be staged, and skip them)
7. Write a concise semantic commit message in the format: `type(optional-scope): short description`
   - Keep the subject line under 72 characters
   - Focus on "why", not just "what"
8. Commit using a heredoc to preserve formatting
9. Show the resulting commit with `git log --oneline -1`

Do NOT push. Do NOT amend existing commits.
