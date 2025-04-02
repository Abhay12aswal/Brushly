import express, { NextFunction, Request, Response } from "express"
import { connectDB } from "./utils/features.js"
import { config } from "dotenv"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorHandler.js"
import userRoutes from './routes/user.routes.js'
import paintingRoutes from './routes/painting.routes.js'
import commentRoutes from './routes/comment.routes.js'
import boardRoutes from './routes/board.routes.js'

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


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/painting",paintingRoutes);
app.use("/api/v1/comment", commentRoutes)
app.use("/api/v1/board", boardRoutes)



app.use((err: any , req: Request, res: Response , next: NextFunction)=>{
  errorHandler(err, req, res, next)
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})