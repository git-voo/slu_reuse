import express from "express"
import bodyParser from "body-parser"
import path from "path"
import cors from "cors" 
import connectDB from "./DB/connectDB.js"
import { configDotenv } from "dotenv"
import { fileURLToPath } from 'url'

import itemRoutes from "./routes/itemRoutes.js"
import filterRoutes from "./routes/filterRoutes.js"
const router = express.Router()
const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

configDotenv()
const PORT = process.env.PORT || 4300

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cors())

const documentation = router.get("/", (req, res) => {
  res.send("API Documentation page")
})

app.use("/", documentation)
app.use("/api", itemRoutes)

app.use("/api", filterRoutes)

connectDB()

app.listen(PORT, () => {
  console.log(`Running on   http://localhost:${PORT}`)
});

