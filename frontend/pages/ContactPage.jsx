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
const mailto = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(form.subject || 'Contact from ' + form.name)}&body=${encodeURIComponent('Name: ' + form.name + '\nEmail: ' + form.email + '\n\n' + form.message)}`
window.location.href = mailto
setSubmitted(true)
}

return (
<article className="prose-page">
  <header className="prose-header">
    <h1>Contact Us</h1>
    <p className="prose-lead">
      Have a question, bug report, or partnership inquiry? We read every message and respond within 1-2 business days.
    </p>
  </header>

  <section className="prose-section">
    <h2>Get in Touch</h2>
    <p>
      Email us directly at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> or use the form below.
    </p>

    {submitted ? (
      <div className="contact-success">
        <p>Thanks! Your email client should have opened. If not, email us directly at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
      </div>
    ) : (
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

  <section className="prose-section">
    <h2>Other Ways to Reach Us</h2>
    <ul>
      <li><b>Email:</b> <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
      <li><b>GitHub:</b> <a href="https://github.com/3000Studios" rel="noopener noreferrer">github.com/3000Studios</a></li>
      <li><b>Response time:</b> 1-2 business days</li>
    </ul>
  </section>
</article>
)
}