import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './ClawedBot.css'

const ClawedBot = ({ onCommandExecute }) => {
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversation, setConversation] = useState([])
  const [transcript, setTranscript] = useState('')
  const [avatarMood, setAvatarMood] = useState('neutral')
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [wakeWordDetected, setWakeWordDetected] = useState(false)

  const recognitionRef = useRef(null)
  const synthRef = useRef(window.speechSynthesis)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const animationFrameRef = useRef(null)

  const avatarRef = useRef(null)

  // Voice recognition setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onstart = () => {
        setIsListening(true)
        setAvatarMood('listening')
      }

      recognition.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(interimTranscript)

        if (finalTranscript) {
          handleVoiceInput(finalTranscript.trim())
        }
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setAvatarMood('neutral')
      }

      recognition.onend = () => {
        setIsListening(false)
        setAvatarMood('neutral')

        // Restart listening if wake word was detected
        if (wakeWordDetected) {
          setTimeout(() => {
            recognition.start()
          }, 1000)
        }
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [wakeWordDetected])

  // Audio visualization
  const setupAudioVisualization = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        audioContextRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )()
        analyserRef.current = audioContextRef.current.createAnalyser()
        const source = audioContextRef.current.createMediaStreamSource(stream)
        source.connect(analyserRef.current)
        analyserRef.current.fftSize = 256

        visualizeAudio()
      })
      .catch((err) => console.error('Audio access denied:', err))
  }, [])

  const visualizeAudio = () => {
    if (!analyserRef.current) return

    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)
      analyserRef.current.getByteFrequencyData(dataArray)

      const average = dataArray.reduce((a, b) => a + b) / bufferLength
      const intensity = average / 255

      // Update avatar based on audio intensity
      if (intensity > 0.3) {
        setAvatarMood('excited')
      } else if (intensity > 0.1) {
        setAvatarMood('speaking')
      }
    }

    draw()
  }

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setWakeWordDetected(true)
      recognitionRef.current.start()
      setupAudioVisualization()
      addToConversation(
        'ClawedBot',
        "I'm listening, Boss! What can I do for you?",
        'bot'
      )
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      setWakeWordDetected(false)
      recognitionRef.current.stop()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }

  const addToConversation = (speaker, message, type = 'user') => {
    const entry = {
      id: Date.now(),
      speaker,
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
    }
    setConversation((prev) => [...prev, entry])
  }

  const speak = (text) => {
    if (!synthRef.current) return

    setIsSpeaking(true)
    setAvatarMood('speaking')

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 0.8
    utterance.volume = 0.9

    utterance.onend = () => {
      setIsSpeaking(false)
      setAvatarMood('neutral')
    }

    synthRef.current.speak(utterance)
  }

  const handleVoiceInput = async (input) => {
    setTranscript('')
    addToConversation('You', input, 'user')
    setIsProcessing(true)
    setAvatarMood('thinking')

    // Process the command
    const response = await processCommand(input)

    if (response) {
      addToConversation('ClawedBot', response.message, 'bot')
      speak(response.message)

      if (response.action) {
        onCommandExecute(response.action)
      }
    }

    setIsProcessing(false)
    setAvatarMood('neutral')
  }

  const processCommand = async (input) => {
    const lowerInput = input.toLowerCase()

    // Greeting responses
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return {
        message: 'Hey Boss! Ready to build something amazing today?',
        action: null,
      }
    }

    // Casual conversation
    if (lowerInput.includes('how are you')) {
      return {
        message:
          "I'm feeling awesome! Ready to deploy some killer features and make that money flow. What's our mission today?",
        action: null,
      }
    }

    // Deployment commands
    if (lowerInput.includes('deploy') || lowerInput.includes('go live')) {
      return {
        message:
          "Yes Boss Man! I'll deploy your new request live right now! 🚀",
        action: { type: 'deploy', target: 'production' },
      }
    }

    // Website building commands
    if (lowerInput.includes('add') && lowerInput.includes('page')) {
      const pageMatch = input.match(/add\s+(?:a\s+)?page\s+(?:called\s+)?(.+)/i)
      if (pageMatch) {
        const pageName = pageMatch[1].trim()
        return {
          message: `Got it! Creating the "${pageName}" page right now. This gonna be fire! 🔥`,
          action: { type: 'create_page', name: pageName },
        }
      }
    }

    // Revenue commands
    if (lowerInput.includes('add revenue') || lowerInput.includes('monetize')) {
      return {
        message:
          "Let's make that money! I'll set up multiple revenue streams - PayPal, Stripe, premium features, and more! 💰",
        action: { type: 'setup_monetization' },
      }
    }

    // Analytics commands
    if (
      lowerInput.includes('show analytics') ||
      lowerInput.includes('how much money')
    ) {
      return {
        message:
          "Checking the numbers right now, Boss! We're crushing it with multiple revenue streams coming in! 📊",
        action: { type: 'show_analytics' },
      }
    }

    // Customization commands
    if (
      lowerInput.includes('change avatar') ||
      lowerInput.includes('new look')
    ) {
      return {
        message:
          'Time for a glow up! Let me refresh my style for you, Boss! ✨',
        action: { type: 'customize_avatar' },
      }
    }

    // Default response
    return {
      message:
        "I'm on it, Boss! Tell me what you want to build or change and I'll make it happen instantly! 🎯",
      action: null,
    }
  }

  const getAvatarExpression = () => {
    const expressions = {
      neutral: '😎',
      listening: '👂',
      speaking: '🗣️',
      thinking: '🤔',
      excited: '🤩',
      working: '💪',
    }
    return expressions[avatarMood] || expressions.neutral
  }

  return (
    <div className="clawedbot-container">
      <div className="avatar-section">
        <motion.div
          ref={avatarRef}
          className={`avatar-3d ${avatarMood}`}
          animate={{
            rotateY: isListening ? 360 : 0,
            scale: isSpeaking ? [1, 1.1, 1] : 1,
          }}
          transition={{
            rotateY: { duration: 2, repeat: isListening ? Infinity : 0 },
            scale: { duration: 0.5, repeat: isSpeaking ? Infinity : 0 },
          }}
        >
          <div className="avatar-face">
            <div className="avatar-eyes">
              <motion.div
                className="eye left"
                animate={{ scaleY: isListening ? [1, 0.1, 1] : 1 }}
                transition={{
                  duration: 0.3,
                  repeat: isListening ? Infinity : 0,
                }}
              />
              <motion.div
                className="eye right"
                animate={{ scaleY: isListening ? [1, 0.1, 1] : 1 }}
                transition={{
                  duration: 0.3,
                  repeat: isListening ? Infinity : 0,
                }}
              />
            </div>
            <div className="avatar-mouth">
              <motion.div
                className="mouth"
                animate={{
                  height: isSpeaking ? '20px' : '5px',
                  width: isSpeaking ? '40px' : '30px',
                }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <div className="avatar-expression">{getAvatarExpression()}</div>
          </div>
          <motion.div
            className="avatar-glow"
            animate={{
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div className="voice-indicator">
          {isListening && (
            <motion.div
              className="listening-pulse"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          {isProcessing && (
            <motion.div
              className="thinking-dots"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span>•</span>
              <span>•</span>
              <span>•</span>
            </motion.div>
          )}
        </div>
      </div>

      <div className="conversation-section">
        <div className="conversation-header">
          <h3>🎙️ ClawedBot Voice Assistant</h3>
          <div className="controls">
            <button
              onClick={startListening}
              disabled={isListening}
              className={`control-button ${isListening ? 'active' : ''}`}
            >
              {isListening ? '🎧 Listening' : '🎤 Start Talking'}
            </button>
            <button
              onClick={stopListening}
              disabled={!isListening}
              className="control-button stop"
            >
              ⏹️ Stop
            </button>
          </div>
        </div>

        <div className="conversation-history">
          <div className="messages">
            <AnimatePresence>
              {conversation.map((msg) => (
                <motion.div
                  key={msg.id}
                  className={`message ${msg.type}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <div className="message-header">
                    <span className="speaker">{msg.speaker}</span>
                    <span className="timestamp">{msg.timestamp}</span>
                  </div>
                  <div className="message-content">{msg.message}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {transcript && (
          <div className="transcript">
            <span className="transcript-label">Hearing:</span>
            <span className="transcript-text">{transcript}</span>
          </div>
        )}

        <div className="quick-commands">
          <h4>Quick Commands:</h4>
          <div className="command-grid">
            <button onClick={() => handleVoiceInput('Deploy website')}>
              🚀 Deploy Live
            </button>
            <button onClick={() => handleVoiceInput('Add revenue stream')}>
              💰 Add Revenue
            </button>
            <button onClick={() => handleVoiceInput('Show analytics')}>
              📊 Show Analytics
            </button>
            <button onClick={() => handleVoiceInput('Create new page')}>
              📄 New Page
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ClawedBot
