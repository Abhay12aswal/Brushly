import mongoose from "mongoose";

export const connectDB = (url: string)=>{
    mongoose.connect(url).then((data)=>{
        console.log(`mongodb connected with server : ${data.connection.host} `)
    })
        .catch((err)=>{
        console.log(err)
    })
}