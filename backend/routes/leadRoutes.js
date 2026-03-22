import express from "express";
import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLeadStatus,
  addNote,
  deleteLead,
} from "../controllers/leadController.js";
import protect from "../middleware/authMiddleware.js";
import Lead from "../models/Lead.js";

const router = express.Router();

// Public route — anyone can submit a contact form
router.post("/", createLead);
router.get("/count", async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const contacted = await Lead.countDocuments({ status: "contacted" });
    const converted = await Lead.countDocuments({ status: "converted" });
    res.status(200).json({ total, contacted, converted, count: total });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Private routes — admin only
router.get("/", protect, getAllLeads);
router.get("/:id", protect, getLeadById);
router.patch("/:id/status", protect, updateLeadStatus);
router.patch("/:id/notes", protect, addNote);
router.delete("/:id", protect, deleteLead);

export default router;