import express from "express"
import dotenv from "dotenv"
import Razonpay from "razorpay"
import { connectDb } from "./database/db.js";
import userRouters from "../server/routes/user.js"
import courseRouters from "../server/routes/course.js"
import adminRouters from "../server/routes/admin.js"
import cors from "cors";
dotenv.config();



export const instance = new Razonpay({
    key_id : process.env.Razorpay_Key ,
    key_secret : process.env.Razorpay_Secret 
})


// using middelwares //

const app = express() ;
const port = process.env.PORT
app.use(cors());
app.use(express.json())
app.get('/' , (req ,res)=>{
    
    res.send("SERVER IS WORKING ")
    
})


app.use("/uploads" , express.static("uploads"));

// using routes 
app.use("/api" , userRouters);
app.use("/api" , courseRouters);
app.use("/api" , adminRouters);

app.listen(port , ()=>{
console.log(`SERVER IS RUNNING  on https://localhost:${port}  `)
connectDb()


})