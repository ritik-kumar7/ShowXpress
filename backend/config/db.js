import mongoose from "mongoose";

const connectDb = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log("database connected Succesfully");

    } catch (error) {

        console.log("database connection Error ", error);

    }
}


export default connectDb;