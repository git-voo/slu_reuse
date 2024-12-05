import axios from 'axios';

// Controller to handle chatbot requests
export const getChatbotResponse = async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ message: 'Message is required' });
    }

    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions', 
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: message }],
                max_tokens: 150,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const botResponse = response.data.choices[0].message.content;
        res.json({ message: botResponse });

    } catch (error) {
        console.error("Error with OpenAI API:", error);
        res.status(500).json({ message: 'Failed to get a response from the chatbot' });
    }
};
