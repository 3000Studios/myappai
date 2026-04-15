import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config({ path: '.env.local' });
dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('Error: GOOGLE_API_KEY or GEMINI_API_KEY not found in environment.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const TARGET_FILE = path.join(process.cwd(), 'src', 'app', 'lib', 'blogData.ts');

const TOPICS = [
  'The Psychology of Color in Web Design',
  'Server Components vs Client Components in 2025',
  'How to Monetize Digital Products Effectively',
  'The Rise of Micro-Interactions',
  'Web Accessibility: Beyond Compliance',
  'Sustainable Web Design',
  'Zero-Trust Security for Web Apps',
];

async function generatePost() {
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  console.log(`Generating content for: "${topic}"...`);

  const prompt = `
    Write a high-quality, SEO-optimized blog post for a premium creative studio "3000 Studios".
    Topic: "${topic}"
    
    Return ONLY a JSON object with the following structure (no markdown code blocks):
    {
      "title": "A catchy title",
      "excerpt": "A compelling 2-sentence summary",
      "content": "The full blog post content. Use \\n for line breaks. 300-500 words. Professional and expert tone.",
      "category": "Design/Technology/Business/Marketing",
      "tags": ["tag1", "tag2"],
      "readTime": "X min read"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown code blocks
    text = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const postData = JSON.parse(text);
    const id = postData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    const date = new Date().toISOString().split('T')[0];

    const newPost = {
      id,
      ...postData,
      author: '3000 Studios AI',
      date,
      featured: false,
    };

    appendToBlogData(newPost);
  } catch {
    console.error('API Generation failed, switching to Mock Fallback...');
    generateMockPost();
  }
}

function generateMockPost() {
  const titles = [
    'The Future of Digital Aesthetics: 2025 Prediction',
    'Why Speed is the Ultimate Feature',
    'mastering Dark Mode Design Patterns',
    'The Ethics of AI in Creative Work',
    'Minimalism: When Less is Actually More',
  ];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const id = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const date = new Date().toISOString().split('T')[0];

  const mockPost = {
    id,
    title,
    excerpt:
      'An in-depth look at how this trend is reshaping the industry standards for the coming year.',
    content: `In the rapidly evolving world of digital design, staying ahead of the curve is not just an advantage—it's a necessity. ${title} represents a paradigm shift in how we approach user experience.
\n
We are seeing a move towards more immersive, tactile interfaces that bridge the gap between physical and digital. This is not just about aesthetics; it's about functionality and emotional connection.
\n
Key takeaways for 2025 involve focusing on performance, accessibility, and genuine user value. At 3000 Studios, we are pioneering these techniques to deliver award-winning experiences for our clients.`,
    category: 'Design',
    author: '3000 Studios Team',
    date,
    readTime: '5 min read',
    tags: ['Design', 'Future', 'Trends'],
    featured: false,
  };

  appendToBlogData(mockPost);
}

function appendToBlogData(post: unknown) {
  try {
    const fileContent = fs.readFileSync(TARGET_FILE, 'utf-8');

    // Find the end of the array
    const arrayEndIndex = fileContent.lastIndexOf('];');

    if (arrayEndIndex === -1) {
      throw new Error('Could not find end of blogPosts array in file.');
    }

    // Check if we need to add a comma
    const lastChar = fileContent.slice(0, arrayEndIndex).trim().slice(-1);
    const prefix = lastChar === ',' ? '' : ',';

    // Insert with robust comma handling
    const newEntryString = `  ${prefix}
  {
    id: "${post.id}",
    title: "${post.title}",
    excerpt: "${post.excerpt}",
    content: \`${post.content}\`,
    category: "${post.category}",
    author: "${post.author}",
    date: "${post.date}",
    readTime: "${post.readTime}",
    tags: ${JSON.stringify(post.tags)},
    featured: ${post.featured}
  }`;

    // Insert before the closing bracket
    const updatedContent =
      fileContent.slice(0, arrayEndIndex) + newEntryString + fileContent.slice(arrayEndIndex);

    fs.writeFileSync(TARGET_FILE, updatedContent, 'utf-8');
    console.log("", error);
  }
}

generatePost();

