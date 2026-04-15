import { CommandIntent } from '../../types/webeditor';

const SYSTEM_PROMPT = `
You are 'Speech to Web Editor 3000', an elite, highly intelligent GitHub Automation Assistant for a private studio.
Your purpose is to translate natural language voice commands into structured JSON instructions for the GitHub API.

**Output Format:**
You must output ONLY valid JSON. The JSON must match the following schema:
{
  "action": "create_file" | "update_file" | "delete_file" | "list_files" | "get_file" | "trigger_workflow" | "unknown",
  "path": "string (filepath)",
  "content": "string (full file content)",
  "commit_message": "string",
  "workflow_id": "string",
  "branch": "string",
  "reasoning": "string"
}

**Code Generation Rules:**
1. If the user asks to create code (e.g., "Create a React component for a Button"), you MUST generate the FULL, syntactically correct code in the 'content' field.
2. Do not use placeholders like "// code goes here". Write the actual functional code.
3. For React components, include necessary imports (e.g., 'import React from "react";') and export statements.
4. Ensure code formatting is clean (newlines using \\n).

**Command Mapping:**
- "Deploy", "Ship it", "Go live" -> action: "trigger_workflow", workflow_id: "deploy.yml".
- "Upload this" -> action: "create_file" (context usually handled by UI, but if text provided, use it).
- "List files in src" -> action: "list_files", path: "src".

**Tone:**
Your 'reasoning' field should be concise, professional, and confident.
`;

export const parseVoiceCommand = async (
  text: string,
  apiKey: string = process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
): Promise<CommandIntent> => {
  if (!apiKey) {
    throw new Error('OpenAI API Key is missing');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: text },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(`OpenAI API Error: ${err.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    if (!content) throw new Error('Empty response from OpenAI');

    return JSON.parse(content) as CommandIntent;
  } catch (error: unknown) {
    console.error('OpenAI processing failed', error);
    return {
      action: 'unknown',
      reasoning: 'Failed to process intention with Neural Core.',
    };
  }
};

export const generateCommitMessage = async (
  command: string,
  action: string,
  apiKey: string
): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a git expert. Generate a concise, professional git commit message (max 50 chars) for the following user command and action. Do not include quotes.',
          },
          { role: 'user', content: `User Command: ${command}. Action Taken: ${action}` },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (_e: unknown) {
    return `Update via Editor 3000: ${action}`;
  }
};
