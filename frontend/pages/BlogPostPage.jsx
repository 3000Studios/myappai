import React from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import AdSenseSlot from '../components/AdSenseSlot.jsx'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { blogLookup } from '../src/siteData.js'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = blogLookup[slug]

  if (!post) {
    return <Navigate to="/blog" replace />
  }

  return (
    <article className="stack-2xl">
      <section className="section-card article-hero">
        <span className="meta-line">{post.publishedAt}</span>
        <PrismHeadline text={post.title} />
        <p className="section-intro">{post.excerpt}</p>
      </section>

      <section className="stack-xl article-stack">
        {post.sections.map((section, index) => (
          <React.Fragment key={section.heading}>
            <div className="article-section section-card">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
            {index === 1 ? <AdSenseSlot slot="article-inline-1" /> : null}
          </React.Fragment>
        ))}
      </section>

      {post.cta ? (
        <section className="section-card cta-band">
          <div>
            <span className="eyebrow">{post.cta.eyebrow}</span>
            <h2>{post.cta.heading}</h2>
            <p className="section-intro">{post.cta.body}</p>
          </div>
          <div className="hero__actions">
            <Link className="button button--primary" to={post.cta.primaryHref}>
              {post.cta.primaryLabel}
            </Link>
          </div>
        </section>
      ) : null}
    </article>
  )
}
