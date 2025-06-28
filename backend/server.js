import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";

const __dirname = path.resolve();
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(helmet());
// Allow requests from any origin (like React, mobile app,) with different ports
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-store.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
// 🔐 Apply rate limit: 50 requests per minute per IP
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,
  message: {
    success: false,
    message: "⚠️ Too many requests. Please slow down.",
  },
});
app.use(limiter);

app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database  connection established successfully");
});

// app.get("/", (req, res) => {
//   res.status(200).json("Main Server Loaded");
// });

import router from "./routes/products.js";
app.use("/products", router);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
  // console.log(`uri: ${uri}`);
});
