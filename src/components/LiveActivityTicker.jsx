import React, { useEffect, useState } from 'react'

// Live activity ticker with random credit jobs
const TICKER_MESSAGES = [
  (name, amount) => `${name} placed a ₦${amount} job on credit`,
  (name, location, amount) => `${name} (${location}) completed Telegram task +₦${amount}`,
  (name, location, amount) => `${name} (${location}) withdrew ₦${amount} to GTBank`,
  (name, amount) => `${name} earned ₦${amount} completing survey tasks`,
]

const NAMES = ['James', 'Adaeze', 'Suleiman', 'Chioma', 'Okafor', 'Zainab', 'Segun', 'Kola', 'Peace', 'David']
const LOCATIONS = ['Lagos', 'Abuja', 'UNILAG', 'UI', 'OAU', 'Ibadan', 'Kano', 'Oyo']

function generateTickerMessage() {
  const messageTemplate = TICKER_MESSAGES[Math.floor(Math.random() * TICKER_MESSAGES.length)]
  const name = NAMES[Math.floor(Math.random() * NAMES.length)]
  const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)]
  const amount = Math.floor(Math.random() * (5000 - 300 + 1)) + 300

  if (messageTemplate.length === 2) {
    return messageTemplate(name, amount)
  } else {
    return messageTemplate(name, location, amount)
  }
}

export default function LiveActivityTicker() {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Generate initial message
    setMessages([generateTickerMessage()])

    // Add new messages every 5 seconds
    const interval = setInterval(() => {
      setMessages(prev => {
        const newMessages = [generateTickerMessage(), ...prev]
        return newMessages.slice(0, 3) // Keep only last 3 messages
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-50 border-l-4 border-blue-600 p-4 my-6">
      <h3 className="text-sm font-bold text-gray-700 mb-3">Live Activity</h3>
      <div className="space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="text-sm text-gray-700 animate-pulse">
            ✓ {msg}
          </div>
        ))}
      </div>
    </div>
  )
}
