import mongoose from "mongoose";

const EnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
      required: true // ✅ NEW
    },
    comment: {
      type: String,
      required: true, // query
    },
  },
  { timestamps: true }
);

const Enquiry1 = mongoose.model("Enquiry1", EnquirySchema);
export default Enquiry1;
