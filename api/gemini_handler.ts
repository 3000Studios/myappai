import { GeminiService } from '../engine/gemini_service'

/**
 * This handler can be integrated into your local server or Cloudflare Worker.
 */
export async function handleGeminiRequest(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const body = (await req.json().catch(() => null)) as {
      prompt?: string
      model?: string
      systemInstruction?: string
    } | null

    const { prompt, model, systemInstruction } = body || {}

    if (typeof prompt !== 'string' || !prompt.trim()) {
      return new Response('Missing prompt', { status: 400 })
    }

    const gemini = new GeminiService()
    const text = await gemini.generateResponse(prompt, {
      model,
      systemInstruction,
    })

    return new Response(JSON.stringify({ response: text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    })
  }
}
