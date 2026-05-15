import Product from "../models/Product.js";
import { ApiError } from "../utils/apiError.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const listProducts = async ({ search, category } = {}) => {
  const query = {};

  if (search) {
    const term = escapeRegex(search);
    query.$or = [
      { name: { $regex: term, $options: "i" } },
      { description: { $regex: term, $options: "i" } },
      { category: { $regex: term, $options: "i" } },
    ];
  }

  if (category) {
    query.category = { $regex: `^${escapeRegex(category)}$`, $options: "i" };
  }

  return Product.find(query).sort({ createdAt: -1 });
};

export const getProductById = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const createProduct = async (payload) => {
  return Product.create(payload);
};

export const updateProduct = async (productId, payload) => {
  const product = await Product.findByIdAndUpdate(productId, payload, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};

export const deleteProduct = async (productId) => {
  const product = await Product.findByIdAndDelete(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return product;
};
