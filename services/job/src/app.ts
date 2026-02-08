import "dotenv/config"
import express from "express"
import jobRoutes from "./routes/job.js"
import { connectKafka } from "./producer.js"

const app = express()

app.use(express.json())

connectKafka()

app.use("/api/job", jobRoutes)

export default app