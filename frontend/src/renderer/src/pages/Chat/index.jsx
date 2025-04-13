import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import './style.css'

// Mock data for the chat
const mockMessages = [
  {
    id: 1,
    sender: 'user',
    content: 'Hey there! How are you?',
    timestamp: '10:30 AM'
  },
  {
    id: 2,
    sender: 'other',
    content: 'I\'m good, thanks! How about you?',
    timestamp: '10:31 AM'
  },
  {
    id: 3,
    sender: 'user',
    content: 'Doing well! Just working on some new features for the app.',
    timestamp: '10:32 AM'
  },
  {
    id: 4,
    sender: 'other',
    content: 'That sounds interesting! What kind of features?',
    timestamp: '10:33 AM'
  },
  {
    id: 5,
    sender: 'user',
    content: 'We\'re adding a chat system and some new image editing tools.',
    timestamp: '10:34 AM'
  }
]

const Chat = () => {
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message = {
      id: messages.length + 1,
      sender: 'user',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages([...messages, message])
    setNewMessage('')

    // Simulate response after 1 second
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'other',
        content: 'Thanks for your message! This is an automated response.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, response])
    }, 1000)
  }

  return (
    <div className="chat-container">
   

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender === 'user' ? 'user-message' : 'other-message'}`}
          >
            <div className="message-content">
              <p>{message.content}</p>
              <span className="message-timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="message-input-field"
        />
        <button type="submit" className="send-button">
          <Icon icon="mdi:send" width="24" height="24" />
        </button>
      </form>
    </div>
  )
}

export default Chat 