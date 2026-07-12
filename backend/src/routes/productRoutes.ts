import { Router } from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkUpdateStock,
} from "../controllers/productController";
import { validate } from "../middleware/validate";
import { productSchema, productUpdateSchema } from "../utils/validators";
import { protect, requireAdmin } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.get("/", asyncHandler(getProducts));
router.get("/:id", asyncHandler(getProductById));

router.post("/", protect, requireAdmin, validate(productSchema), asyncHandler(createProduct));
router.put("/:id", protect, requireAdmin, validate(productUpdateSchema), asyncHandler(updateProduct));
router.delete("/:id", protect, requireAdmin, asyncHandler(deleteProduct));
router.post("/bulk-stock", protect, requireAdmin, asyncHandler(bulkUpdateStock));

export default router;
