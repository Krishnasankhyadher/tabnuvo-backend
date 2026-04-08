import express from "express";
import PageMeta from "../models/pageMeta.js";
import verifyAdmin from "../middleware/auth.js";

const pagerouter = express.Router();

// list all
pagerouter.get("/", async (req, res) => {
  try { const list = await PageMeta.find().sort({ route: 1 }); res.json(list); }
  catch (e) { res.status(500).json({ error: "Failed to fetch page meta" }); }
});

// get by route (safe pattern matching — no regex from user input)
pagerouter.get("/route", async (req, res) => {
  const route = req.query.route;
  try {
    let meta = await PageMeta.findOne({ route });
    if (!meta) {
      // Safe fallback: match by splitting route segments instead of building regex
      const all = await PageMeta.find();
      const routeParts = route.split("/");
      meta = all.find(m => {
        const mParts = m.route.split("/");
        if (mParts.length !== routeParts.length) return false;
        return mParts.every((part, i) =>
          part.startsWith(":") || part === routeParts[i]
        );
      }) || null;
    }
    res.json(meta || null);
  } catch (e) { res.status(500).json({ error: "Failed to fetch page meta" }); }
});

pagerouter.get("/count", async (req, res) => {
  try {
    const count = await PageMeta.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to count static pages" });
  }
});

// create — admin only
pagerouter.post("/", verifyAdmin, async (req, res) => {
  try {
    const { route, title, description, keywords } = req.body;
    if (!route || !title) return res.status(400).json({ error: "route and title required" });
    const exists = await PageMeta.findOne({ route });
    if (exists) return res.status(400).json({ error: "Meta for this route already exists. Edit instead." });
    const m = new PageMeta({ route, title, description, keywords });
    await m.save();
    res.json(m);
  } catch (e) { res.status(400).json({ error: "Failed to create page meta" }); }
});

// update — admin only
pagerouter.put("/:id", verifyAdmin, async (req, res) => {
  try {
    const { title, description, keywords } = req.body;
    const updated = await PageMeta.findByIdAndUpdate(req.params.id, { title, description, keywords }, { new: true });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: "Failed to update page meta" }); }
});

// delete — admin only
pagerouter.delete("/:id", verifyAdmin, async (req, res) => {
  try { await PageMeta.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: "Failed to delete page meta" }); }
});

export default pagerouter;

