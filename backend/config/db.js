import mongoose from "mongoose";
/*asynchronous because any methods we will call from mongoose will return a promise. So, we can do an async syntax. So, we don't need to pass
any arguments */
const connectDB = async () =>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    }catch(error){
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}


export default connectDB