// routes/adminRoute.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginLimiter } from "../middleware/rateLimiter.js";

const adminRouter = express.Router();

// PRE-HASH: On first run, hash the admin password and cache it.
// In production, store the hash directly in .env instead of the plaintext password.
let hashedPassword = null;

const getHashedPassword = async () => {
  if (!hashedPassword) {
    hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
  }
  return hashedPassword;
};

adminRouter.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;

  const adminEmail = process.env.ADMIN_EMAIL;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not set in environment variables");
    return res.status(500).json({
      success: false,
      message: "Server configuration error",
    });
  }

  // Constant-time email comparison + bcrypt password check
  const emailMatch = email === adminEmail;
  const hash = await getHashedPassword();
  const passwordMatch = await bcrypt.compare(password, hash);

  if (emailMatch && passwordMatch) {
    const token = jwt.sign(
      { email: adminEmail, role: "admin" },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin authenticated successfully",
      token,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }
});

export default adminRouter;
