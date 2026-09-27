import React from 'react'
import { Link } from 'react-router-dom'

export default function PrivacyPage() {
return (
  <article className="prose-page">
    <header className="prose-header">
      <h1>Privacy Policy</h1>
      <p className="prose-lead">
        Last updated: September 27, 2026
      </p>
    </header>

    <section className="prose-section">
      <h2>Overview</h2>
      <p>
        MyAppAI is a free public resource; we collect as little personal data as possible.
      </p>
    </section>

    <section className="prose-section">
      <h2>Information We Collect</h2>
      <p>
        Contact-form data: when you write to us, we receive your name, email address, and message. We use this information only to respond to you. It is never added to mailing lists, and never sold.
      </p>
      <p>
        Automatically collected technical data: like most websites, our hosting infrastructure records basic technical data such as IP addresses, browser types, and pages visited. This is used for security and diagnostics, and is retained for a limited time.
      </p>
      <p>
        Privacy-respecting analytics: we measure aggregate page views to understand which content readers find useful. We do not build individual profiles.
      </p>
    </section>

    <section className="prose-section">
      <h2>Advertising and Cookies</h2>
      <p>
        This site displays ads served by Google AdSense. Google and its partners use cookies — including the DART cookie — to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising at <a href="https://adssettings.google.com" rel="noopener noreferrer">Google's Ads Settings</a>, and control cookies in your browser settings.
      </p>
    </section>

    <section className="prose-section">
      <h2>Your Rights</h2>
      <p>
        You can request access to or deletion of your contact messages at any time via the <Link to="/contact">contact form</Link>.
      </p>
    </section>
  </article>
)
}
