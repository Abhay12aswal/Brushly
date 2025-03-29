import express, { NextFunction, Request, Response } from "express"
import { connectDB } from "./utils/features.js"
import { config } from "dotenv"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorHandler.js"
import userRoutes from './routes/user.routes.js'


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



app.use((err: any , req: Request, res: Response , next: NextFunction)=>{
  errorHandler(err, req, res, next)
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})