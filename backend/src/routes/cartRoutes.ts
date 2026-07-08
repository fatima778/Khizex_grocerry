import { Router } from "express";
import { getCart, addToCart, updateCartItem, removeFromCart } from "../controllers/cartController";
import { protect } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", protect, asyncHandler(getCart));
router.post("/add", protect, asyncHandler(addToCart));
router.put("/update", protect, asyncHandler(updateCartItem));
router.delete("/:productId", protect, asyncHandler(removeFromCart));

export default router;