# VS Code Extension Purge

- `hookyqr.beautify`: Deprecated formatter that conflicts with the workspace Prettier default formatter in `.vscode/settings.json`.
- `wix.vscode-import-cost`: Adds background bundling that slows large TS/Next projects without providing repo-specific value.
- `ms-vscode.vscode-typescript-tslint-plugin`: TSLint is retired and the repo relies on ESLint via `eslint.config.mjs`.
- `ms-python.python`: Not needed for the Next/TypeScript stack defined in `package.json`.
- `ms-azuretools.vscode-docker`: Docker tooling is unnecessary for the current Next/TypeScript stack defined in `package.json`.
- `continue.continue`: Additional AI assistant beyond the chosen Copilot stack in `.vscode/extensions.json`; keep only one assistant for predictability.
- `codegpt.codegpt`: Duplicative AI assistant not required with Copilot already recommended in `.vscode/extensions.json`.
- `blackboxapp.blackbox`: External AI tooling that overlaps with Copilot and adds startup overhead without project benefit.
- `yoavbls.pretty-ts-errors`: Nice-to-have UI helper, but omitted to keep the recommended set lean and performance-focused.
