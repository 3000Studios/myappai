# Cursor: reduce “Accept” prompts (auto-run)

Cursor’s **Agent** may ask you to approve file edits, terminal commands, or MCP tools. There is **no single portable `settings.json` key** documented for “accept everything” across all versions—use the in-app controls below.

## Recommended (Cursor UI)

1. Open **Cursor Settings** (gear) → **Agents** (or **Features** → **Agent**).
2. Enable **Auto-run** / **Auto-approve** options for:
   - Terminal commands (or use an allowlist of safe commands).
   - File edits in the workspace (when you trust this repo).
3. Avoid **“Run everything”** / fully disabled safety modes unless you fully understand the risk (see [Agent Security](https://cursor.com/docs/agent/security)).

## Workspace trust

For a repo you own and trust, mark the workspace as **trusted** when prompted so fewer restrictions apply.

## This repository

Project rule: `.cursor/rules/auto-accept.mdc` tells the coding agent to proceed autonomously on routine work **without** bypassing secret-handling or honesty rules.

## User `settings.json` (optional)

You can add Cursor-specific toggles **only if your Cursor build exposes them** in Settings JSON (search the Settings UI for “agent” and use “Copy Setting ID”). Do not paste secret values into settings.
