// backend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./database/db.js";
import router from "./routes/userroute.js";
import adminRouter from "./routes/adminroutes.js";
import erouter from "./routes/enquiryroute.js";
import pagerouter from "./routes/pagemeta.js";


dotenv.config();

const app = express();
const port = 3000;

// ✅ CORS (open for dev + deploy)
app.use(
  cors({
    origin: "*", // allow all; later change to your domain
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect DB
connectDB();

// ✅ Routes
app.use("/api", router);
app.use("/api", erouter);
app.use("/api/pagemeta", pagerouter);
app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("TabNuvo server running 🚀");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
