import express from "express"
import bodyParser from "body-parser"
import path from "path"
import cors from "cors"
import connectDB from "./DB/connectDB.js"
import { configDotenv } from "dotenv"
import { fileURLToPath } from 'url'
import itemRoutes from "./routes/itemRoutes.js"
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js';
import { sendMail } from "./utils/mailer/index.mjs"
import filterRoutes from "./routes/filterRoutes.js"
import http from 'http'
import WebSocket, { WebSocketServer } from 'ws'
import Conversation from "./models/conversationsModel.js"

const router = express.Router()
const app = express()

// For ES Module __dirname and __filename
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
configDotenv()
const PORT = process.env.PORT || 4300

// Middleware
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())

// Routes
const documentation = router.get("/", (req, res) => {
    res.send("API Documentation page")
})

app.use("/", documentation)
app.use("/api", itemRoutes)
app.use("/api/user", userRoutes);
app.use("/api", filterRoutes)
app.use('/api/auth', authRoutes)

// Connect to the database
connectDB()

// Create an HTTP server and attach WebSocket to it
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// Track clients using a Set
const clients = new Set()

wss.on('connection', (ws) => {
    console.log('New WebSocket connection')
    clients.add(ws)

    ws.on('message', async (data) => {
        const message = JSON.parse(data)

        // Save the message to the database
        try {
            const { text, senderId, recipientId, timestamp } = message

            // Find or create the conversation between the sender and recipient
            let conversation = await Conversation.findOne({
                users: { $all: [senderId, recipientId] }, // Match conversation by users
            })

            if (!conversation) {
                // Create a new conversation if it doesn't exist
                conversation = new Conversation({
                    users: [senderId, recipientId],
                    messages: [],
                })
            }

            // Push the new message into the conversation's messages array
            conversation.messages.push({ text, senderId, recipientId, timestamp })
            await conversation.save()

            // Broadcast message to all connected clients
            clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(message))
                }
            })
        } catch (error) {
            console.error('Error saving message:', error)
        }
    })

    ws.on('close', () => {
        console.log('WebSocket connection closed')
        clients.delete(ws)
    })

    ws.on('error', (error) => {
        console.error('WebSocket error:', error)
        clients.delete(ws)
    })
})

// Start the server
server.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`)
})

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use`)
        process.exit(1)
    }
})

export { app, server }
