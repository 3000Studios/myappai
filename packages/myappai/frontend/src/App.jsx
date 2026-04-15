import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SiteFrame from '../components/SiteFrame.jsx'
import ExperienceOrchestrator from '../components/ExperienceOrchestrator.jsx'
import AdminLayout from '../components/admin/AdminLayout.jsx'
import HomePage from '../pages/HomePage.jsx'
import AboutPage from '../pages/AboutPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import ToolsPage from '../pages/ToolsPage.jsx'
import BlogPostPage from '../pages/BlogPostPage.jsx'
import AdminLoginPage from '../pages/AdminLoginPage.jsx'
import AdminOperatorPage from '../pages/admin/AdminOperatorPage.jsx'
import AdminOpenClawPage from '../pages/admin/AdminOpenClawPage.jsx'
import AdminLogsPage from '../pages/admin/AdminLogsPage.jsx'
import AdminSecureLogsPage from '../pages/admin/AdminSecureLogsPage.jsx'
import OpenClaw from '../pages/OpenClaw.jsx'
import RevenueStreams from '../pages/RevenueStreams.jsx'
import ReferralZone from '../pages/ReferralZone.jsx'
import AdminReferralUpload from '../pages/AdminReferralUpload.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { SiteRuntimeProvider } from './SiteRuntimeContext.jsx'
import { theme } from './siteData.js'
import '../styles/app.css'

function applyTheme(themeConfig) {
const palette = themeConfig.palette ?? {}
for (const [key, value] of Object.entries(palette)) {
  document.documentElement.style.setProperty(`--${key}`, value)
}
}

export default function App() {
useEffect(() => {
  applyTheme(theme)
}, [])

return (
  <SiteRuntimeProvider>
    <ExperienceOrchestrator />
    <Routes>
      <Route element={<SiteFrame />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/openclaw" element={<OpenClaw />} />
        <Route path="/revenue" element={<RevenueStreams />} />
        <Route path="/referral/:referralId" element={<ReferralZone />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="operator" replace />} />
        <Route path="operator" element={<AdminOperatorPage />} />
        <Route path="openclaw" element={<AdminOpenClawPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="secure-logs" element={<AdminSecureLogsPage />} />
        <Route path="referral-upload" element={<AdminReferralUpload />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </SiteRuntimeProvider>
)
}