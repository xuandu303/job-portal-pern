import "dotenv/config"
import express from "express";
import userRoutes from './routes/user.js'

const app = express()
app.use(express.json())

app.use('/api/user', userRoutes)

const HOST = process.env.HOST || "0.0.0.0";

app.listen(process.env.PORT, () => {
  console.log(`User service is running on http://${HOST}:${process.env.PORT}`)
})