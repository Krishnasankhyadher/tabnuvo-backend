import mongoose from "mongoose";
const blogSchema = new mongoose.Schema({
  category: String,
  title: String,
  slug: { type: String, unique: true },
  postedDate: Date,

  content: String,

  mainImage: {
    url: String,
    public_id: String,
  },

  mainImageTitle: String,

  seo: {
    metaTitle: String,
    metaKeywords: String,
    metaDescription: String,
  },
}, { timestamps: true });
export default mongoose.model('Bloger', blogSchema);