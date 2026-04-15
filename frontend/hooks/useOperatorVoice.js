import { useEffect, useMemo, useRef, useState } from 'react'

export function useOperatorVoice({ onTranscript }) {
  const recognitionRef = useRef(null)
  const [supported, setSupported] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition || null

    if (!SpeechRecognitionCtor) {
      setSupported(false)
      return
    }

    setSupported(true)
    const recognition = new SpeechRecognitionCtor()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognition.onresult = (event) => {
      const nextTranscript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? '')
        .join(' ')
        .trim()

      setTranscript(nextTranscript)

      const latest = event.results[event.results.length - 1]
      if (latest?.isFinal && nextTranscript) {
        onTranscript(nextTranscript)
      }
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
      recognitionRef.current = null
    }
  }, [onTranscript])

  const preferredVoice = useMemo(() => {
    const voices = window.speechSynthesis?.getVoices?.() ?? []
    const ranked = [...voices].sort((left, right) => {
      const leftScore = /google|samantha|aria|jenny|alloy|natural/i.test(
        left.name
      )
        ? 2
        : 0
      const rightScore = /google|samantha|aria|jenny|alloy|natural/i.test(
        right.name
      )
        ? 2
        : 0
      return rightScore - leftScore
    })

    return ranked[0] ?? null
  }, [])

  function startListening() {
    recognitionRef.current?.start()
  }

  function stopListening() {
    recognitionRef.current?.stop()
  }

  function speak(text) {
    if (!window.speechSynthesis || !text) {
      return
    }

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    if (preferredVoice) {
      utterance.voice = preferredVoice
    }
    utterance.rate = 1
    utterance.pitch = 1
    utterance.onstart = () => setSpeaking(true)
    utterance.onend = () => setSpeaking(false)
    utterance.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utterance)
  }

  return {
    supported,
    listening,
    speaking,
    transcript,
    startListening,
    stopListening,
    speak,
  }
}
