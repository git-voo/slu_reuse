import axiosInstance from '../../services/AxiosInstance'
import { useState, useEffect } from 'react'
import ConversationDetail from './ConversationDetail'

const ConversationsList = ({ donorId }) => {
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const { data } = await axiosInstance.get(`/conversation/list?donorId=${donorId}`)
                setConversations(data)
            } catch (error) {
                console.error('Error fetching conversations:', error)
            }
        }

        fetchConversations()
    }, [donorId])

    const handleConversationSelect = (conversation) => {
        setSelectedConversation(conversation)
    }

    return (
        <div>
            {selectedConversation ? (
                // Show the selected conversation details
                <ConversationDetail
                    conversation={selectedConversation}
                    donorId={donorId}
                    onClose={() => setSelectedConversation(null)}
                />
            ) : (
                // Show list of all conversations
                <div className="conversations-list">
                    <h2>Your Conversations</h2>
                    {conversations.map((conversation) => (
                        <div
                            key={conversation._id}
                            className="conversation-item"
                            onClick={() => handleConversationSelect(conversation)}
                        >
                            <p>Chat with {conversation.participantName}</p>
                            <p>Item: {conversation.itemTitle}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ConversationsList
