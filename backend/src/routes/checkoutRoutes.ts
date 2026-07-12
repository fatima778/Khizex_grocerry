import { Router } from "express";
import rateLimit from "express-rate-limit";
import { checkout } from "../controllers/checkoutController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const checkoutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many checkout attempts, please slow down" },
});

router.post("/", protect, checkoutLimiter, asyncHandler(checkout));

export default router;
