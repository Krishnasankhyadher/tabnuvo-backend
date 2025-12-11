import mongoose from "mongoose";

const PageMetaSchema = new mongoose.Schema({
  route: { type: String, required: true, unique: true },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  keywords: { type: String, default: "" },
  favicon: { type: String, default: "" } // comma separated
}, { timestamps: true });

export default mongoose.models.PageMeta || mongoose.model("PageMeta", PageMetaSchema);
