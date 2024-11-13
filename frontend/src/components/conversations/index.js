import axiosInstance from '../../services/AxiosInstance'
import '../../styles/conversations/index.css'
import { useState, useEffect, useRef } from 'react'

const Conversations = ({ userId, donorId, onClose }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const ws = useRef(null)

    // Initiate or retrieve conversation on component mount
    useEffect(() => {
        const initiateConversation = async () => {
            try {
                const response = await fetch('/api/conversation/initiate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId, donorId }),
                })
                const data = await response.json()

                // Set the conversation messages
                setMessages(data.messages)
            } catch (error) {
                console.error('Error initiating conversation:', error)
            }
        }

        initiateConversation()

        // Establish WebSocket connection
        ws.current = new WebSocket('ws://localhost:4300')

        ws.current.onopen = () => {
            console.log('Connected to WebSocket')
        }

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages((prevMessages) => [...prevMessages, message])
        }

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket')
        }

        return () => {
            ws.current.close()
        }
    }, [userId, donorId])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                text: newMessage,
                senderId: userId,
                recipientId: donorId,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }

            // Send the message to the WebSocket server
            ws.current.send(JSON.stringify(message))

            // Update the UI with the new message
            setMessages((prevMessages) => [...prevMessages, message])
            setNewMessage('')
        }
    }

    return (
        <div className="conversation-bg" onClick={(e) => e.stopPropagation()}>
            <div className="conversations-container">
                <div className="messages-display">
                    <button onClick={onClose}>Close</button>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`message-bubble ${message.senderId === userId ? 'user' : 'donor'}`}
                        >
                            <p className="message-text">{message.text}</p>
                            <span className="message-timestamp">{message.timestamp}</span>
                        </div>
                    ))}
                </div>

                <div className="message-input-area">
                    <input
                        type="text"
                        className="message-input"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button className="send-button" onClick={handleSendMessage}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Conversations;

