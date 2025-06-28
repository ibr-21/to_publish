import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";


const app = express();

// Serve static files from React
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const buildPath = path.join(__dirname, "frontend", "dist"); // or "build" if CRA




app.use(express.static(buildPath));



// const __dirname = path.resolve();
dotenv.config();

const port = process.env.PORT || 5000;

app.use(helmet());
// Allow requests from any origin (like React, mobile app,) with different ports
app.use(
  cors({
    origin: [
      "http://localhost:5000",
      "http://localhost:5173",
      "https://product-service-provider.com",
    ],
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

const uri = process.env.ATLAS_URI || "mongodb+srv://devuser:devUser@mydev.c4udgdc.mongodb.net/?retryWrites=true&w=majority&appName=mydev"
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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// Catch-all: serve index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
