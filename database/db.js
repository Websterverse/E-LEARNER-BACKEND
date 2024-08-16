import mongoose from "mongoose";

export const connectDb =  async ()=>{
  try {

    mongoose.connect(process.env.MONGO_URI)
console.log("DATABASE CONNECTED")

  }
  catch(e){
 console.log(e)

  }

}