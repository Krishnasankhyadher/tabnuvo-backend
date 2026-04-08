import express from "express";
import {
  createWork,
  getWorks,
  getWorkById,
  updateWork,
  deleteWork,
  getWorkBySlug,
} from "../controllers/workController.js";
import { upload } from "../middleware/cloudinaryUpload.js";
import verifyAdmin from "../middleware/auth.js";
import Work from "../models/workModel.js";

const workRouter = express.Router();

// PUBLIC
workRouter.get("/works", getWorks);
workRouter.get("/works/count", async (req, res) => {
  try {
    const count = await Work.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to count works" });
  }
});
workRouter.get("/works/slug/:slug", getWorkBySlug);
workRouter.get("/works/:id", getWorkById);

const workUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "gallery", maxCount: 10 }
]);

// ADMIN ONLY
workRouter.post("/works", verifyAdmin, workUpload, createWork);
workRouter.put("/works/:id", verifyAdmin, workUpload, updateWork);
workRouter.delete("/works/:id", verifyAdmin, deleteWork);

export default workRouter;
