// backend/controllers/userenquiry.js
import Enquiry1 from "../models/enquiry.js";

// ================= CREATE ENQUIRY / NEWSLETTER =================
export const createenquiry = async (req, res) => {
  try {
    const { name, email, phone, comment } = req.body;

    // Email & comment are mandatory
    if (!email || !comment) {
      return res.status(400).json({
        message: "Email and query are required",
      });
    }

    const newEnquiry = new Enquiry1({
      name: name || "",
      email,
      phone: phone || "", // ✅ added
      comment,
    });

    await newEnquiry.save();

    return res.status(201).json({
      message:
        comment === "Newsletter signup"
          ? "Subscribed successfully"
          : "Enquiry submitted successfully",
    });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= GET ALL ENQUIRIES (ADMIN) =================
export const getAllenquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry1.find().sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ================= DELETE ENQUIRY =================
export const deleteenquiry = async (req, res) => {
  try {
    const { id } = req.params;

    const enquiry = await Enquiry1.findById(id);
    if (!enquiry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    await Enquiry1.findByIdAndDelete(id);
    return res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
