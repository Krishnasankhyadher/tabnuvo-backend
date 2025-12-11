// backend/routes/userroute.js
import express from "express";
import { createenquiry, getAllenquiries, deleteenquiry } from "../controllers/enquiries.js";

const erouter = express.Router();

// POST /req/enquiries
erouter.post("/enquiry", createenquiry);

// GET /req/enquiries
erouter.get("/enquiry", getAllenquiries);

// DELETE /req/enquiries/:id
erouter.delete("/enquiry/:id", deleteenquiry);

export default erouter;
