import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { ErrorMiddleware } from "./middlewares/errorMiddleware.js";
import adminRoute from "./routes/adminRoute.js";
import otherRoute from "./routes/otherRoute.js";
import userRoute from "./routes/userRoute.js";
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

app.use("/api/v1/user",userRoute);
app.use("/api/v1/admin",adminRoute);
app.use("/api/v1/other",otherRoute);

app.use(ErrorMiddleware)
export default app;
