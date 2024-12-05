import express from 'express';
import { getChatbotResponse } from '../controllers/chatbotController.js';

const router = express.Router();

// Route to handle chatbot messages
router.post('/chat', getChatbotResponse);

export default router;
