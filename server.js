// backend/server.js
import "express-async-errors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import path from "path";
import helmet from "helmet";

import connectDB from "./database/db.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

import adminRouter from "./routes/adminroutes.js";
import erouter from "./routes/enquiryroute.js";
import pagerouter from "./routes/pagemeta.js";
import blogRoutes from "./routes/blog.js";
import newsletterRoutes from "./routes/newsletter.js";
import workRoutes from "./routes/workRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Security headers
app.use(helmet());

const allowedOrigins = [
  "https://tabnuvo.in",
  "https://tabnuvo.com",
  "https://www.tabnuvo.in",
  "https://www.tabnuvo.com",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (vercel, postman, etc)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❌ DO NOT throw error
      return callback(null, false);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Global rate limit
app.use(apiLimiter);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Connect DB — exit if it fails
await connectDB();

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes
app.use("/api", erouter);
app.use("/api", newsletterRoutes);
app.use("/api/pagemeta", pagerouter);
app.use("/api/admin", adminRouter);
app.use("/api", blogRoutes);
app.use("/api", workRoutes);

app.get("/", (req, res) => {
  res.send("TabNuvo server running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Global error handler — never leak internals
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    msg: process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error",
  });
});
