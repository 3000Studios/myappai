import React from 'react'
import { Link } from 'react-router-dom'
import PrismHeadline from '../components/PrismHeadline.jsx'

export default function NotFoundPage() {
  return (
    <div className="section-card centered-card">
      <span className="eyebrow">404</span>
      <PrismHeadline text="That route is not part of MyAppAI." />
      <p className="section-intro">
        Head back to the homepage or open the admin login to continue working
        from the operator platform.
      </p>
      <Link className="button button--primary" to="/">
        Return home
      </Link>
    </div>
  )
}
