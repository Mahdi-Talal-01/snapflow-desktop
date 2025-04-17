// pages.Chats/index.jsx
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useChat } from '../../components/ChatProvider'
import { Icon } from '@iconify/react'
import {
    setMessages,
    setLoading,
    setError,
    setCurrentUser,
} from '../../redux/Slices/chatSlice'
import './style.css'

const Chat = () => {
    const dispatch = useDispatch()
    const [messageInput, setMessageInput] = useState('')
    const messagesEndRef = useRef(null)
    const { sendMessage, isHarmfulMessage, clearHarmfulMessage } = useChat() // Get isHarmfulMessage and clear function

    // Get state from Redux
    const {
        messages = [],
        loading = false,
        error = null,
        currentUser = null,
        connected = false
    } = useSelector((state) => state.chat) || {}
    const { user } = useSelector((state) => state.user) || {}

    // Sort messages by timestamp
    const sortedMessages = [...messages].sort((a, b) => {
        const dateA = new Date(a.created_at || 0)
        const dateB = new Date(b.created_at || 0)
        return dateA - dateB
    })

    // Debug user state
    useEffect(() => {
        console.log('User state in Chat:', user)
        console.log('Current user in Chat:', currentUser)
        console.log('Connection status:', connected)
    }, [user, currentUser, connected])

    // Set current user when user state changes
    useEffect(() => {
        if (user) {
            console.log('Setting current user in chat:', user)
            dispatch(
                setCurrentUser({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            )
        }
    }, [user, dispatch])

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            try {
                dispatch(setLoading(true))
                const response = await fetch('http://localhost:3000/api/messages')
                if (!response.ok) {
                    throw new Error('Failed to load messages')
                }
                const data = await response.json()
                dispatch(setMessages(data))
            } catch (error) {
                console.error('Error loading messages:', error)
                dispatch(setError('Failed to load messages'))
            } finally {
                dispatch(setLoading(false))
            }
        }

        if (connected && currentUser) {
            loadMessages()
        }
    }, [dispatch, connected, currentUser])

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages])

    // Send message handler
    const handleSendMessage = () => {
        if (!connected || !currentUser) {
            console.error('Cannot send message:', {
                connected,
                currentUser
            })
            return
        }

        const message = messageInput.trim()
        if (!message) return

        clearHarmfulMessage(); // Clear any previous harmful message flags

        try {
            console.log('Sending message with user:', currentUser)
            const messageData = {
                userId: currentUser.id,
                name: currentUser.name,
                message: message
            }
            console.log('Message data being sent:', messageData)
            sendMessage(messageData)
            setMessageInput('')
        } catch (error) {
            console.error('Error sending message:', error)
            dispatch(setError('Failed to send message'))
        }
    }

    // Handle key press for sending messages
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    return (
        <div className="chat-container">
            <div className="chat-header">
                <h1>Chat</h1>
                <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
                    {connected ? 'Connected' : 'Disconnected'}
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            {isHarmfulMessage && (
                <div className="harmful-message-alert">Your message contains potentially harmful content and was not sent. Please revise your message.</div>
            )}

            <div className="messages">
                {loading ? (
                    <div className="loading">Loading messages...</div>
                ) : sortedMessages.length === 0 ? (
                    <div className="no-messages">No messages yet. Start the conversation!</div>
                ) : (
                    sortedMessages.map((msg, index) => {
                        // Get the current user's ID from userSlice and ensure both IDs are numbers for comparison
                        const currentUserId = user?.id
                        const messageUserId = parseInt(msg.userId)
                        const isCurrentUser = currentUserId && messageUserId === parseInt(currentUserId)

                        console.log('Message alignment check:', {
                            messageUserId: messageUserId,
                            currentUserId: currentUserId,
                            isCurrentUser,
                            message: msg
                        })

                        return (
                            <div
                                key={index}
                                className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                                style={{
                                    alignSelf: isCurrentUser ? 'flex-end' : 'flex-start',
                                    marginLeft: isCurrentUser ? '30%' : '0',
                                    marginRight: isCurrentUser ? '0' : '30%',
                                    backgroundColor: isCurrentUser ? '#dcf8c6' : 'white',
                                    borderRadius: isCurrentUser ? '15px 15px 0 15px' : '15px 15px 15px 0',
                                    borderBottomRightRadius: isCurrentUser ? '5px' : '15px',
                                    borderBottomLeftRadius: isCurrentUser ? '15px' : '5px'
                                }}
                            >
                                <span className="message-username">{msg.name}</span>
                                <div className="message-content">{msg.message}</div>
                                <span className="message-time">
                                    {msg.created_at
                                        ? new Date(msg.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                        })
                                        : ''}
                                </span>
                            </div>
                        )
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
                <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    disabled={!connected || !currentUser}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!connected || !currentUser || !messageInput.trim()}
                >
                    <Icon icon="mdi:send" className="icon" />
                </button>
            </div>
        </div>
    )
}

export default Chat