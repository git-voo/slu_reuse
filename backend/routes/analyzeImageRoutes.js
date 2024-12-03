import express from "express"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

export async function getCaptionFromBLIP(imageUrl) {
    const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL 
    try {
        const response = await axios.post(`${PYTHON_SERVICE_URL}/caption`, { imageUrl })
        return response.data.caption
    } catch (error) {
        console.error("Error fetching caption from BLIP API:", error)
        throw new Error("Failed to get caption")
    }
}

// Route to analyze image
router.post("/", async (req, res) => {
    console.log(req.body)
    const { imageUrl } = req.body

    if (!imageUrl) {
        return res.status(400).json({ error: "Image URL is required" })
    }
    try {
        // Call the Python microservice to get the caption
        const caption = await getCaptionFromBLIP(imageUrl)
        res.json({ description: caption })
    } catch (error) {
        console.error("Error analyzing image:", error)
        res.status(500).json({ error: "Error analyzing image" })
    }
})

export default router