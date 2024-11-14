import dotenv from 'dotenv';
dotenv.config();
console.log('GOOGLE_PROJECT_ID:', process.env.GOOGLE_PROJECT_ID);


import express from "express"
import bodyParser from "body-parser"
import path from "path"
import cors from "cors"
import connectDB from "./DB/connectDB.js"
import { configDotenv } from "dotenv"
import { fileURLToPath } from 'url'
import itemRoutes from "./routes/itemRoutes.js"
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { sendMail } from "./utils/mailer/index.mjs"
import filterRoutes from "./routes/filterRoutes.js"
import imageRoutes from './routes/imageRoutes.js';
import analyzeImageRoutes from "./routes/analyzeImageRoutes.js";

const router = express.Router()

//express app
const app = express()

const __filename = fileURLToPath(
    import.meta.url)

const __dirname = path.dirname(__filename)

configDotenv();
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);
const PORT = process.env.PORT || 4300

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())

app.get("/", (req, res) => {
    res.send("API Documentation page");
});
app.use("/api", itemRoutes)
app.use("/api", filterRoutes)
app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/analyze-image", analyzeImageRoutes);

app.use('/api/images', imageRoutes);
app.use("/api/sendmail", async(req, res) => {
    const user = {
        name: "VOO Onoja",
        email: "onojavoo@gmail.com"
    }
    try {
        const emailResponse = await sendMail(user, "Welcome to SLUReuse", "This is a test email though")
        res.status(emailResponse.status).json({ message: emailResponse.message })
    } catch (error) {
        res.status(error.status)
    }
})

connectDB()

//lisen for requests
// Start the server only if not in a test environment
let server;
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, () => {
        console.log(`Running on   http://localhost:${PORT}`)
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${PORT} is already in use`);
            process.exit(1);
        }
    });
}
export { app, server };
