import express from "express";
import {
  createBlog,
  getBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
} from "../controllers/blogController.js";
import { upload } from "../middleware/cloudinaryUpload.js";
import Bloger from "../models/bloger.js";

const blogRouter = express.Router();

// CREATE BLOG
blogRouter.post("/blogs", upload.single("mainImage"), createBlog);

// READ ALL BLOGS
blogRouter.get("/blogs", getBlogs);

// READ SINGLE BLOG
blogRouter.get("/blogs/:id", getBlogById);

// UPDATE BLOG
blogRouter.put("/blogs/:id", upload.single("mainImage"), updateBlog);

// DELETE BLOG
blogRouter.delete("/blogs/:id", deleteBlog);

// ✅ BLOG COUNT (FIXED PATH)
blogRouter.get("/blogs/count", async (req, res) => {
  try {
    const count = await Bloger.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("BLOG COUNT ERROR:", err);
    res.status(500).json({ msg: "Failed to count blogs" });
  }
});

export default blogRouter;
