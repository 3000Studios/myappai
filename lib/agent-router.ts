import { generateText } from 'ai';
import { agents } from './agents';

export async function routeAgent(prompt: string) {
  const { text } = await generateText({
    model: agents.router,
    prompt: `
Classify the intent:
- code
- research
- writing
- system

Prompt:
${prompt}

Return only the label.
`,
  });

  return text.trim();
}

