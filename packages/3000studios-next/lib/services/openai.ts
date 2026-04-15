/**
 * OpenAI Service
 * Handles AI-powered code generation and content creation
 */

import OpenAI from 'openai';

let openai: OpenAI | null = null;

// Initialize OpenAI only if API key is available
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

export interface CodeGenerationRequest {
  prompt: string;
  language?: string;
  context?: string;
}

export interface CodeGenerationResponse {
  code: string;
  explanation: string;
  preview: string;
}

export async function generateCode(
  request: CodeGenerationRequest
): Promise<CodeGenerationResponse> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const systemPrompt = `You are an expert developer for 3000 Studios. 
Generate clean, production-ready code based on user requests. 
${request.context ? `Current context: ${request.context}` : ''}
Language: ${request.language || 'TypeScript/React'}
Format your response as JSON with: { code, explanation, preview }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: request.prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return {
      code: result.code || '',
      explanation: result.explanation || '',
      preview: result.preview || '',
    };
  } catch (error: unknown) {
    console.error('OpenAI Code generation failed', error);
    throw new Error('Failed to generate code');
  }
}

export async function generateBlogPost(topic: string, keywords: string[]): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional content writer for 3000 Studios, a creative digital agency. Write engaging, SEO-optimized blog posts.',
        },
        {
          role: 'user',
          content: `Write a comprehensive blog post about "${topic}". Include these keywords: ${keywords.join(', ')}. Use markdown formatting.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
    });

    return response.choices[0].message.content || '';
  } catch (error: unknown) {
    console.error('OpenAI Blog generation failed', error);
    throw new Error('Failed to generate blog post');
  }
}

export async function generateProductDescription(
  productName: string,
  features: string[]
): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a marketing copywriter for 3000 Studios. Write compelling product descriptions that convert.',
        },
        {
          role: 'user',
          content: `Write a product description for "${productName}". Key features: ${features.join(', ')}`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    });

    return response.choices[0].message.content || '';
  } catch (error: unknown) {
    console.error('OpenAI Product description generation failed', error);
    throw new Error('Failed to generate product description');
  }
}

export async function transcribeAudio(audioBase64: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    // Convert base64 to buffer
    const buffer = Buffer.from(audioBase64, 'base64');
    const file = new File([buffer], 'audio.webm', { type: 'audio/webm' });

    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    return response.text;
  } catch (error: unknown) {
    console.error('OpenAI Audio transcription failed', error);
    throw new Error('Failed to transcribe audio');
  }
}
