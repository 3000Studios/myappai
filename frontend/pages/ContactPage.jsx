import React, { useState } from 'react'
import { SUPPORT_EMAIL, SITE_DISPLAY_NAME } from '../src/siteMeta.js'

export default function ContactPage() {
const [submitted, setSubmitted] = useState(false)
const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

function handleChange(e) {
setForm({ ...form, [e.target.name]: e.target.value })
}

function handleSubmit(e) {
e.preventDefault()
const subject = form.subject || 'Contact from ' + form.name
const body = 'Name: ' + form.name + ' | Email: ' + form.email + ' | Message: ' + form.message
const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
window.location.href = mailto
setSubmitted(true)
}
    {submitted ? (
      <div className="contact-success">
        <p>Thanks! Your email client should have opened. If not, email us directly at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </div>
    ) : (
  <section className="prose-section">
    <h2>Corrections to articles</h2>
    <p>
      Technical accuracy is the foundation of this site. If you spot an error in an article, report it via the contact form with the article title and a description of the problem. Corrections are reviewed promptly.
    </p>
  </section>

  <section className="prose-section">
    <h2>Topic requests</h2>
    <p>
      Reader requests influence the publishing schedule. If there is a topic you would like us to cover, tell us via the contact form.
    </p>
  </section>

  <section className="prose-section">
    <h2>Feedback on the site</h2>
    <p>
      Found a broken link, confusing navigation, or something else that is not working? We want to hear about it.
    </p>
  </section>

  <section className="prose-section">
    <h2>What to Expect</h2>
    <p>
      We read every message. Straightforward corrections usually get acknowledged within a few days; longer questions may take a week or more.
    </p>
  </section>

  <section className="prose-section">
    <h2>Before You Write</h2>
    <p>
      When reporting an issue with an article, include the article title and URL. For technical problems, describe what you expected to happen versus what actually happened.
    </p>
  </section>
</article>
)
}

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name" />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com" />
        </div>
        <div className="form-group">
          <label htmlFor="subject">Subject</label>
          <input id="subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required rows={6} value={form.message} onChange={handleChange} placeholder="Tell us what you need..." />
        </div>
        <button type="submit" className="button button--primary">Send Message</button>
      </form>
    )}
  </section>

return (
<article className="prose-page">
  <header className="prose-header">
    <h1>Contact Us</h1>
  </header>

  <section className="prose-section">
    <h2>Get in Touch</h2>
    <p>
      We welcome questions, corrections, and suggestions from readers.
    </p>
