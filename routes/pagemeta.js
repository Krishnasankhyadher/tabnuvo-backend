import express from "express";
import PageMeta from "../models/pageMeta.js";

const pagerouter = express.Router();

// list all
pagerouter.get("/", async (req, res) => {
  try { const list = await PageMeta.find().sort({ route: 1 }); res.json(list); }
  catch (e) { res.status(500).json({ error: e.message }); }
});

// get by route (supports patterns like /blog/:id using simple pattern fallback)
pagerouter.get("/route", async (req, res) => {
  const route = req.query.route;
  try {
    let meta = await PageMeta.findOne({ route });
    if (!meta) {
      const all = await PageMeta.find();
      meta = all.find(m => {
        const patt = m.route.replace(/:[^/]+/g, "[^/]+"); // /blog/:id -> /blog/[^/]+
        return new RegExp("^" + patt + "$").test(route);
      }) || null;
    }
    res.json(meta || null);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// create
pagerouter.post("/", async (req, res) => {
  try {
    const { route, title, description, keywords } = req.body;
    if (!route || !title) return res.status(400).json({ error: "route and title required" });
    const exists = await PageMeta.findOne({ route });
    if (exists) return res.status(400).json({ error: "Meta for this route already exists. Edit instead." });
    const m = new PageMeta({ route, title, description, keywords });
    await m.save();
    res.json(m);
  } catch (e) { res.status(400).json({ error: e.message }); }
});
pagerouter.get("/count", async (req, res) => {
  
  try {
    const count = await PageMeta.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Failed to count static pages" });
  }
});


// update
pagerouter.put("/:id", async (req, res) => {
  try {
    const { title, description, keywords } = req.body;
    const updated = await PageMeta.findByIdAndUpdate(req.params.id, { title, description, keywords }, { new: true });
    res.json(updated);
  } catch (e) { res.status(400).json({ error: e.message }); }
});

// delete
pagerouter.delete("/:id", async (req, res) => {
  try { await PageMeta.findByIdAndDelete(req.params.id); res.json({ success: true }); }
  catch (e) { res.status(500).json({ error: e.message }); }
});




export default pagerouter;
