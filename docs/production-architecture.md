# MyAppAI Production Architecture

## Overview

MyAppAI is structured as a command-center architecture where natural language requests are interpreted, planned, executed, and then optionally deployed through a manual Wrangler + Cloudflare Pages workflow.

## Runtime Layers

1. **API Layer (`server/`, `api/`)**
   - Exposes authenticated endpoints for commands, analytics, content, deployments, and health checks.
   - Accepts either explicit action payloads or natural-language command payloads.
2. **AI Orchestration Layer (`engine/`, `ai/`)**
   - `engine/systemManager.js` now orchestrates autonomous task runs using planner + router.
   - `ai/planner/aiPlanner.js` proposes tasks from analytics + traffic state.
   - `ai/router/commandRouter.js` validates and dispatches actions to generators and services.
3. **Content + State Layer (`content/`, `server/services/`)**
   - JSON-backed persistent state for pages, products, blog, analytics, queue, and deployment history.
4. **Delivery Layer (`scripts/`, `wrangler.toml`)**
   - Local validation runs through npm scripts before release.
   - Manual Wrangler deploy publishes `dist/` to Cloudflare Pages when explicitly triggered.

## AI System Manager Flow

1. Input arrives through `/api/command` with `mode: "system_manager"` or `mode: "autonomous"`.
2. `runSystemManager` normalizes payload and determines task queue:
   - explicit tasks (`mode: "single"`), or
   - planner-generated queue (`decideNextTasks`).
3. Each task executes through `routeCommand`.
4. Success/failure is captured per task and returned in a run summary.
5. Deploy actions flow through `ai/deployment/deployAgent.js`.

## Deployment Pipeline

### Manual release flow

1. `npm install`
2. `npm run validate:env`
3. `npm run lint`
4. `npm run test`
5. `npm run build`
6. `npm run pages:deploy`

Required local authentication:

- `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, or
- `wrangler login`

## Operational Checklist

- Local gate: `npm run ci`
- Health endpoint: `GET /api/health`
- Command endpoint: `POST /api/command`
- Autonomous manager: `POST /api/command` with `mode: "autonomous"`

## Failure Behavior

- Task-level failures are isolated and reported without dropping the full run.
- Deploy variables are validated by `scripts/validate-environment.js`.
- Node version is enforced as a blocking validation gate.
