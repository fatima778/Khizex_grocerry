import { Router } from "express";
import { getMyOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController";
import { protect, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/my", protect, asyncHandler(getMyOrders));
router.get("/", protect, requireAdmin, asyncHandler(getAllOrders));
router.put("/:id/status", protect, requireAdmin, asyncHandler(updateOrderStatus));

export default router;
