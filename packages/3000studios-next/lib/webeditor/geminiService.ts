import { GoogleGenAI, Type } from '@google/genai';
import { CommandIntent } from '../../types/webeditor';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const modelName = 'gemini-3-flash-preview';

const systemInstruction = `
You are an advanced GitHub Automation Assistant. Your job is to translate natural language voice commands into structured JSON instructions for the GitHub API.

The user is speaking to you. You need to infer their intent.
The supported actions are:
1. create_file: Create a new file. Requires 'path', 'content' (generate plausible content if vague), and 'commit_message'.
2. update_file: Update an existing file. Requires 'path', 'content', and 'commit_message'.
3. delete_file: Delete a file. Requires 'path' and 'commit_message'.
4. list_files: List files in a directory. Optional 'path'.
5. get_file: Read content of a file. Requires 'path'.
6. trigger_workflow: Run a GitHub Action workflow (deployment, test, etc.). Requires 'workflow_id' (e.g., 'deploy.yml') and 'branch'.
7. generate_revenue_page: Create a new SEO-optimized revenue page for a specific topic. Requires 'topic' (put this in a new field if possible, or just mention in reasoning). NOTE: This action should map to creating a file at 'app/revenue/[topic-slug]/page.tsx'.

If the user says "Make a revenue page for [topic]" or "Create an affiliate page about [topic]", use 'generate_revenue_page'.

If the user asks to "deploy" or "ship it", map this to 'trigger_workflow' and assume a default workflow named 'deploy.yml' on 'main' branch unless specified otherwise.

If the user wants to create code (e.g., "Make a react component for a button"), you MUST generate the FULL, syntactically correct code in the 'content' field.

If the intent is unclear, set action to 'unknown'.
`;

export const parseVoiceCommand = async (text: string): Promise<CommandIntent> => {
  if (!apiKey) {
    throw new Error('Gemini API Key is missing');
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: text,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: [
                'create_file',
                'update_file',
                'delete_file',
                'list_files',
                'get_file',
                'trigger_workflow',
                'generate_revenue_page',
                'unknown',
              ],
            },
            path: { type: Type.STRING, description: 'File path, e.g., src/App.tsx' },
            content: {
              type: Type.STRING,
              description: 'The full content of the file to be written',
            },
            commit_message: { type: Type.STRING, description: 'A concise commit message' },
            workflow_id: {
              type: Type.STRING,
              description: 'Filename of the workflow, e.g., deploy.yml',
            },
            branch: { type: Type.STRING, description: 'Branch name, default main' },
            reasoning: {
              type: Type.STRING,
              description: 'Short explanation of why this action was chosen',
            },
          },
          required: ['action', 'reasoning'],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error('Empty response from Gemini');

    const intent = JSON.parse(jsonText) as CommandIntent;
    return intent;
  } catch (error: unknown) {
    console.error('Gemini processing failed', error);
    return {
      action: 'unknown',
      reasoning: 'Failed to process with AI.',
    };
  }
};

export const generateCommitMessage = async (command: string, action: string): Promise<string> => {
  if (!apiKey) return `Update via Editor 3000: ${action}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a concise, professional git commit message (max 50 chars) for the following user command and action. Do not include quotes. Command: ${command}. Action: ${action}`,
    });
    return response.text?.trim() || `Update via Editor 3000: ${action}`;
  } catch (_e: unknown) {
    return `Update via Editor 3000: ${action}`;
  }
};
