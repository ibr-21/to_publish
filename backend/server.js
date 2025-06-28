import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// const __dirname = path.resolve();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(helmet());
// Allow requests from any origin (like React, mobile app,) with different ports
app.use(cors());
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

const uri =
  process.env.ATLAS_URI
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database  connection established successfully");
});

import router from "./routes/products.js";
app.use("/products", router);

app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});
