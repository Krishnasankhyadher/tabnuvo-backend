// backend/controllers/userenquiry.js
import Enquiry from "../models/userenq.js";

// Create enquiry
export const createenquiry = async (req, res) => {
  try {
    const { name, email, comment } = req.body;

    if (!email || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newEnquiry = new Enquiry({ name: name || "", email, comment });
    await newEnquiry.save();

    return res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error creating enquiry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all enquiries (optional for admin dashboard)
export const getAllenquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    return res.status(200).json(enquiries);
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete one enquiry
export const deleteenquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const enquiry = await Enquiry.findById(id);
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" });

    await Enquiry.findByIdAndDelete(id);
    return res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting enquiry:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
