import express from "express";
import { body, validationResult } from "express-validator";
import {
  subscribeNewsletter,
  getAllSubscribers,
} from "../controllers/newsletter.js";
import verifyAdmin from "../middleware/auth.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const newsletterRoutes = express.Router();

// POST — public but rate-limited + validated
newsletterRoutes.post(
  "/newsletter",
  formLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("name").trim().notEmpty().escape().withMessage("Name is required"),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  subscribeNewsletter
);

// GET — admin only
newsletterRoutes.get("/newsletter", verifyAdmin, getAllSubscribers);

export default newsletterRoutes;
