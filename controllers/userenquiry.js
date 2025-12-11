import UserEnquiry from "../models/enquiry.js"; // adjust path if needed

// Create enquiry
export const createEnquiry = async (req, res) => {
    try {
        const { name, email, comment, } = req.body;

        // Basic validation
        if (!name || !email || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Save to DB
        const newEnquiry = new UserEnquiry({ name, email, comment });
        await newEnquiry.save();

        return res.status(201).json({ message: "Enquiry submitted successfully" });

    } catch (error) {
        console.error("Error creating enquiry:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// Get all enquiries (optional for admin dashboard)
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await UserEnquiry.find().sort({ createdAt: -1 });
        return res.status(200).json(enquiries);

    } catch (error) {
        console.error("Error fetching enquiries:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
// Delete one enquiry
export const deleteEnquiry = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if exists
        const enquiry = await UserEnquiry.findById(id);
        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        await UserEnquiry.findByIdAndDelete(id);

        return res.status(200).json({ message: "Enquiry deleted successfully" });

    } catch (error) {
        console.error("Error deleting enquiry:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
