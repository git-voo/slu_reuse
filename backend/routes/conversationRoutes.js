import express from 'express' 
import Conversation from '../models/conversationsModel'

const router = express.Router()

// Endpoint to fetch conversation messages
router.get('/conversation/:userId/:otherUserId', async (req, res) => {
    const { userId, otherUserId } = req.params

    try {
        const conversation = await Conversation.findOne({
            users: { $all: [userId, otherUserId] },
        }).sort({ 'messages.timestamp': 1 })

        if (!conversation) {
            return res.status(404).json({ message: 'Conversation not found' })
        }

        res.json({ messages: conversation.messages })
    } catch (error) {
        console.error('Error fetching conversation:', error)
        res.status(500).json({ message: 'Internal server error' })
    }
})


// Add this endpoint to your conversation API routes

router.post('/conversation/initiate', async (req, res) => {
    const { userId, donorId } = req.body;
  
    try {
      // Check if a conversation already exists between these users
      let conversation = await Conversation.findOne({
        users: { $all: [userId, donorId] },
      });
  
      if (!conversation) {
        // Create a new conversation if none exists
        conversation = new Conversation({
          users: [userId, donorId],
          messages: [],
        });
        await conversation.save();
      }
  
      res.json({ conversationId: conversation._id, messages: conversation.messages });
    } catch (error) {
      console.error('Error initiating conversation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
export default router
