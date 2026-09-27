import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'
import { blogPosts } from '../src/siteData.js'

export default function BlogIndexPage() {
  return (
    <article className="stack-2xl">
      <section className="section-card article-hero">
        <span className="meta-line">Guides & Tutorials</span>
        <PrismHeadline text="Blog" />
        <p className="section-intro">
          Practical guides, honest tool comparisons, and tutorials for developers and teams working with AI.
        </p>
      </section>

      <section className="stack-xl article-stack">
        {blogPosts.map((post) => (
          <div key={post.slug} className="article-section section-card">
            <span className="meta-line">{post.publishedAt}</span>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <div className="hero__actions">
              <Link className="button button--primary" to={`/blog/${post.slug}`}>
                Read article
              </Link>
            </div>
          </div>
        ))}
      </section>
    </article>
  )
}
