import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with environment variable or fallback for build safety
const apiKey = process.env.GOOGLE_AI_API_KEY || 'AI_KEY_PLACEHOLDER';
const genAI = new GoogleGenerativeAI(apiKey);

export type ProductInput = {
  name: string;
  description: string;
  audience: string;
  pricePoint?: string;
};

export type CampaignOutput = {
  headlines: string[];
  videoScripts: string[];
  shortFormScripts: string[];
  landingPageCopy: string;
  pricingStrategy: string;
};

export async function generateProductStrategy(
  product: ProductInput
): Promise<CampaignOutput | null> {
  // If no key provided (during build/test), return mock or fail gracefully
  if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn('GOOGLE_AI_API_KEY not set. Using mock generation.');
    return mockStrategy(product);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const prompt = `
      You are a world-class performance marketer and product strategist for a 3000 Studios production.
      
      Input Product:
      Name: ${product.name}
      Description: ${product.description}
      Target Audience: ${product.audience}
      Price Context: ${product.pricePoint || 'Not specified'}

      Task:
      Generate a comprehensive viral marketing campaign.
      
      Output strictly valid JSON with the following structure:
      {
        "headlines": ["5 high-conversion ad headlines"],
        "videoScripts": ["2 descriptions for 30s cinematic ads"],
        "shortFormScripts": ["3 scripts for TikTok/Reels/Shorts"],
        "landingPageCopy": "Compelling hero section and benefits text",
        "pricingStrategy": "Psychological pricing recommendation"
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Simple basic cleaning/parsing attempt
    const jsonString = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
    return JSON.parse(jsonString) as CampaignOutput;
  } catch (error: unknown) {
    console.error("", error);
    return null;
  }
}

function mockStrategy(product: ProductInput): CampaignOutput {
  return {
    headlines: [
      `Experience ${product.name} like never before.`,
      `The future of ${product.audience} is here.`,
      `${product.name}: 3000 Studios Edition.`,
    ],
    videoScripts: ['Cinematic reveal of the product with heavy bass and motion graphics.'],
    shortFormScripts: ['Quick cut montage showing key benefits.'],
    landingPageCopy: `Welcome to ${product.name}. Redefining what is possible for ${product.audience}.`,
    pricingStrategy: 'Premium skimming strategy: Start high, enable limited early access.',
  };
}

