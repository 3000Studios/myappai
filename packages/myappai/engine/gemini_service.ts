import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

/**
 * GeminiService handles communication with Google AI Studio models.
 * It uses the GEMINI_API_KEY defined in your .env or secrets file.
 */
export class GeminiService {
  private genAI: GoogleGenerativeAI

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in the environment.')
    }
    this.genAI = new GoogleGenerativeAI(apiKey)
  }

  /**
   * Sends a prompt to the Gemini model and returns the text response.
   */
  async generateResponse(
    prompt: string,
    options: { model?: string; systemInstruction?: string } = {}
  ): Promise<string> {
    try {
      const modelName =
        options.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash'
      const modelConfig: any = { model: modelName }

      if (options.systemInstruction) {
        modelConfig.systemInstruction = options.systemInstruction
      }

      const model = this.genAI.getGenerativeModel(modelConfig)
      const result = await model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw new Error('Failed to generate response from Gemini.')
    }
  }

  async streamResponse(
    prompt: string,
    callback: (chunk: string) => void,
    options: { model?: string; systemInstruction?: string } = {}
  ) {
    const modelName =
      options.model || process.env.GEMINI_MODEL || 'gemini-1.5-flash'
    const modelConfig: any = { model: modelName }

    if (options.systemInstruction) {
      modelConfig.systemInstruction = options.systemInstruction
    }

    const model = this.genAI.getGenerativeModel(modelConfig)
    const result = await model.generateContentStream(prompt)
    for await (const chunk of result.stream) {
      callback(chunk.text())
    }
  }
}
