import Bloger from "../models/bloger.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

/* CREATE */
export const createBlog = async (req, res) => {
  try {
    const {
      category,
      title,
      url,
      postedDate,
      content,
      mainImageTitle,       // ✅ THIS LINE WAS MISSING
      metaTitle,
      metaKeywords,
      metaDescription,
    } = req.body;
    const slug = slugify(url || title, { lower: true, strict: true });

    const blog = await Bloger.create({
      category,
      title,
      slug,
      postedDate,
      content,

      mainImageTitle, // ✅ NOW STORED

      seo: {
        // ✅ NOW STORED CORRECTLY
        metaTitle,
        metaKeywords,
        metaDescription,
      },

      mainImage: req.file
        ? {
            url: req.file.path,
            public_id: req.file.filename,
          }
        : null,
    });

    res.status(201).json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/* READ ALL */
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Bloger.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch {
    res.status(500).json({ msg: "Failed to fetch blogs" });
  }
};

/* READ ONE */
export const getBlogById = async (req, res) => {
  const blog = await Bloger.findById(req.params.id);
  if (!blog) return res.status(404).json({ msg: "Blog not found" });
  res.json(blog);
};

/* UPDATE */
export const updateBlog = async (req, res) => {
  try {
    const blog = await Bloger.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (req.file && blog.mainImage?.public_id) {
      await cloudinary.uploader.destroy(blog.mainImage.public_id);
    }

    const updated = await Bloger.findByIdAndUpdate(
      req.params.id,
      {
        category: req.body.category,
        title: req.body.title,
        slug: slugify(req.body.url || req.body.title, {
          lower: true,
          strict: true,
        }),
        postedDate: req.body.postedDate,
        content: req.body.content,
        mainImageTitle: req.body.mainImageTitle, // ✅ FIXED

        seo: {
          // ✅ FIXED
          metaTitle: req.body.metaTitle,
          metaKeywords: req.body.metaKeywords,
          metaDescription: req.body.metaDescription,
        },

        mainImage: req.file
          ? {
              url: req.file.path,
              public_id: req.file.filename,
            }
          : blog.mainImage,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* DELETE */
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Bloger.findById(req.params.id);
    if (!blog) return res.status(404).json({ msg: "Blog not found" });

    if (blog.mainImage?.public_id) {
      await cloudinary.uploader.destroy(blog.mainImage.public_id);
    }

    await blog.deleteOne();
    res.json({ msg: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Bloger.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ msg: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


