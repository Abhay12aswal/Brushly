import express from "express"
import { connectDB } from "./utils/features.js"
import { config } from "dotenv"
import morgan from "morgan"
import cookieParser from "cookie-parser"



const app = express()

app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"))
app.use(morgan("dev"))


config({
    path:"./.env"
})

const url = process.env.url || ""

connectDB(url)

app.get("/", (req, res) => {
  res.send("Hello World")
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})