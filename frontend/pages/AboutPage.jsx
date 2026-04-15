import React from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function AboutPage() {
return (
  <article className="prose-page">
    <header className="prose-header">
      <h1>About MyAppAI</h1>
      <p className="prose-lead">
        MyAppAI is a browser-based operator platform built for developers, indie hackers, and small teams who want to research, plan, edit repositories, and deploy live sites from one authenticated workspace.
      </p>
    </header>

    <section className="prose-section">
      <h2>What We Build</h2>
      <p>
        We build tools that collapse the gap between idea and live product. MyAppAI gives you a single control plane where you can browse for source-backed answers, write and review code changes, manage repository content safely, and trigger live deployments to Cloudflare Pages or any static host.
      </p>
      <p>
        Our platform is designed around one core belief: you should not need to juggle a dozen tabs, tools, and CLI windows to keep a site running. MyAppAI brings research, code, and deployment into one authenticated session.
      </p>
    </section>

    <section className="prose-section">
      <h2>Who It's For</h2>
      <ul>
        <li><b>Indie developers and solopreneurs</b> who ship fast and need everything in one place</li>
        <li><b>Small dev teams</b> who want safe, reviewable repository operations without accidental breaks</li>
        <li><b>AI builders</b> exploring how to integrate LLMs into real development workflows</li>
        <li><b>Content creators and marketers</b> who need to update sites without touching code directly</li>
      </ul>
    </section>

    <section className="prose-section">
      <h2>Our Stack</h2>
      <p>
        MyAppAI is built on open, proven technology: React for the frontend, Cloudflare Pages for deployment, GitHub for version control, and OpenAI and Gemini for AI orchestration. Everything is designed to be auditable, reversible, and fast.
      </p>
    </section>

    <section className="prose-section">
      <h2>Built by 3000Studios</h2>
      <p>
        MyAppAI is a product of <a href="https://github.com/3000Studios" rel="noopener noreferrer">3000Studios</a>, an independent software studio focused on AI-powered developer tools, automation platforms, and open-source projects. We believe the best software is built by small teams moving fast with the right tools.
      </p>
    </section>

    <section className="prose-cta">
      <p>
        Questions or feedback? Reach us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </section>
  </article>
)
}