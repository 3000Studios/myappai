# OpenClaw Claude Bot Setup

Use this setup when you want the public assistant flow to answer through Claude while keeping OpenAI available as a fallback.

## Required runtime variables

Add these values to `.secrets/myappai.local.env` for local development:

```bash
ANTHROPIC_API_KEY=replace-with-anthropic-api-key
CLAUDE_MODEL=claude-3-5-sonnet-latest
PUBLIC_ASSISTANT_PROVIDER=claude
```

If you want OpenAI fallback when Claude is unavailable, keep these values configured too:

```bash
OPENAI_API_KEY=replace-with-openai-api-key
OPENAI_MODEL=gpt-4o
```

If you deploy with Cloudflare Pages secrets or `.dev.vars`, add the same Claude values there as well, including `ANTHROPIC_API_KEY`.

## Provider behavior

- `PUBLIC_ASSISTANT_PROVIDER=claude` makes the assistant try Claude first.
- If Claude is selected but its key is missing or the Claude request fails, the service falls back to OpenAI when `OPENAI_API_KEY` is present.
- Set `PUBLIC_ASSISTANT_PROVIDER=openai` any time you want to switch the public assistant back to OpenAI-first behavior.

## Verification commands

Run the standard project checks:

```bash
npm install
npm run validate:env
npm run lint
npm run test
npm run build
```

Then verify the assistant service directly:

```bash
node --input-type=module -e "import { answerPublicAssistant } from './server/services/assistantService.js'; const result = await answerPublicAssistant({ message: 'What can MyAppAI help me do?' }); console.log(result)"
```

With Claude configured, the response should include `source: 'claude'`. If Claude is unavailable and OpenAI fallback is configured, the response should include `source: 'openai'`.
