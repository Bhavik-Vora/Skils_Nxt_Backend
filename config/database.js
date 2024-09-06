import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected To DB");
    } catch (error) {
        console.log("Error Connecting To DB", error);
    }
};
