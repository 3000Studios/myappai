import React, { useMemo, useState } from 'react'
import PrismHeadline from '../../components/PrismHeadline.jsx'
import { useAdminDashboard } from '../../context/AdminDashboardContext.jsx'
import {
  askGemini,
  askGeminiStream,
  transcribeWhisper,
} from '../../src/adminApi.js'

const GEMINI_HISTORY_KEY = 'myappai.openclaw.geminiHistory'
const GEMINI_PRESETS = [
  {
    label: 'Operator assistant',
    instruction:
      'You are a specialized MyAppAI assistant helping the site owner.',
  },
  {
    label: 'Release manager',
    instruction:
      'You are a release manager. Return concise release notes, risks, and rollback steps.',
  },
  {
    label: 'SEO optimizer',
    instruction:
      'You are an SEO strategist for myappai.net. Suggest high-impact, low-risk content updates.',
  },
]

function formatBytes(value) {
  const bytes = Number(value ?? 0)
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B'
  }
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(
    units.length - 1,
    Math.floor(Math.log(bytes) / Math.log(1024))
  )
  const size = bytes / 1024 ** index
  return `${size.toFixed(index === 0 ? 0 : 1)} ${units[index]}`
}

async function readAsDataUrl(file) {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      resolve(typeof result === 'string' ? result : '')
    }
    reader.onerror = () => reject(new Error('Failed to read media file.'))
    reader.readAsDataURL(file)
  })
}

export default function AdminOpenClawPage() {
  const {
    adminSession,
    error: dashboardError,
    setError,
    handleDeploy,
  } = useAdminDashboard()
  const [file, setFile] = useState(null)
  const [language, setLanguage] = useState('')
  const [prompt, setPrompt] = useState('')
  const [busy, setBusy] = useState(false)
  const [result, setResult] = useState(null)
  const [geminiPrompt, setGeminiPrompt] = useState('')
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash')
  const [geminiInstruction, setGeminiInstruction] = useState(
    'You are a specialized MyAppAI assistant helping the site owner.'
  )
  const [useStreamMode, setUseStreamMode] = useState(true)
  const [autoDeployAfterGemini, setAutoDeployAfterGemini] = useState(false)
  const [geminiBusy, setGeminiBusy] = useState(false)
  const [geminiResult, setGeminiResult] = useState(null)
  const [geminiHistory, setGeminiHistory] = useState(() => {
    if (typeof window === 'undefined') {
      return []
    }
    try {
      const raw = window.localStorage.getItem(GEMINI_HISTORY_KEY)
      const parsed = raw ? JSON.parse(raw) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const fileSummary = useMemo(() => {
    if (!file) {
      return 'No file selected.'
    }
    return `${file.name} • ${formatBytes(file.size)} • ${file.type || 'unknown'}`
  }, [file])

  async function handleTranscribe() {
    if (!file) {
      setError('Choose an audio/video file to transcribe.')
      return
    }

    try {
      setBusy(true)
      setError('')
      setResult(null)

      const dataUrl = await readAsDataUrl(file)
      const response = await transcribeWhisper(adminSession, {
        fileName: file.name,
        mimeType: file.type,
        base64Data: dataUrl,
        language: language.trim() || undefined,
        prompt: prompt.trim() || undefined,
      })

      setResult(response)
    } catch (transcribeError) {
      setError(transcribeError.message)
    } finally {
      setBusy(false)
    }
  }

  async function handleAskGemini() {
    if (!geminiPrompt.trim()) {
      setError('Enter a prompt for Gemini.')
      return
    }

    try {
      setGeminiBusy(true)
      setError('')
      setGeminiResult(null)
      const payload = {
        prompt: geminiPrompt.trim(),
        model: geminiModel.trim() || undefined,
        systemInstruction: geminiInstruction.trim() || undefined,
      }

      if (useStreamMode) {
        let streamedText = ''
        setGeminiResult({
          ok: true,
          model: payload.model || 'gemini-1.5-flash',
          text: '',
          stream: true,
        })
        await askGeminiStream(adminSession, payload, (chunk) => {
          streamedText += chunk
          setGeminiResult({
            ok: true,
            model: payload.model || 'gemini-1.5-flash',
            text: streamedText,
            stream: true,
          })
        })
      } else {
        const response = await askGemini(adminSession, payload)
        setGeminiResult(response)
      }

      const historyEntry = geminiPrompt.trim()
      setGeminiHistory((current) => {
        const next = [
          historyEntry,
          ...current.filter((item) => item !== historyEntry),
        ].slice(0, 8)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(GEMINI_HISTORY_KEY, JSON.stringify(next))
        }
        return next
      })

      if (autoDeployAfterGemini) {
        await handleDeploy()
      }
    } catch (geminiError) {
      setError(geminiError.message)
    } finally {
      setGeminiBusy(false)
    }
  }

  // Your updated OpenClaw AI page should now have the Gemini Test Panel section below
  // ... rest of the component

  return (
    <div className="admin-section stack-lg">
      <div className="admin-section__intro">
        <span className="eyebrow">OpenClaw AI</span>
        <PrismHeadline text="Whisper transcription (admin-only)" />
        <p className="section-intro">
          Upload media and transcribe it via your secured operator API. Requests
          require a valid admin session cookie and are executed server-side.
        </p>
      </div>

      {dashboardError ? (
        <div className="error-banner admin-error">{dashboardError}</div>
      ) : null}

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <span className="eyebrow">Input</span>
            <h2>Media upload</h2>
          </div>
        </div>

        <div className="stack-md">
          <label className="field">
            <span>Media file (m4a, mp3, mp4, mpeg, mpga, wav, webm)</span>
            <input
              type="file"
              accept=".m4a,.mp3,.mp4,.mpeg,.mpga,.wav,.webm,audio/*,video/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              disabled={busy}
            />
            <span className="field-note">{fileSummary}</span>
          </label>

          <div className="lead-form">
            <label className="field">
              <span>Language (optional)</span>
              <input
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                placeholder="en"
                disabled={busy}
              />
            </label>
            <label className="field">
              <span>Prompt hint (optional)</span>
              <input
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Names, context, vocabulary…"
                disabled={busy}
              />
            </label>
          </div>

          <div className="admin-actions admin-actions--stack">
            <button
              className="button button--primary"
              type="button"
              onClick={() => void handleTranscribe()}
              disabled={busy || !file}
            >
              {busy ? 'Transcribing…' : 'Transcribe'}
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => {
                setFile(null)
                setResult(null)
                setPrompt('')
                setLanguage('')
                setError('')
              }}
              disabled={busy}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      <section className="admin-card admin-card--compact">
        <div className="admin-card__header">
          <div>
            <span className="eyebrow">Output</span>
            <h2>Transcript</h2>
          </div>
        </div>
        {result?.text ? (
          <pre className="result-panel result-panel--inline">{result.text}</pre>
        ) : (
          <p className="section-intro">
            Run a transcription to see the extracted text here.
          </p>
        )}

        {result?.segments?.length ? (
          <pre className="result-panel result-panel--inline">
            {JSON.stringify(
              {
                model: result.model,
                language: result.language,
                durationSeconds: result.durationSeconds,
                segments: result.segments,
              },
              null,
              2
            )}
          </pre>
        ) : null}
      </section>

      <section className="admin-card">
        <div className="admin-card__header">
          <div>
            <span className="eyebrow">Gemini test</span>
            <h2>Prompt playground</h2>
          </div>
        </div>
        <div className="stack-md">
          <label className="field">
            <span>Prompt</span>
            <textarea
              value={geminiPrompt}
              onChange={(event) => setGeminiPrompt(event.target.value)}
              rows={5}
              placeholder="Ask Gemini something..."
              disabled={geminiBusy}
            />
          </label>
          <div className="operator-next-steps">
            <span className="meta-line">Recent prompts</span>
            <div className="operator-next-steps__list">
              {geminiHistory.length ? (
                geminiHistory.map((item) => (
                  <button
                    key={item}
                    className="operator-chip"
                    type="button"
                    onClick={() => setGeminiPrompt(item)}
                    disabled={geminiBusy}
                  >
                    {item}
                  </button>
                ))
              ) : (
                <span className="signal-pill">
                  Gemini prompt history will appear here after your first run.
                </span>
              )}
            </div>
          </div>
          <div className="lead-form">
            <label className="field">
              <span>Model</span>
              <input
                value={geminiModel}
                onChange={(event) => setGeminiModel(event.target.value)}
                placeholder="gemini-1.5-flash"
                disabled={geminiBusy}
              />
            </label>
            <label className="field">
              <span>System instruction (optional)</span>
              <input
                value={geminiInstruction}
                onChange={(event) => setGeminiInstruction(event.target.value)}
                placeholder="You are a specialized MyAppAI assistant..."
                disabled={geminiBusy}
              />
            </label>
          </div>
          <div className="operator-next-steps">
            <span className="meta-line">System instruction presets</span>
            <div className="operator-next-steps__list">
              {GEMINI_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  className="operator-chip"
                  type="button"
                  onClick={() => setGeminiInstruction(preset.instruction)}
                  disabled={geminiBusy}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
          <label className="operator-ship-live">
            <input
              type="checkbox"
              checked={useStreamMode}
              onChange={(event) => setUseStreamMode(event.target.checked)}
              disabled={geminiBusy}
            />
            <span>Stream response chunks live (recommended)</span>
          </label>
          <label className="operator-ship-live">
            <input
              type="checkbox"
              checked={autoDeployAfterGemini}
              onChange={(event) =>
                setAutoDeployAfterGemini(event.target.checked)
              }
              disabled={geminiBusy}
            />
            <span>
              Smart auto-deploy after successful Gemini run (uses existing admin
              deploy pipeline)
            </span>
          </label>
          <div className="admin-actions admin-actions--stack">
            <button
              className="button button--primary"
              type="button"
              onClick={() => void handleAskGemini()}
              disabled={geminiBusy || !geminiPrompt.trim()}
            >
              {geminiBusy ? 'Thinking…' : 'Ask Gemini'}
            </button>
            <button
              className="button button--ghost"
              type="button"
              onClick={() => {
                setGeminiResult(null)
                setGeminiPrompt('')
              }}
              disabled={geminiBusy}
            >
              Clear
            </button>
          </div>
          {geminiResult?.text ? (
            <pre className="result-panel result-panel--inline">
              {geminiResult.text}
            </pre>
          ) : (
            <p className="section-intro">
              Submit a prompt to test your admin-only Gemini endpoint.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
