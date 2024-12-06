import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

export async function getCaptionFromBLIP(imageUrl) {
    try {
        console.log("[getCaptionFromBLIP] Sending request to BLIP API with imageUrl:", imageUrl);

        const response = await axios.post("http://127.0.0.1:4301/caption", { imageUrl });

        console.log("[getCaptionFromBLIP] Received response from BLIP API:", response.data);

        return response.data.caption;
    } catch (error) {
        console.error("[getCaptionFromBLIP] Error fetching caption from BLIP API:", error.message);

        // Log detailed error information
        if (error.response) {
            console.error("[getCaptionFromBLIP] Response error data:", error.response.data);
            console.error("[getCaptionFromBLIP] Response error status:", error.response.status);
        }

        throw new Error("Failed to get caption from BLIP API");
    }
}

// Route to analyze image
router.post("/", async (req, res) => {
    const { imageUrl } = req.body;

    console.log("[/analyze-image] Request received with body:", req.body);

    // Validate the input
    if (!imageUrl) {
        console.warn("[/analyze-image] Missing imageUrl in request body");
        return res.status(400).json({ error: "Image URL is required" });
    }

    try {
        // Call the BLIP API to get the image caption
        const caption = await getCaptionFromBLIP(imageUrl);

        console.log("[/analyze-image] Caption received from BLIP API:", caption);

        // Simulated AI-generated details for the item
        const details = {
            name: "Auto-Generated Name",
            description: caption || "Auto-Generated Description",
            category: "Auto-Generated Category",
        };

        console.log("[/analyze-image] Sending response with details:", details);

        // Respond with the generated details
        res.json(details);
    } catch (error) {
        console.error("[/analyze-image] Error analyzing image:", error.message);

        // Provide detailed error information in the response
        res.status(500).json({
            error: "Error analyzing image",
            details: error.message,
        });
    }
});

export default router;
