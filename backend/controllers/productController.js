import { asyncHandler } from "../utils/asyncHandler.js";
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

export const getProducts = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const products = await listProducts({ search, category });
  res.json(products);
});

export const getProduct = asyncHandler(async (req, res) => {
  const product = await getProductById(req.params.id);
  res.json(product);
});

export const createNewProduct = asyncHandler(async (req, res) => {
  const product = await createProduct(req.body);
  res.status(201).json(product);
});

export const updateExistingProduct = asyncHandler(async (req, res) => {
  const product = await updateProduct(req.params.id, req.body);
  res.json(product);
});

export const removeProduct = asyncHandler(async (req, res) => {
  await deleteProduct(req.params.id);
  res.json({ message: "Product removed" });
});
