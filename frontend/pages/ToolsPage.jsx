import React, { useState } from 'react'

const TOOLS = [
{
  category: 'AI Coding Assistants',
  items: [
    {
      name: 'Cursor',
      tagline: 'The AI-first code editor',
      description: 'Cursor is a fork of VS Code with deep AI integration. It can write, edit, and explain code across your entire codebase using GPT-4 and Claude. Best for developers who want AI that understands project context.',
      url: 'https://cursor.sh',
      affiliate: 'https://cursor.sh',
      badge: 'Free tier available',
      tags: ['coding', 'editor', 'AI'],
    },
    {
      name: 'GitHub Copilot',
      tagline: 'AI pair programmer by GitHub',
      description: 'GitHub Copilot suggests code completions inline as you type, powered by OpenAI Codex. Integrates with VS Code, JetBrains, and Neovim. Essential for any developer writing code daily.',
      url: 'https://github.com/features/copilot',
      affiliate: 'https://github.com/features/copilot',
      badge: '$10/mo',
      tags: ['coding', 'autocomplete', 'AI'],
    },
    {
      name: 'Replit',
      tagline: 'Build and deploy apps in the browser',
      description: 'Replit is a browser-based IDE with built-in AI that can scaffold entire apps from a prompt. Great for prototyping, learning, and shipping small projects without local setup.',
      url: 'https://replit.com',
      affiliate: 'https://replit.com',
      badge: 'Free tier available',
      tags: ['coding', 'browser IDE', 'AI'],
    },
  ],
},
{
  category: 'AI Writing & Content',
  items: [
    {
      name: 'Claude (Anthropic)',
      tagline: 'Thoughtful, safe AI assistant',
      description: 'Claude by Anthropic excels at long-form writing, analysis, and nuanced reasoning. Claude 3.5 Sonnet is one of the best models for technical writing, summarization, and code review.',
      url: 'https://claude.ai',
      affiliate: 'https://claude.ai',
      badge: 'Free tier available',
      tags: ['writing', 'AI', 'assistant'],
    },
    {
      name: 'ChatGPT',
      tagline: 'The world\'s most popular AI assistant',
      description: 'OpenAI\'s ChatGPT is the benchmark for conversational AI. GPT-4o handles text, images, and code. The Plus plan unlocks faster responses, plugins, and the latest models.',
      url: 'https://chat.openai.com',
      affiliate: 'https://chat.openai.com',
      badge: 'Free tier available',
      tags: ['writing', 'AI', 'assistant'],
    },
    {
      name: 'Jasper',
      tagline: 'AI content platform for marketing teams',
      description: 'Jasper is purpose-built for marketing copy: blog posts, ads, emails, and social content. It includes brand voice training and team collaboration features.',
      url: 'https://jasper.ai',
      affiliate: 'https://jasper.ai',
      badge: '$39/mo',
      tags: ['writing', 'marketing', 'AI'],
    },
  ],
},
{
  category: 'AI Deployment & Infrastructure',
  items: [
    {
      name: 'Cloudflare',
      tagline: 'Fast, global deployment for any site',
      description: 'Cloudflare Pages offers free static site hosting with global CDN, instant deploys from Git, and Workers for serverless functions. The best free deployment platform for frontend projects.',
      url: 'https://cloudflare.com',
      affiliate: 'https://cloudflare.com',
      badge: 'Free tier available',
      tags: ['deployment', 'CDN', 'infrastructure'],
    },
    {
      name: 'Railway',
      tagline: 'Deploy backends in seconds',
      description: 'Railway makes it trivially easy to deploy Node.js, Python, and other backend services. Connect your GitHub repo and Railway handles the rest — databases, environment variables, and scaling.',
      url: 'https://railway.app',
      affiliate: 'https://railway.app',
      badge: 'Free tier available',
      tags: ['deployment', 'backend', 'infrastructure'],
    },
    {
      name: 'Vercel',
      tagline: 'Frontend cloud for Next.js and beyond',
      description: 'Vercel is the gold standard for deploying Next.js apps. Instant previews, edge functions, and analytics built in. Best for teams shipping React and Next.js projects.',
      url: 'https://vercel.com',
      affiliate: 'https://vercel.com',
      badge: 'Free tier available',
      tags: ['deployment', 'frontend', 'Next.js'],
    },
  ],
},
{
  category: 'AI Automation & Productivity',
  items: [
    {
      name: 'Make (formerly Integromat)',
      tagline: 'Visual automation for any workflow',
      description: 'Make lets you build complex multi-step automations with a visual drag-and-drop interface. Connect 1,000+ apps including OpenAI, Slack, Google Sheets, and Airtable.',
      url: 'https://make.com',
      affiliate: 'https://make.com',
      badge: 'Free tier available',
      tags: ['automation', 'no-code', 'AI'],
    },
    {
      name: 'Zapier',
      tagline: 'Automate your work across 6,000+ apps',
      description: 'Zapier is the most widely used automation platform. Build Zaps that trigger actions across thousands of apps. The AI features let you describe automations in plain English.',
      url: 'https://zapier.com',
      affiliate: 'https://zapier.com',
      badge: 'Free tier available',
      tags: ['automation', 'no-code', 'productivity'],
    },
    {
      name: 'Notion AI',
      tagline: 'AI built into your workspace',
      description: 'Notion AI adds writing assistance, summarization, and Q&A directly inside your Notion workspace. Great for teams who already live in Notion and want AI without switching tools.',
      url: 'https://notion.so',
      affiliate: 'https://notion.so',
      badge: '$8/mo add-on',
      tags: ['productivity', 'writing', 'AI'],
    },
  ],
},
]

export default function ToolsPage() {
const [activeCategory, setActiveCategory] = useState('All')
const categories = ['All', ...TOOLS.map(g => g.category)]

const filtered = activeCategory === 'All'
  ? TOOLS
  : TOOLS.filter(g => g.category === activeCategory)

return (
  <article className="prose-page tools-page">
    <header className="prose-header">
      <h1>Best AI Tools for Developers in 2025</h1>
      <p className="prose-lead">
        A curated directory of the AI tools we actually use and recommend — for coding, writing, deployment, and automation. Updated regularly.
      </p>
    </header>

    <nav className="tools-filter" aria-label="Filter by category">
      {categories.map(cat => (
        <button
          key={cat}
          className={`tools-filter__btn ${activeCategory === cat ? 'active' : ''}`}
          onClick={() => setActiveCategory(cat)}
        >
          {cat}
        </button>
      ))}
    </nav>

    {filtered.map(group => (
      <section key={group.category} className="tools-group">
        <h2>{group.category}</h2>
        <div className="tools-grid">
          {group.items.map(tool => (
            <div key={tool.name} className="tool-card">
              <div className="tool-card__header">
                <h3>{tool.name}</h3>
                <span className="tool-card__badge">{tool.badge}</span>
              </div>
              <p className="tool-card__tagline">{tool.tagline}</p>
              <p className="tool-card__desc">{tool.description}</p>
              <div className="tool-card__tags">
                {tool.tags.map(tag => (
                  <span key={tag} className="tool-tag">{tag}</span>
                ))}
              </div>
              <a
                href={tool.affiliate}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="button button--primary tool-card__cta"
              >
                Visit {tool.name} →
              </a>
            </div>
          ))}
        </div>
      </section>
    ))}

    <section className="prose-section tools-disclosure">
      <p><em>Disclosure: Some links on this page are affiliate links. If you sign up through our link, we may earn a commission at no extra cost to you. We only recommend tools we genuinely use or have evaluated.</em></p>
    </section>
  </article>
)
}
