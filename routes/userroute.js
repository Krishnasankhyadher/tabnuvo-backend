import express from "express";
import { createEnquiry, getAllEnquiries,deleteEnquiry } from "../controllers/userenquiry.js";

const router = express.Router();

// POST enquiry
router.post("/enquiries", createEnquiry);

// GET all enquiries (optional admin route)
router.get("/enquiries", getAllEnquiries);
router.delete("/enquiries/:id", deleteEnquiry);

export default router;