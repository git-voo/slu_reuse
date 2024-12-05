import dotenv from "dotenv";
dotenv.config();
console.log("GOOGLE_PROJECT_ID:", process.env.GOOGLE_PROJECT_ID);

import express from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import connectDB from "./DB/connectDB.js";
import { configDotenv } from "dotenv";
import { fileURLToPath } from "url";
import itemRoutes from "./routes/itemRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { sendMail } from "./utils/mailer/index.mjs";
import filterRoutes from "./routes/filterRoutes.js";
import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import Conversation from "./models/conversationsModel.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import analyzeImageRoutes from "./routes/analyzeImageRoutes.js";

const router = express.Router();

// Express app
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
configDotenv();
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
const PORT = process.env.PORT || 4300;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Routes
app.get("/", (req, res) => {
    res.send("API Documentation page");
});

app.use("/api", itemRoutes);
app.use("/api", filterRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analyze-image", analyzeImageRoutes);
app.use("/api/conversation", conversationRoutes);

app.use("/api/images", imageRoutes);
app.use("/api/sendmail", async (req, res) => {
    const user = {
        name: "VOO Onoja",
        email: "onojavoo@gmail.com",
    };
    try {
        const emailResponse = await sendMail(
            user,
            "Welcome to SLUReuse",
            "This is a test email though"
        );
        res.status(emailResponse.status).json({ message: emailResponse.message });
    } catch (error) {
        res.status(error.status);
    }
});

// Connect to the database only if not in a test environment
if (process.env.NODE_ENV !== "test") {
    connectDB();
}

// Start the server only if not in a test environment
let server;
if (process.env.NODE_ENV !== "test") {
    server = http.createServer(app); // Create the HTTP server
    const wss = new WebSocketServer({ server }); // Attach WebSocket to the HTTP server

    // Track clients using a Set
    const clients = new Set();

    wss.on("connection", (ws) => {
        console.log("New WebSocket connection");
        clients.add(ws);

        ws.on("message", async (data) => {
            const message = JSON.parse(data);

            // Save the message to the database
            try {
                const { text, senderId, recipientId, timestamp } = message;

                // Find or create the conversation between the sender and recipient
                let conversation = await Conversation.findOne({
                    users: { $all: [senderId, recipientId] }, // Match conversation by users
                });

                if (!conversation) {
                    // Create a new conversation if it doesn't exist
                    conversation = new Conversation({
                        users: [senderId, recipientId],
                        messages: [],
                    });
                }

                // Push the new message into the conversation's messages array
                conversation.messages.push({ text, senderId, recipientId });
                await conversation.save();

                // Broadcast message to all connected clients
                clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(message));
                    }
                });
            } catch (error) {
                console.error("Error saving message:", error);
            }
        });

        ws.on("close", () => {
            console.log("WebSocket connection closed");
            clients.delete(ws);
        });

        ws.on("error", (error) => {
            console.error("WebSocket error:", error);
            clients.delete(ws);
        });
    });

    server.listen(PORT, () => {
        console.log(`Running on http://localhost:${PORT}`);
    });

    server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
            console.log(`Port ${PORT} is already in use`);
            process.exit(1);
        }
    });
}

export { app, server };
