import { Router } from "express";
import { getProfile, updateProfile, createStaff, listStaff, removeStaff } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { z } from "zod";
import { protect, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const createStaffSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

router.get("/profile", protect, asyncHandler(getProfile));
router.put("/profile", protect, asyncHandler(updateProfile));

// Admin-only staff management — lets an existing admin onboard new staff
// accounts from the dashboard, without ever touching the server terminal.
router.get("/staff", protect, requireAdmin, asyncHandler(listStaff));
router.post("/staff", protect, requireAdmin, validate(createStaffSchema), asyncHandler(createStaff));
router.delete("/staff/:id", protect, requireAdmin, asyncHandler(removeStaff));

export default router;
