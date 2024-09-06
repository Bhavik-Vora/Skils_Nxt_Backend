import express, { urlencoded } from "express";
import {config} from "dotenv";
import courseRoute from "../backend/routes/courseRoute.js"
import userRoute from "../backend/routes/userRoute.js"
import otherRoute from "../backend/routes/otherRoute.js"
import subscriptionRoute from "../backend/routes/subscriptionRoute.js"
import {ErrorMiddleware} from "../backend/middlewares/errorMiddleware.js"
import cookieParser from "cookie-parser";
import cors from "cors";
config({
    path:"./config/config.env"
})

const app = express();


//middlwares
app.use(express.urlencoded({
    extended:true,
}));
app.use(express.json())
app.use(cookieParser());
app.use(
    cors({
      origin: process.env.FRONTEND_URL,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );

app.use("/api/v1/user",courseRoute);
app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",userRoute);
app.use("/api/v1/plus",subscriptionRoute);
app.use("/api/v1/other",otherRoute);
app.use(ErrorMiddleware)
export default app;

// mongodb+srv://anonymous:mongourl5631@cluster0.zo8dy.mongodb.net/"//