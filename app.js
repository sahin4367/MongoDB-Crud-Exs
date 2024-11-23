import 'dotenv/config'
import express from "express"
import mongoose from 'mongoose'
import { appRouter } from './src/routes/index.js'

const app = express()

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to database successfully!"))
    .catch(err => console.log(`Database connection FAILED! ${err.message}`))

app.use("/api", appRouter)

app.listen(process.env.PORT, () => {
    console.log(`App running on ${process.env.PORT} port`)
})