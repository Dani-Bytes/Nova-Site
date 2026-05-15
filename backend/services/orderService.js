import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

export const createOrder = async (userId, items) => {
  if (!items || items.length === 0) {
    throw new ApiError(400, "Order items are required");
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length !== productIds.length) {
    throw new ApiError(400, "One or more products were not found");
  }

  const productMap = new Map(products.map((product) => [String(product._id), product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(String(item.productId));
    if (!product) {
      throw new ApiError(400, "Product not found");
    }

    const quantity = Number(item.quantity);
    if (Number.isNaN(quantity) || quantity < 1) {
      throw new ApiError(400, "Invalid order quantity");
    }

    if (quantity > product.stock) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
    };
  });

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    total,
  });

  await Product.bulkWrite(
    orderItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { stock: -item.quantity } },
      },
    })),
  );

  return order;
};

export const getOrdersByUser = async (userId) => {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getAllOrders = async () => {
  return Order.find().populate("user", "name email").sort({ createdAt: -1 });
};

export const updateOrderStatus = async (orderId, status) => {
  const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }
  return order;
};
