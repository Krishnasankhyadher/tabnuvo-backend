import Work from "../models/workModel.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "slugify";

/* CREATE */
export const createWork = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      category,
      client,
      year,
      role,
      techStack,
      challengeText,
      solutionText,
      solutionQuote,
      cards, // expecting JSON string
      metaTitle,
      metaKeywords,
      metaDescription,
    } = req.body;

    let slug = slugify(title, { lower: true, strict: true });

    // Prevent duplicate slug errors during creation
    const existing = await Work.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    let techStackArray = [];
    if (techStack) {
      if (Array.isArray(techStack)) {
        techStackArray = techStack;
      } else {
        techStackArray = techStack.split(',').map(s => s.trim()).filter(s => s);
      }
    }

    let parsedCards = [];
    if (cards) {
      try {
        parsedCards = JSON.parse(cards);
      } catch (e) {
        console.error("Failed to parse cards JSON", e);
      }
    }

    // Process images
    let mainImageData = null;
    let galleryData = [];

    if (req.files) {
      if (req.files.mainImage && req.files.mainImage[0]) {
        mainImageData = {
          url: req.files.mainImage[0].path,
          public_id: req.files.mainImage[0].filename,
        };
      }
      
      if (req.files.gallery && req.files.gallery.length > 0) {
        galleryData = req.files.gallery.map(file => ({
          url: file.path,
          public_id: file.filename,
        }));
      }
    }

    const work = await Work.create({
      title,
      subtitle,
      category,
      client,
      year,
      role,
      techStack: techStackArray,
      slug,
      challengeText,
      solutionText,
      solutionQuote,
      cards: parsedCards,
      mainImage: mainImageData,
      gallery: galleryData,
      seo: {
        metaTitle,
        metaKeywords,
        metaDescription,
      },
    });

    res.status(201).json(work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err.message });
  }
};

/* READ ALL */
export const getWorks = async (req, res) => {
  try {
    const works = await Work.find().sort({ createdAt: -1 });
    res.json(works);
  } catch {
    res.status(500).json({ msg: "Failed to fetch works" });
  }
};

/* READ ONE */
export const getWorkById = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ msg: "Work not found" });
    res.json(work);
  } catch (err) {
    res.status(400).json({ msg: "Invalid work ID" });
  }
};

/* READ BY SLUG */
export const getWorkBySlug = async (req, res) => {
  try {
    const work = await Work.findOne({ slug: req.params.slug });
    if (!work) {
      return res.status(404).json({ msg: "Work not found" });
    }
    res.json(work);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

/* UPDATE */
export const updateWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ msg: "Work not found" });

    const titleToSlug = req.body.title || work.title;
    
    let reqTechStack = req.body.techStack;
    if (reqTechStack !== undefined && reqTechStack !== null) {
      if (Array.isArray(reqTechStack)) {
        techStackArray = reqTechStack;
      } else {
        techStackArray = reqTechStack.toString().split(',').map(s => s.trim()).filter(s => s);
      }
    }

    let parsedCards = work.cards;
    if (req.body.cards) {
      try {
        parsedCards = JSON.parse(req.body.cards);
      } catch (e) {
        console.error("Failed to parse cards JSON", e);
      }
    }

    let mainImageData = work.mainImage;
    if (req.files && req.files.mainImage && req.files.mainImage[0]) {
      if (work.mainImage?.public_id) {
        await cloudinary.uploader.destroy(work.mainImage.public_id);
      }
      mainImageData = {
        url: req.files.mainImage[0].path,
        public_id: req.files.mainImage[0].filename,
      };
    }

    let galleryData = work.gallery;
    // For simplicity, if new gallery images are provided, we append them. Or we replace.
    // Usually, replacing is easier for a simple admin upload unless they can delete individually.
    // Let's replace the whole gallery if new files are uploaded.
    if (req.files && req.files.gallery && req.files.gallery.length > 0) {
      // delete old ones from cloudinary
      if (work.gallery && work.gallery.length > 0) {
        for (let img of work.gallery) {
           if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
        }
      }
      galleryData = req.files.gallery.map(file => ({
        url: file.path,
        public_id: file.filename,
      }));
    }

    let slugStr = slugify(titleToSlug, { lower: true, strict: true });
    if (titleToSlug !== work.title) {
      const existing = await Work.findOne({ slug: slugStr });
      if (existing && existing._id.toString() !== work._id.toString()) {
        slugStr = `${slugStr}-${Date.now()}`;
      }
    }

    const updated = await Work.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        subtitle: req.body.subtitle,
        category: req.body.category,
        client: req.body.client,
        year: req.body.year,
        role: req.body.role,
        techStack: techStackArray,
        slug: slugStr,
        challengeText: req.body.challengeText,
        solutionText: req.body.solutionText,
        solutionQuote: req.body.solutionQuote,
        cards: parsedCards,
        mainImage: mainImageData,
        gallery: galleryData,
        seo: {
          metaTitle: req.body.metaTitle,
          metaKeywords: req.body.metaKeywords,
          metaDescription: req.body.metaDescription,
        },
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

/* DELETE */
export const deleteWork = async (req, res) => {
  try {
    const work = await Work.findById(req.params.id);
    if (!work) return res.status(404).json({ msg: "Work not found" });

    if (work.mainImage?.public_id) {
      await cloudinary.uploader.destroy(work.mainImage.public_id);
    }
    
    if (work.gallery && work.gallery.length > 0) {
      for (let img of work.gallery) {
         if (img.public_id) await cloudinary.uploader.destroy(img.public_id);
      }
    }

    await work.deleteOne();
    res.json({ msg: "Work deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
