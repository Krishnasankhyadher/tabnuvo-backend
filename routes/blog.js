import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
} from "../controllers/blogController.js";
import { upload } from "../middleware/cloudinaryUpload.js";
import verifyAdmin from "../middleware/auth.js";
import Bloger from "../models/bloger.js";

const blogRouter = express.Router();

// PUBLIC — read routes (order matters: specific paths before :id)
blogRouter.get("/blogs", getBlogs);
blogRouter.get("/blogs/count", async (req, res) => {
  try {
    const count = await Bloger.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("BLOG COUNT ERROR:", err);
    res.status(500).json({ msg: "Failed to count blogs" });
  }
});
blogRouter.get("/blogs/slug/:slug", getBlogBySlug);
blogRouter.get("/blogs/:id", getBlogById);

// ADMIN ONLY — create, update, delete
blogRouter.post("/blogs", verifyAdmin, upload.single("mainImage"), createBlog);
blogRouter.put("/blogs/:id", verifyAdmin, upload.single("mainImage"), updateBlog);
blogRouter.delete("/blogs/:id", verifyAdmin, deleteBlog);

export default blogRouter;
