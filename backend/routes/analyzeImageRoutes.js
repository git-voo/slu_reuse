import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

export async function getCaptionAndCategoryFromBLIP(imageUrl) {
    try {
        const response = await axios.post('http://127.0.0.1:4301/caption_and_category', { imageUrl });
        return response.data;
    } catch (error) {
        console.error("Error fetching caption and category from BLIP API:", error);
        throw new Error("Failed to get caption and category");
    }
}

// Route to analyze image
router.post("/", async(req, res) => {
    console.log(req.body);
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" });
    }
    try {
        // Call the Python microservice to get the caption and category
        const { name, caption, category, tags } = await getCaptionAndCategoryFromBLIP(imageUrl);
        res.json({ name: name, description: caption, category: category, tags: tags });
    } catch (error) {
        console.error("Error analyzing image:", error);
        res.status(500).json({ error: "Error analyzing image" });
    }
});

export default router;