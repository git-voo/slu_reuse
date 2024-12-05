import { useState, useEffect, useRef } from 'react'
import axiosInstance from '../../services/AxiosInstance'
import '../../styles/conversations/index.css'

const ConversationDetail = ({ conversation, donorId, onClose }) => {
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const ws = useRef(null)
    const userId = conversation.userId

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const { data } = await axiosInstance.get(`/conversation/messages?conversationId=${conversation._id}`)
                setMessages(data)
            } catch (error) {
                console.error('Error fetching messages:', error)
            }
        }

        fetchMessages()

        // Establish WebSocket connection
        ws.current = new WebSocket('ws://localhost:4300')

        ws.current.onopen = () => {
            console.log('Connected to WebSocket')
        }

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            if (message.conversationId === conversation._id) {
                setMessages((prevMessages) => [...prevMessages, message])
            }
        }

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket')
        }

        return () => {
            ws.current.close()
        }
    }, [conversation._id])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                text: newMessage,
                senderId: donorId, // Donor or user ID
                recipientId: userId,
                conversationId: conversation._id,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            ws.current.send(JSON.stringify(message))
            setNewMessage('')
        }
    }

    return (
        <div className="conversation-bg" onClick={(e) => e.stopPropagation()}>
            <div className="conversations-container">
                <button onClick={onClose}>Back to Conversations List</button>
                
                <div className="messages-display">
                    {messages.map((message) => (
                        <div
                            key={message._id}
                            className={`message-bubble ${message.senderId === donorId ? 'donor' : 'user'}`}
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

export default ConversationDetail
