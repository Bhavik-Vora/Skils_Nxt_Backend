import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import RazorPay from "razorpay";
import nodeCron from "node-cron";
import { Stats } from "./models/statsModel.js";

app.get("/", (req, res) => {
  res.send("<h1>Home is Calling</h1>");
});

app.listen(process.env.PORT, () => {
  console.log(`App is listening to port ${process.env.PORT}`);
});

connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
  api_key: process.env.CLOUDINARY_CLIENT_API,
  api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
//seconds minutes hours day month year
nodeCron.schedule("0 0 0 1 * *", async () => {
  try {
    await Stats.create({});
  } catch (error) {
    console.log(error);
  }
});
