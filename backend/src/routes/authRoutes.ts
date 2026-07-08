import { Router } from "express";
import rateLimit from "express-rate-limit";
import { signup, login, refresh, logout } from "../controllers/authControllers";
import { validate } from "../middleware/validate";
import { signupSchema, loginSchema } from "../utils/validators";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/signup", authLimiter, validate(signupSchema), asyncHandler(signup));
router.post("/login", authLimiter, validate(loginSchema), asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", logout);

export default router;