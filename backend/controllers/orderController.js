import { asyncHandler } from "../utils/asyncHandler.js";
import {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
} from "../services/orderService.js";

export const createNewOrder = asyncHandler(async (req, res) => {
  const order = await createOrder(req.user.id, req.body.items);
  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await getOrdersByUser(req.user.id);
  res.json(orders);
});

export const getOrders = asyncHandler(async (_req, res) => {
  const orders = await getAllOrders();
  res.json(orders);
});

export const updateOrder = asyncHandler(async (req, res) => {
  const order = await updateOrderStatus(req.params.id, req.body.status);
  res.json(order);
});
