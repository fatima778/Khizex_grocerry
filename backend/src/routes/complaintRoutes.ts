import { Router } from "express";
import { z } from "zod";
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  replyToComplaint,
  resolveComplaint,
} from "../controllers/complaintController";
import { validate } from "../middleware/validate";
import { protect, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const createSchema = z.object({
  subject: z.string().min(2),
  message: z.string().min(1),
});

const replySchema = z.object({
  text: z.string().min(1),
});

router.post("/", protect, validate(createSchema), asyncHandler(createComplaint));
router.get("/my", protect, asyncHandler(getMyComplaints));
router.get("/", protect, requireAdmin, asyncHandler(getAllComplaints));
router.post("/:id/reply", protect, validate(replySchema), asyncHandler(replyToComplaint));
router.put("/:id/resolve", protect, requireAdmin, asyncHandler(resolveComplaint));

export default router;
