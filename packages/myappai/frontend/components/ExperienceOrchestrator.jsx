import React, { useEffect } from 'react'

function installRevealObserver() {
  const targets = Array.from(
    document.querySelectorAll(
      '.section-card, .hero, .content-card, .auth-card, .operator-result-card, .operator-panel, .admin-sidebar, .admin-topbar, .log-card'
    )
  )

  targets.forEach((target) => target.classList.add('ux-reveal'))

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('ux-reveal--visible')
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.12,
    }
  )

  targets.forEach((target) => observer.observe(target))

  return () => observer.disconnect()
}

function installSonicFeedback() {
  let audioContext = null

  function playClickTone() {
    const AudioContextCtor =
      window.AudioContext || window.webkitAudioContext || null

    if (!AudioContextCtor) {
      return
    }

    audioContext = audioContext ?? new AudioContextCtor()

    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    const now = audioContext.currentTime

    oscillator.type = 'triangle'
    oscillator.frequency.setValueAtTime(420, now)
    oscillator.frequency.exponentialRampToValueAtTime(640, now + 0.08)

    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.02, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14)

    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.16)
  }

  function handlePointerDown(event) {
    if (!event.target.closest('a, button, [role="button"]')) {
      return
    }

    playClickTone()
  }

  document.addEventListener('pointerdown', handlePointerDown)

  return () => {
    document.removeEventListener('pointerdown', handlePointerDown)
  }
}

function installMotionTelemetry() {
  function handleScroll() {
    const progress =
      window.scrollY /
      Math.max(document.body.scrollHeight - window.innerHeight, 1)

    document.documentElement.style.setProperty(
      '--scroll-progress',
      String(Math.min(Math.max(progress, 0), 1))
    )
  }

  function handleOrientation(event) {
    const beta = Number(event.beta ?? 0)
    const gamma = Number(event.gamma ?? 0)

    document.documentElement.style.setProperty(
      '--tilt-x',
      `${Math.max(Math.min(gamma / 20, 1), -1)}`
    )
    document.documentElement.style.setProperty(
      '--tilt-y',
      `${Math.max(Math.min(beta / 30, 1), -1)}`
    )
  }

  handleScroll()

  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('deviceorientation', handleOrientation)

  return () => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('deviceorientation', handleOrientation)
  }
}

export default function ExperienceOrchestrator() {
  useEffect(() => {
    const cleanupReveal = installRevealObserver()
    const cleanupSound = installSonicFeedback()
    const cleanupMotion = installMotionTelemetry()

    return () => {
      cleanupReveal()
      cleanupSound()
      cleanupMotion()
    }
  }, [])

  return null
}
