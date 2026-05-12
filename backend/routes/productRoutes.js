import express from "express";
import {
  getProducts,
  getProduct,
  createNewProduct,
  updateExistingProduct,
  removeProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validateProductCreate, validateProductUpdate } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", protect, adminOnly, validateProductCreate, createNewProduct);
router.put("/:id", protect, adminOnly, validateProductUpdate, updateExistingProduct);
router.delete("/:id", protect, adminOnly, removeProduct);

export default router;
