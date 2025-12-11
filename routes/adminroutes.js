// routes/adminRoute.js
import express from "express";

const adminRouter = express.Router();

adminRouter.post("/login", (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (email === adminEmail && password === adminPassword) {
    return res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});

export default adminRouter;
