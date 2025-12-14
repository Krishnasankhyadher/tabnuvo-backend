import express from "express";
import {
  subscribeNewsletter,
  getAllSubscribers,
} from "../controllers/newsletter.js";

const newsletterRoutes = express.Router();

newsletterRoutes.post("/newsletter", subscribeNewsletter);
newsletterRoutes.get("/newsletter", getAllSubscribers);

export default newsletterRoutes;
