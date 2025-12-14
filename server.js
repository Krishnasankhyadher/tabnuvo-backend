// backend/server.js
import express from "express";
import dotenv from "dotenv";
dotenv.config();


import cors from "cors";
import path from "path";

import connectDB from "./database/db.js";


import adminRouter from "./routes/adminroutes.js";
import erouter from "./routes/enquiryroute.js";
import pagerouter from "./routes/pagemeta.js";
import blogRoutes from "./routes/blog.js"; // ✅ ADD THIS
import newsletterRoutes from "./routes/newsletter.js";


const app = express();
const port = process.env.PORT || 5000;


app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
connectDB();

/**
 * ⚠️ Keep uploads ONLY if other features still use it
 * Blogs will use Cloudinary instead
 */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Routes

app.use("/api", erouter);
app.use("/api",newsletterRoutes)
app.use("/api/pagemeta", pagerouter);
app.use("/api/admin", adminRouter);

// ✅ BLOG ROUTES
app.use("/api", blogRoutes);

app.get("/", (req, res) => {
  res.send("TabNuvo server running 🚀");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    msg: err.message || "Internal Server Error",
  });
});
