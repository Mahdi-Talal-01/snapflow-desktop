// components/ChatProvider.jsx
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import {
    setConnected,
    setError,
    setWelcomeMessage,
    addMessage,
    clearChat,
    removeMessage // Import removeMessage
} from '../redux/Slices/chatSlice';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const dispatch = useDispatch();
    const socketRef = useRef(null);
    const { currentUser } = useSelector((state) => state.chat);
    const [isHarmfulMessage, setIsHarmfulMessage] = useState(false); // New state

    useEffect(() => {
        // Initialize socket connection only if we have a user
        if (currentUser && !socketRef.current) {
            console.log('Initializing socket connection in provider');
            socketRef.current = io('http://localhost:3000', {
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                timeout: 20000,
                autoConnect: true,
                transports: ['websocket'],
                forceNew: true,
                withCredentials: true
            });

            // Socket event handlers
            socketRef.current.on('connect', () => {
                console.log('Connected to chat server with ID:', socketRef.current.id);
                console.log('Socket transport:', socketRef.current.io.engine.transport.name);
                dispatch(setConnected(true));
                dispatch(setError(null));
            });

            socketRef.current.on('welcome', (data) => {
                console.log('Welcome message:', data);
                dispatch(setWelcomeMessage(data));
            });

            socketRef.current.on('disconnect', (reason) => {
                console.log('Disconnected from chat server:', reason);
                dispatch(setConnected(false));

                if (reason !== 'io client disconnect' && currentUser) {
                    console.log('Attempting to reconnect...');
                    setTimeout(() => {
                        if (socketRef.current && !socketRef.current.connected) {
                            socketRef.current.connect();
                        }
                    }, 1000);
                }
            });

            socketRef.current.on('connect_error', (error) => {
                console.error('Connection error:', error);
                dispatch(setError('Failed to connect to chat server. Please try again.'));
                dispatch(setConnected(false));
            });

            socketRef.current.on('newMessage', (message) => {
                console.log('New message received:', message);
                // Ensure the message has the required fields
                if (message && message.id && message.message) {
                    dispatch(addMessage({
                        id: message.id,
                        userId: message.userId,
                        name: message.name,
                        message: message.message,
                        created_at: message.created_at
                    }));
                } else {
                    console.error('Invalid message format received:', message);
                }
            });

            socketRef.current.on('harmfulMessageDetected', (data) => {
                console.log('Harmful message detected on frontend:', data);
                setIsHarmfulMessage(true); // Set the state to indicate a harmful message
                // Optionally, you can dispatch an action to show a message in Redux
            });

            // Connect to the server
            socketRef.current.connect();
            console.log('Socket connection initiated');

            // Cleanup on unmount or when user changes
            return () => {
                if (socketRef.current) {
                    console.log('Cleaning up socket connection in provider');
                    socketRef.current.removeAllListeners();
                    socketRef.current.disconnect();
                    socketRef.current = null;
                    dispatch(clearChat());
                }
            };
        }
    }, [dispatch, currentUser]);

    const value = {
        socket: socketRef.current,
        isHarmfulMessage: isHarmfulMessage, // Expose the harmful message state
        clearHarmfulMessage: () => setIsHarmfulMessage(false), // Function to clear the state
        sendMessage: (message) => {
            if (socketRef.current?.connected) {
                console.log('Sending message through socket:', message);
                console.log('Socket connection status:', socketRef.current.connected);
                console.log('Socket ID:', socketRef.current.id);

                try {
                    // Add message to Redux store immediately with a temporary ID
                    const tempMessage = {
                        id: Date.now(), // Temporary ID
                        userId: message.userId,
                        name: message.name,
                        message: message.message,
                        created_at: new Date().toISOString()
                    };
                    dispatch(addMessage(tempMessage));

                    console.log('Emitting chat message event...');
                    socketRef.current.emit('chat message', message, (response) => {
                        console.log('Message send response from backend:', response);
                        if (response && response.isSafe === true) {
                            // Replace the temporary message with the server's version
                            dispatch(addMessage(response.message));
                        } else if (response && response.isSafe === false) {
                            console.log('Message flagged as harmful by backend.');
                            setIsHarmfulMessage(true);
                            dispatch(removeMessage(tempMessage.id)); // Remove the temporary message
                            // Optionally dispatch an action to show a specific harmful message error
                        } else {
                            console.error('Message send failed or invalid response:', response?.error);
                            dispatch(removeMessage(tempMessage.id)); // Optionally remove the temporary message if sending failed
                        }
                    });
                } catch (error) {
                    console.error('Error sending message:', error);
                }
            } else {
                console.error('Cannot send message: Socket not connected');
            }
        }
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};