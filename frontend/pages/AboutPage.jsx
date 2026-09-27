import React from 'react'
import { SUPPORT_EMAIL } from '../src/siteMeta.js'

export default function AboutPage() {
return (
  <article className="prose-page">
    <header className="prose-header">
      <h1>About MyAppAI</h1>
    </header>

    <section className="prose-section">
      <h2>What This Site Is</h2>
      <p>
        MyAppAI is a public resource for anyone trying to make sense of the AI software landscape. We publish practical guides, honest tool comparisons, and tutorials for developers and teams who want to use AI applications effectively — not marketing copy, and not hype. The site covers two things: understanding AI tools (what they do, how they work, where they fall short) and building with them (tutorials and walkthroughs for developers integrating AI into real projects).
      </p>
    </section>

    <section className="prose-section">
      <h2>How We Work</h2>
      <p>
        Our articles are written and reviewed by working developers. When we compare tools, we describe what each one actually does well and where it disappoints — including the limitations vendors leave off their pricing pages. When we publish a tutorial, the code is meant to run, not just to read. We don't publish filler. Where we've formed an opinion from experience, we say so plainly.
      </p>
    </section>

    <section className="prose-section">
      <h2>What This Site Is Not</h2>
      <p>
        MyAppAI is not a private network, a members-only club, or a gated community. Everything here is public and free to read. We're not selling access, courses, or certifications, and we don't cold-pitch readers.
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
