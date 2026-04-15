# Ollama + Telegram + OpenClaw

Use this path when you want the same free Ollama stack to power:

- the public assistant
- a Telegram bot webhook on `myappai.net`
- your separate OpenClaw/OpenClawRunner setup

## What was added

This repo now exposes:

- `POST /api/public/assistant`
- `GET /api/public/telegram/status`
- `POST /api/public/telegram/webhook`
- `POST /api/ollama`
- `POST /api/ollama/chat`
- `GET /api/ollama/tags`
- `GET /api/ollama/status`

The local repo-backed server uses the shared public assistant service. The Pages worker also has an edge fallback so `myappai.net` can still accept Telegram webhooks even when `ADMIN_API_ORIGIN` is not pointing to a repo server.

## Local env

Add these to `.secrets/myappai.local.env`:

```env
PUBLIC_ASSISTANT_PROVIDER=ollama
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
OLLAMA_PROXY_SECRET=
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_URL=https://myappai.net/api/public/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=replace-with-random-secret
TELEGRAM_ALLOWED_CHAT_IDS=
```

`TELEGRAM_ALLOWED_CHAT_IDS` is optional. If you set it, use a comma-separated list of numeric chat IDs.

## Pages / live env

For Cloudflare Pages, use the same variables in Pages secrets or `.dev.vars`, but do not leave `OLLAMA_API_URL` on `127.0.0.1`.

Use a public endpoint reachable from Cloudflare, for example:

```env
PUBLIC_ASSISTANT_PROVIDER=ollama
OLLAMA_API_URL=https://ollama.example.com
OLLAMA_MODEL=llama3.2:3b
OLLAMA_PROXY_SECRET=replace-with-random-secret
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_WEBHOOK_URL=https://myappai.net/api/public/telegram/webhook
TELEGRAM_WEBHOOK_SECRET=replace-with-random-secret
```

If your Ollama server only runs on your laptop or WSL at `http://127.0.0.1:11434`, the live Pages worker cannot reach it.

## Use the public Ollama endpoint

For remote clients like Clawdbot, point them at:

```text
https://myappai.net/api/ollama
```

The proxy also supports:

- `POST /api/ollama/generate`
- `POST /api/ollama/chat`
- `GET /api/ollama/tags`
- `GET /api/ollama/status`

Compatibility aliases are also available for clients that append the Ollama API path themselves:

- `/api/ollama/api/generate`
- `/api/ollama/api/chat`
- `/api/ollama/api/tags`

If you set `OLLAMA_PROXY_SECRET`, send it as:

```text
X-Ollama-Proxy-Secret: your-secret
```

That secret is optional for initial setup, but strongly recommended before exposing the endpoint broadly.

## Register the Telegram webhook

After setting the env vars, run:

```bash
node scripts/register-telegram-webhook.js
```

That calls Telegram `setWebhook` and then `getWebhookInfo` so you can confirm the bot is pointing at:

```text
https://myappai.net/api/public/telegram/webhook
```

## Verify the bridge

Local checks:

```bash
npm run validate:env
node scripts/test-integrations.js
curl http://127.0.0.1:8787/api/public/telegram/status
curl http://127.0.0.1:8787/api/public/assistant -H 'content-type: application/json' -d '{"message":"What can MyAppAI help me do?"}'
curl http://127.0.0.1:8787/api/ollama/status
curl http://127.0.0.1:8787/api/ollama -H 'content-type: application/json' -d '{"model":"llama3.2:3b","prompt":"hello","stream":false}'
```

Live checks:

```bash
curl https://myappai.net/api/public/telegram/status
curl https://myappai.net/api/public/assistant -H 'content-type: application/json' -d '{"message":"What can MyAppAI help me do?"}'
curl https://myappai.net/api/ollama/status
curl https://myappai.net/api/ollama -H 'content-type: application/json' -d '{"model":"llama3.2:3b","prompt":"hello","stream":false}'
```

Then message the bot in Telegram:

- `/start`
- `/status`
- `hello`

## What to tell ChatGPT

Use this exact handoff:

```text
My website is https://myappai.net.
The public Telegram webhook is https://myappai.net/api/public/telegram/webhook.
The public Ollama proxy endpoint is https://myappai.net/api/ollama.
The assistant should use Ollama because we want the free local model path.
Local dev Ollama URL is http://127.0.0.1:11434.
For Cloudflare Pages production, OLLAMA_API_URL must be a public endpoint that Cloudflare can reach.
The current model is llama3.2:3b unless we upgrade it.
The webhook can be protected with the X-Telegram-Bot-Api-Secret-Token header.
The Ollama proxy can be protected with the X-Ollama-Proxy-Secret header.
If needed, restrict access with TELEGRAM_ALLOWED_CHAT_IDS.
```

## OpenClaw / OpenClawRunner notes

If you want OpenClaw itself to use the same Ollama stack, the key values are:

```text
provider: ollama
model: llama3.2:3b
base URL: https://myappai.net/api/ollama
```

Example Clawdbot config:

```json
{
  "agent": {
    "model": "ollama/llama3.2:3b",
    "base_url": "https://myappai.net/api/ollama"
  }
}
```

Official Ollama references:

- Ollama API docs: `https://docs.ollama.com/api`
- Ollama API reference mirror in the repo docs source: `https://github.com/ollama/ollama/blob/main/docs/api.md`
- Ollama OpenClaw model page: `https://ollama.com/voytas26/openclaw-oss-20b-deterministic:latest`
- Ollama Claude/OpenClaw compatibility notes: `https://ollama.com/blog/claude`

The most important detail is that every client must point at the same reachable Ollama base URL. If `myappai.net` is serving the Telegram webhook and Ollama proxy from Cloudflare Pages, the upstream `OLLAMA_API_URL` cannot be localhost.
