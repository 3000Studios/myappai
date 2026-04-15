# Autonomous Development Loop

Project: myappai
Owner: 3000Studios

Goal:
Continuously improve the project by fixing bugs, maintaining builds,
and implementing small enhancements while keeping the repository stable.

---

## Operational Loop

When the agent is asked to work on the repository:

1. Read AGENTS.md and CODEX_TASKS.md
2. Scan the repository structure
3. Run dependency installation
4. Build the project
5. Run all tests
6. Identify failures or warnings
7. Apply minimal code changes to fix issues
8. Re-run tests
9. Commit changes on a feature branch
10. Open a pull request

---

## Bug-Fix Strategy

When an error occurs:

1. Reproduce the issue
2. Locate the failing component
3. Modify the smallest possible code section
4. Verify the fix with tests
5. Commit with a descriptive message

---

## Feature Strategy

When implementing new functionality:

1. Create a new branch
2. Implement the feature in the correct module
3. Ensure lint passes
4. Ensure tests pass
5. Update documentation if needed
6. Open a pull request

---

## Code Quality

The agent should always prefer:

- TypeScript over plain JavaScript
- modular components
- async / await patterns
- readable code with clear naming

Avoid large, unstructured files.

---

## Safety Rules

The agent must not:

- commit secrets
- modify deployment credentials
- remove tests or security checks

All sensitive data must remain in environment variables.
For this repository, local bots should read secrets from `.secrets/myappai.local.env` first and `.secrets/shared.local.env` second.

---

## Maintenance Tasks

The agent may also:

- update dependencies
- improve documentation
- refactor duplicated code
- add missing tests
- optimize slow functions

---

## Expected Outcome

A continuously improving codebase where:

- builds remain stable
- tests stay green
- features evolve incrementally
