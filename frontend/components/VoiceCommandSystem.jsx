import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, MicOff, Send, Volume2 } from 'lucide-react'
import './VoiceCommandSystem.css'

const VoiceCommandSystem = ({
  onCommand,
  onPreview,
  onShip,
  isPreviewReady,
  isProcessing,
}) => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [messages, setMessages] = useState([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [silenceTimer, setSilenceTimer] = useState(null)
  const [audioLevel, setAudioLevel] = useState(0)

  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const microphoneRef = useRef(null)
  const messagesEndRef = useRef(null)

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition =
        window.webkitSpeechRecognition || window.SpeechRecognition
      recognitionRef.current = new SpeechRecognition()

      recognitionRef.current.continuous = true
      recognitionRef.current.interimResults = true
      recognitionRef.current.maxAlternatives = 1
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript + interimTranscript)

        // Reset silence timer on speech
        if (silenceTimer) {
          clearTimeout(silenceTimer)
        }

        // Auto-stop after 5 seconds of silence
        const newSilenceTimer = setTimeout(() => {
          if (finalTranscript.trim()) {
            handleSendMessage(finalTranscript)
          }
          stopListening()
        }, 5000)

        setSilenceTimer(newSilenceTimer)
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'no-speech') {
          // Continue listening
        } else {
          stopListening()
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
        if (silenceTimer) {
          clearTimeout(silenceTimer)
        }
      }
    }

    return () => {
      if (silenceTimer) {
        clearTimeout(silenceTimer)
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [silenceTimer])

  // Initialize audio context for level monitoring
  const initializeAudio = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )()
      analyserRef.current = audioContextRef.current.createAnalyser()
      microphoneRef.current =
        audioContextRef.current.createMediaStreamSource(stream)

      analyserRef.current.fftSize = 256
      microphoneRef.current.connect(analyserRef.current)

      // Monitor audio levels
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)

      const updateAudioLevel = () => {
        if (isListening && analyserRef.current) {
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          setAudioLevel(average / 255)
          requestAnimationFrame(updateAudioLevel)
        }
      }

      updateAudioLevel()
    } catch (error) {
      console.error('Audio initialization failed:', error)
    }
  }, [isListening])

  // Start listening
  const startListening = async () => {
    if (recognitionRef.current) {
      try {
        await initializeAudio()
        recognitionRef.current.start()
        setIsListening(true)
        setTranscript('')
      } catch (error) {
        console.error('Failed to start recognition:', error)
      }
    }
  }

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    if (silenceTimer) {
      clearTimeout(silenceTimer)
      setSilenceTimer(null)
    }
    setIsListening(false)
  }

  // Handle sending message
  const handleSendMessage = (text) => {
    if (!text.trim()) return

    const userMessage = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setTranscript('')

    // Process command
    if (onCommand) {
      onCommand(text.trim())
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: generateAIResponse(text.trim()),
        sender: 'ai',
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, aiResponse])
      speakResponse(aiResponse.text)
    }, 1000)
  }

  // Generate AI response
  const generateAIResponse = (command) => {
    const responses = {
      create:
        "Alright darlin', I'll create that for ya. Lemme work my magic here...",
      deploy:
        "Hold your horses, sugar! I'm gettin' that deployed faster than a cat on a hot tin roof!",
      add: "Well bless your heart, I'll add that right on up for ya!",
      build:
        "Sweetie, I'm on it like white on rice! Buildin' that up real good.",
      fix: "Don't you worry your pretty little head, I'll fix that right up!",
      help: "Honey, I'm here to help! Just tell me what ya need and I'll make it happen!",
      default:
        "Well ain't you just a cutie pie! Let me see what I can do for ya, sugar...",
    }

    const lowerCommand = command.toLowerCase()
    for (const [key, response] of Object.entries(responses)) {
      if (lowerCommand.includes(key)) {
        return response
      }
    }
    return responses.default
  }

  // Speak AI response
  const speakResponse = (text) => {
    if (synthRef.current) {
      synthRef.current.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.95
      utterance.pitch = 1.1
      utterance.volume = 0.9

      // Try to use a female voice
      const voices = synthRef.current.getVoices()
      const femaleVoice = voices.find(
        (voice) =>
          voice.name.includes('Female') ||
          voice.name.includes('Samantha') ||
          voice.name.includes('Karen') ||
          voice.lang.includes('en')
      )

      if (femaleVoice) {
        utterance.voice = femaleVoice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)

      synthRef.current.speak(utterance)
    }
  }

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="voice-command-system">
      <div className="chat-container">
        <div className="messages-container">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`message ${message.sender}`}
              >
                <div className="message-content">
                  <div className="message-avatar">
                    {message.sender === 'user' ? '👤' : '🦞'}
                  </div>
                  <div className="message-text">{message.text}</div>
                </div>
                <div className="message-time">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <div className="voice-input-wrapper">
            <motion.button
              className={`voice-button ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopListening : startListening}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isProcessing}
            >
              {isListening ? <MicOff size={24} /> : <Mic size={24} />}
            </motion.button>

            {isListening && (
              <div className="audio-level-indicator">
                <div
                  className="audio-level-bar"
                  style={{ width: `${audioLevel * 100}%` }}
                />
              </div>
            )}

            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              onKeyPress={(e) =>
                e.key === 'Enter' && handleSendMessage(transcript)
              }
              placeholder={
                isListening ? 'Listening...' : 'Type or speak your command...'
              }
              className="text-input"
              disabled={isProcessing}
            />

            <motion.button
              className="send-button"
              onClick={() => handleSendMessage(transcript)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={!transcript.trim() || isProcessing}
            >
              <Send size={20} />
            </motion.button>
          </div>

          {isSpeaking && (
            <div className="speaking-indicator">
              <Volume2 size={16} className="speaking-icon" />
              <span>AI is speaking...</span>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <motion.button
          className="preview-button"
          onClick={onPreview}
          disabled={isProcessing}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          👁️ Preview
        </motion.button>

        <motion.button
          className={`ship-button ${isPreviewReady ? 'ready' : ''}`}
          onClick={onShip}
          disabled={!isPreviewReady || isProcessing}
          whileHover={isPreviewReady ? { scale: 1.05 } : {}}
          whileTap={isPreviewReady ? { scale: 0.95 } : {}}
        >
          {isPreviewReady ? '🚀 Ship It!' : '🔒 Locked'}
        </motion.button>
      </div>
    </div>
  )
}

export default VoiceCommandSystem
