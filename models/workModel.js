import mongoose from "mongoose";

const workSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  category: String,
  client: String,
  year: String,
  role: String,
  techStack: [String],
  slug: { type: String, unique: true },

  // New specific Case Study sections
  challengeText: String,
  solutionText: String,
  solutionQuote: String,
  
  // Cards: [{ title: "", description: "" }]
  cards: [{
    title: String,
    description: String
  }],
  
  mainImage: {
    url: String,
    public_id: String,
  },

  // Gallery array
  gallery: [{
    url: String,
    public_id: String,
  }],

  seo: {
    metaTitle: String,
    metaKeywords: String,
    metaDescription: String,
  },
}, { timestamps: true });

export default mongoose.model('Work', workSchema);
