import express from "express";
import {
  createNewOrder,
  getMyOrders,
  getOrders,
  updateOrder,
} from "../controllers/orderController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { validateOrderCreate, validateOrderStatus } from "../middleware/validateMiddleware.js";

const router = express.Router();

router.post("/", protect, validateOrderCreate, createNewOrder);
router.get("/my", protect, getMyOrders);
router.get("/", protect, adminOnly, getOrders);
router.put("/:id", protect, adminOnly, validateOrderStatus, updateOrder);

export default router;
