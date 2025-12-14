import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "blogs",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [
      { width: 1200, crop: "limit" }, // auto resize
      { quality: "auto" },            // auto optimize
      { fetch_format: "auto" },
    ],
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
