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

const router = express.Router();

// Public route — anyone can submit a contact form
router.post("/", createLead);

// Private routes — admin only
router.get("/", protect, getAllLeads);
router.get("/:id", protect, getLeadById);
router.patch("/:id/status", protect, updateLeadStatus);
router.patch("/:id/notes", protect, addNote);
router.delete("/:id", protect, deleteLead);

export default router;