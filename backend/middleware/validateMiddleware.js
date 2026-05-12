import { ApiError } from "../utils/ApiError.js";

const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const validateRegister = (req, _res, next) => {
  const { name, email, password } = req.body;

  if (!name || !name.trim()) {
    return next(new ApiError(400, "Name is required"));
  }

  if (!email || !isEmail(email)) {
    return next(new ApiError(400, "Valid email is required"));
  }

  if (!password || password.length < 6) {
    return next(new ApiError(400, "Password must be at least 6 characters"));
  }

  next();
};

export const validateLogin = (req, _res, next) => {
  const { email, password } = req.body;

  if (!email || !isEmail(email)) {
    return next(new ApiError(400, "Valid email is required"));
  }

  if (!password) {
    return next(new ApiError(400, "Password is required"));
  }

  next();
};

export const validateProductCreate = (req, _res, next) => {
  const { name, description, price, category, imageUrl, stock } = req.body;

  if (!name || !name.trim()) {
    return next(new ApiError(400, "Product name is required"));
  }

  if (!description || !description.trim()) {
    return next(new ApiError(400, "Product description is required"));
  }

  if (price === undefined || Number.isNaN(Number(price)) || Number(price) < 0) {
    return next(new ApiError(400, "Valid price is required"));
  }

  if (!category || !category.trim()) {
    return next(new ApiError(400, "Category is required"));
  }

  if (!imageUrl || !imageUrl.trim()) {
    return next(new ApiError(400, "Image URL is required"));
  }

  if (stock === undefined || Number.isNaN(Number(stock)) || Number(stock) < 0) {
    return next(new ApiError(400, "Valid stock value is required"));
  }

  next();
};

export const validateProductUpdate = (req, _res, next) => {
  const { name, description, price, category, imageUrl, stock, rating } = req.body;
  const hasUpdates = [name, description, price, category, imageUrl, stock, rating].some(
    (value) => value !== undefined,
  );

  if (!hasUpdates) {
    return next(new ApiError(400, "Provide at least one field to update"));
  }

  if (price !== undefined && (Number.isNaN(Number(price)) || Number(price) < 0)) {
    return next(new ApiError(400, "Price must be a positive number"));
  }

  if (stock !== undefined && (Number.isNaN(Number(stock)) || Number(stock) < 0)) {
    return next(new ApiError(400, "Stock must be a positive number"));
  }

  if (rating !== undefined && (Number.isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    return next(new ApiError(400, "Rating must be between 0 and 5"));
  }

  next();
};

export const validateOrderCreate = (req, _res, next) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return next(new ApiError(400, "Order items are required"));
  }

  for (const item of items) {
    if (!item.productId) {
      return next(new ApiError(400, "Order item productId is required"));
    }
    if (!item.quantity || Number(item.quantity) < 1) {
      return next(new ApiError(400, "Order item quantity must be at least 1"));
    }
  }

  next();
};

export const validateOrderStatus = (req, _res, next) => {
  const { status } = req.body;
  const allowed = ["pending", "paid", "shipped", "delivered", "cancelled"];

  if (!status || !allowed.includes(status)) {
    return next(new ApiError(400, "Valid order status is required"));
  }

  next();
};
