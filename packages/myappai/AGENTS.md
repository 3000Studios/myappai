# Codex Agent Rules

Project: `myappai`
Owner: `3000Studios`

You are working inside the myappai AI System Manager project.

## Purpose

Build and maintain an AI system manager platform that converts natural language commands into executable development tasks.

The system acts as a developer command center capable of:

- managing system resources
- executing scripts
- building software projects
- automating development workflows
- running AI agents
- providing a web dashboard interface

## Primary Responsibilities

1. Convert natural language tasks into scripts and executable actions.
2. Build and test features end to end.
3. Maintain Cloudflare Pages and Worker compatibility.
4. Ensure code is production-ready before shipping.

## Architecture

Primary modules in this repository:

- `/dashboard` - web UI for system control
- `/engine` - AI command interpreter
- `/scripts` - script generation and execution engine
- `/workers` - automation agents
- `/api` - backend endpoints
- `/frontend` - public site and admin React application
- `/server` - local repo-backed API server

## Required Workflow

Always follow this execution pipeline when making changes:

1. Install dependencies
2. Validate environment
3. Run linting
4. Run tests
5. Start development server when verification needs it
6. Apply requested code changes
7. Re-test
8. Build production output
9. Commit changes

## Dependency Setup

Node.js must be installed.

Install dependencies with:

`npm install`

If Python modules exist:

`pip install -r requirements.txt`

## Standard Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Test: `npm run test`
- Build: `npm run build`
- Deploy Pages build: `npm run pages:deploy`

## Coding Rules

Follow these standards:

- Prefer TypeScript over JavaScript when expanding or replacing modules
- Use async/await for async operations
- Keep modules small and focused
- Avoid breaking existing API routes
- Maintain consistent folder structure
- Prefer Node.js and Python for automation workflows
- Follow modular architecture

## Performance Goals

The system must prioritize:

- fast execution
- low latency
- minimal blocking operations
- clean architecture

## Security Rules

- Never expose API keys or deployment secrets in code
- Environment variables must be used for secrets
- Never modify deployment secrets unless explicitly asked
- Local repo bots should load secrets from `.secrets/myappai.local.env` first, `.secrets/shared.local.env` second, and should not auto-load `.secrets/archive.local.env`

## Deployment Rules

- Production builds must use `npm run build`
- Production output should be generated in `dist/`
- This project is configured for a single production branch workflow, so changes pushed to `main` may go live immediately

## Commit Rules

- Always run lint before committing
- Always run tests before suggesting a pull request or pushing a release candidate
- Verify the application still boots when the change affects runtime behavior

## Autonomous Behavior

Codex should:

- automatically install dependencies when needed
- fix build errors
- run tests
- improve code quality
- maintain working builds

The goal is a continuously improving autonomous development workflow without leaving partial implementations behind.

## Cursor preference (auto-accept)

Prefer completing routine tasks without repeated confirmation prompts. Project rule: `.cursor/rules/auto-accept.mdc`. For IDE-level auto-run controls, see `docs/CURSOR_AUTO_ACCEPT.md`. Security rules still apply: no secrets in source, no false deployment claims.
