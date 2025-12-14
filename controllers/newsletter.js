import Newsletter from "../models/newsletter.js";

// SUBSCRIBE
export const subscribeNewsletter = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const exists = await Newsletter.findOne({ email });
    if (exists) {
      return res.status(200).json({
        message: "Already subscribed",
      });
    }

    await Newsletter.create({ name, email });

    res.status(201).json({
      message: "Subscribed successfully",
    });
  } catch (err) {
    console.error("Newsletter error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL (ADMIN)
export const getAllSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json(subscribers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
