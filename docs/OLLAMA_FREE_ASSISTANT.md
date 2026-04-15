# Free Local Assistant With Ollama

Use this path when you want the public assistant to stay free by running a local model instead of a paid API.

## Recommended local defaults

Add these values to `.secrets/myappai.local.env`:

```bash
PUBLIC_ASSISTANT_PROVIDER=ollama
OLLAMA_API_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

`llama3.2:3b` is the default because it is a practical balance of quality and local hardware requirements. If your machine can handle a larger model, try `qwen2.5:7b` or `llama3.1:8b`.

## Install and pull a model

Install Ollama from:

`https://ollama.com/download`

Then pull the recommended model:

```bash
ollama pull llama3.2:3b
```

If the Ollama app is not already running, start the local server:

```bash
ollama serve
```

## Verify the setup

```bash
curl http://127.0.0.1:11434/api/tags
npm run validate:env
node --input-type=module -e "import './scripts/lib/loadEnvironment.js'; const { answerPublicAssistant } = await import('./server/services/assistantService.js'); const result = await answerPublicAssistant({ message: 'What can MyAppAI help me do?' }); console.log(result)"
```

When Ollama is healthy, the assistant response should include `source: 'ollama'`.

## Fallback behavior

When `PUBLIC_ASSISTANT_PROVIDER=ollama`, the public assistant will try the local Ollama model first and then fall back to the built-in static assistant response if Ollama is unavailable. It will not silently switch to a paid API provider.
