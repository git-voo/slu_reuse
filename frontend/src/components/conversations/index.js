import { useState } from 'react'
import '../../styles/conversations/index.css'

const Conversations = ({ initialMessages, userId }) => {
    const [messages, setMessages] = useState(initialMessages)
    const [newMessage, setNewMessage] = useState("")

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                id: Date.now(),
                text: newMessage,
                senderId: userId,
                timestamp: new Date().toLocaleTimeString(),
            }
            setMessages([...messages, newMsg])
            setNewMessage("") // Clear the input
        }
    }

    return (
        <div className="conversations-container">
            {/* Messages Display Area */}
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
            </div>

            {/* Input and Send Button */}
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
