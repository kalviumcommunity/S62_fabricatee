import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import dashRouter from "./routes/dashUser.route.js";
import designRouter from "./routes/design.route.js";
import fabricRouter from "./routes/fabric.route.js";
import orderRouter from "./routes/order.route.js";
import userAuthRouter from "./routes/auth.routes.js";
import { credentials } from "./middlewares/credentials.js";
import cookieParser from "cookie-parser";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({
    path: "./backend/.env",
  });
}

const app = express();

app.use(express.json());
app.use(cookieParser()); //Without a cookie parser, req.cookies will always be undefined. required for authentication
app.use(credentials);
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to the API",
  });
});
app.get("/ping", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

app.use("/api/user/auth", userAuthRouter);
app.use("/api/user", userRouter);
app.use("/api/dashboard/user", dashRouter);
app.use("/api/design", designRouter);
app.use("/api/fabric", fabricRouter);
app.use("/api/order", orderRouter);

export default app;
