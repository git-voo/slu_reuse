import axiosInstance from '../../services/AxiosInstance'
import profileService from '../../services/profileService'
import '../../styles/conversations/index.css'
import { useState, useEffect, useRef } from 'react'

const Conversations = ({ donorId, itemId, onClose }) => {
    const [messages, setMessages] = useState([])
    const [userId, setUserId] = useState(null)
    const [newMessage, setNewMessage] = useState('')
    const ws = useRef(null)

    // Fetch user profile and initiate or retrieve conversation on component mount
    useEffect(() => {
        getProfile()
        
        const initiateConversation = async () => {
            try {
                const { data } = await axiosInstance.post('/conversation/initiate', {
                    userId,
                    donorId,
                    itemId 
                })
                console.log(messages)

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
            
            // Filter messages for the specific itemId
            if (message.itemId === itemId) {
                setMessages((prevMessages) => [...prevMessages, message])
            }
        }

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket')
        }

        return () => {
            ws.current.close()
        }
    }, [userId, donorId, itemId])

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                text: newMessage,
                senderId: userId,
                recipientId: donorId,
                itemId, // Include itemId in each message
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }

            // Send the message to the WebSocket server
            ws.current.send(JSON.stringify(message))
            setMessages((prevMessages) => [...prevMessages, message]);
            setNewMessage('')
        }
    }

    const getProfile = async () => {
        try {
            const loggedUser = await profileService.getProfile()
            setUserId(loggedUser._id)
        } catch (error) {
            console.error('Error fetching profile:', error)
        }
    }

    return (
        <div className="conversation-bg" onClick={(e) => e.stopPropagation()}>
            <div className="conversations-container">
                <div className="messages-display">
                    <button onClick={onClose}>Close</button>
                    {messages.map((message) => (
                        <div
                            key={message._id}
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

export default Conversations
