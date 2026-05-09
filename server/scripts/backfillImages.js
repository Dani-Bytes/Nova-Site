import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js";

dotenv.config();

const NAME_IMAGE_MAP = {
  Piano: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  PS5: "https://images.unsplash.com/photo-1606813909355-d96e1f1b8c1a?auto=format&fit=crop&w=800&q=80",
  Laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
};

const CATEGORY_IMAGE_MAP = {
  Electronics: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  Instruments: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  Tech: "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=800&q=80",
  Accessories: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
  Streetwear: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  Sneakers: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  Beauty: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80",
  Y2K: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80";

const isMissing = (value) => {
  if (!value || typeof value !== "string") {
    return true;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return true;
  }
  const lowered = trimmed.toLowerCase();
  return lowered === "null" || lowered === "undefined";
};

const resolveImage = (product) => {
  if (product?.name && NAME_IMAGE_MAP[product.name]) {
    return NAME_IMAGE_MAP[product.name];
  }
  if (product?.category && CATEGORY_IMAGE_MAP[product.category]) {
    return CATEGORY_IMAGE_MAP[product.category];
  }
  return DEFAULT_IMAGE;
};

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const products = await Product.find();
  let updatedCount = 0;

  for (const product of products) {
    if (!isMissing(product.imageUrl)) {
      continue;
    }

    const imageUrl = resolveImage(product);
    await Product.updateOne({ _id: product._id }, { $set: { imageUrl } });
    updatedCount += 1;
    console.log(`Updated ${product.name} -> ${imageUrl}`);
  }

  console.log(`Backfill complete. Updated ${updatedCount} product(s).`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
