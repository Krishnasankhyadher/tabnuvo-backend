// backend/models/enquiry.js
import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    default: "", // optional
  },
  email: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

export default Enquiry;
