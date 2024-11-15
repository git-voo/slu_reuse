// controllers/chatbotController.js
export const chatResponse = async (req, res) => {
    const userMessage = req.body.message;
    
    let botResponse;
    if (userMessage.toLowerCase().includes("hello")) {
        botResponse = "Hello! How can I assist you today?";
    } else if (userMessage.toLowerCase().includes("hours")) {
        botResponse = "We’re available 9 AM - 5 PM, Monday through Friday.";
    } else {
        botResponse = "I'm here to help! Please ask your question.";
    }

    res.json({ response: botResponse });
};
