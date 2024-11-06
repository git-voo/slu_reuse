import '../../styles/conversations/index.css'
import { useState, useEffect, useRef } from 'react'

const Conversations = ({ userId }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const ws = useRef(null)

    // Establish WebSocket connection on mount
    useEffect(() => {
        // Change the WebSocket URL to match your backend port (4300)
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
            // Optionally implement reconnection logic here
        }

        // Cleanup on unmount
        return () => {
            ws.current.close()
        }
    }, [])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                text: newMessage,
                senderId: userId,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }

            // Send message to WebSocket server
            ws.current.send(JSON.stringify(message))

            // Update messages list
            setMessages((prevMessages) => [...prevMessages, message])
            setNewMessage("")
        }
    }

    // Scroll to the bottom when a new message arrives
    const messagesEndRef = useRef(null)
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    return (
        <div className="conversations-container">
            <div className="messages-display">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`message-bubble ${message.senderId === userId ? 'user' : 'donor'}`}
                    >
                        <p className="message-text">{message.text}</p>
                        <span className="message-timestamp">{message.timestamp}</span>
                    </div>
                ))}
                {/* Scroll indicator for the latest message */}
                <div ref={messagesEndRef} />
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
    )
}

export default Conversations
