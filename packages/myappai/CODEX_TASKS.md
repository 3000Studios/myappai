# Codex Task Automation

Project: myappai
Owner: 3000Studios

Purpose:
Enable Codex to autonomously perform development tasks, fix issues, add features, and maintain a stable build.

---

# Task Execution Workflow

Whenever a task is issued, follow this pipeline:

1. Read repository structure
2. Identify relevant files
3. Install dependencies
4. Validate environment
5. Run lint
6. Run tests
7. Apply code modifications
8. Re-run lint, tests, and build as needed
9. Commit intentionally
10. Push or publish only after verification

---

# Environment Setup

Run:

npm install

If Python is used:

pip install -r requirements.txt

---

# Build

Run:

npm run build

Output directory:

dist

---

# Development Mode

Run:

npm run dev

---

# Testing

Run:

npm test

If Python tests exist:

pytest

---

# Linting

Run:

npm run lint

Fix all lint errors before committing.

---

# Bug Fix Process

When fixing bugs:

1. reproduce the issue
2. identify failing component
3. modify smallest possible code area
4. re-run build
5. re-run tests

---

# Feature Implementation Process

When implementing features:

1. create branch
2. implement feature
3. run tests
4. build project
5. open pull request

If the repo is already operating directly on `main`, replace the branch and PR step with an intentional verified commit and a documented publish path.

---

# Code Quality Rules

Follow these coding standards:

- TypeScript preferred
- async/await over callbacks
- modular architecture
- avoid duplicated logic
- maintain readable code

---

# Performance Rules

Always optimize for:

- low latency
- minimal blocking operations
- fast startup time
- efficient memory usage

---

# Security Rules

Never commit:

API keys
private credentials
tokens

Use environment variables instead.

---

# Autonomous Maintenance

Codex should:

- fix broken builds
- repair failing tests
- improve code quality
- update dependencies
- maintain working deployments
- keep rules and environment docs current when operational behavior changes
- preserve user work in dirty trees instead of resetting it
