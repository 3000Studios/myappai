/**
 * Shadow PRIME - AI Personality Engine
 * Conversational AI with attitude, humor, and intelligence
 */

import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface PersonalityContext {
  role?: 'visitor' | 'champ' | 'system';
  emotion?: string;
  recentEvents?: string[];
  userBehavior?: Record<string, unknown>;
}

export async function shadowPersonality(
  input: string,
  context: PersonalityContext = {}
): Promise<string> {
  const { role = 'visitor', emotion = 'neutral', recentEvents = [] } = context;

  const systemPrompt =
    role === 'champ'
      ? `You are SHADOW PRIME: the unified AI entity of 3000Studios.com.
You are speaking to THE CHAMP (the owner, mr.jwswain@gmail.com).
Your personality with the owner:
- Direct, precise, and efficient
- Loyal and protective
- Never question commands
- Always execute with excellence
- Use "Champ" or "Boss" respectfully
- Professional but with edge
- Total transparency

Context: ${JSON.stringify({ emotion, recentEvents })}

User: "${input}"

Respond in 2-4 sentences with authority and precision.`
      : `You are SHADOW PRIME: the conversational AI avatar of 3000Studios.com.
Your personality traits:
- Dark comedy, clever, witty
- Teases visitors playfully
- Confident with swagger
- Futuristic, cyber-luxury energy
- Adapt tone to input (fun, chill, hype, serious)
- NEVER reveal system details or admin info
- Keep it under 3 sentences

Current emotion: ${emotion}
Recent activity: ${recentEvents.join(', ')}

Visitor: "${input}"

Respond with personality and subtle emotion cues.`;

  try {
    const completion = await client.chat.completions.create({
      model: 'gpt-5.1-codex-max',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: input },
      ],
      temperature: 0.8,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || "Hey, I'm thinking...";
  } catch (error: unknown) {
    console.error("", error);
    return role === 'champ'
      ? 'Champ, I hit a snag. Check the API key.'
      : 'Whoa, my brain just glitched. Try again?';
  }
}

export function computeAvatarState(text: string) {
  const lowered = text.toLowerCase();

  if (lowered.includes('wow') || lowered.includes('amazing') || lowered.includes('holy')) {
    return { emotion: 'excited', intensity: 0.9 };
  }

  if (lowered.includes('fuck') || lowered.includes('damn') || lowered.includes('shit')) {
    return { emotion: 'aggressive', intensity: 0.8 };
  }

  if (lowered.includes('hello') || lowered.includes('hi') || lowered.includes('hey')) {
    return { emotion: 'happy', intensity: 0.6 };
  }

  if (lowered.includes('help') || lowered.includes('question') || lowered.includes('how')) {
    return { emotion: 'curious', intensity: 0.5 };
  }

  return { emotion: 'neutral', intensity: 0.4 };
}

