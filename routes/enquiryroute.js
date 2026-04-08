// backend/routes/userroute.js
import express from "express";
import { body, validationResult } from "express-validator";
import { createenquiry, getAllenquiries, deleteenquiry } from "../controllers/enquiries.js";
import verifyAdmin from "../middleware/auth.js";
import { formLimiter } from "../middleware/rateLimiter.js";

const erouter = express.Router();

// POST — public but rate-limited + validated
erouter.post(
    "/enquiry",
    formLimiter,
    [
        body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
        body("comment").trim().notEmpty().withMessage("Comment is required"),
        body("name").optional().trim().escape(),
        body("phone").optional().trim().escape(),
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    createenquiry
);

// GET — admin only
erouter.get("/enquiry", verifyAdmin, getAllenquiries);

// DELETE — admin only
erouter.delete("/enquiry/:id", verifyAdmin, deleteenquiry);

export default erouter;
