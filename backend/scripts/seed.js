import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Product from "../models/Product.js";
import User from "../models/User.js";

dotenv.config();

const seedProducts = [
  {
    name: "Holo Runner",
    description: "Lightweight runners with iridescent panels and cushioned soles.",
    price: 149,
    category: "Sneakers",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    stock: 32,
    rating: 4.8,
  },
  {
    name: "Nova Sling",
    description: "Compact crossbody bag with modular straps for daily carry.",
    price: 89,
    category: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    stock: 48,
    rating: 4.6,
  },
  {
    name: "Cloud Hoodie",
    description: "Oversized hoodie with ultra-soft fleece lining and tonal branding.",
    price: 119,
    category: "Streetwear",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    stock: 60,
    rating: 4.9,
  },
  {
    name: "Pixel Shades",
    description: "Retro-inspired sunglasses with gradient lenses and UV protection.",
    price: 59,
    category: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80",
    stock: 75,
    rating: 4.5,
  },
  {
    name: "Nova Pods",
    description: "Wireless headphones with spatial audio and 28-hour battery.",
    price: 199,
    category: "Tech",
    imageUrl:
      "https://images.unsplash.com/photo-1511376777868-611b54f68947?auto=format&fit=crop&w=800&q=80",
    stock: 40,
    rating: 4.7,
  },
  {
    name: "Lilac Case",
    description: "Silicone phone case with shock protection and pastel finish.",
    price: 29,
    category: "Tech",
    imageUrl:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
    stock: 120,
    rating: 4.3,
  },
  {
    name: "Retro Cargo Pants",
    description: "Wide-leg cargo pants with utility pockets and vintage wash finish.",
    price: 99,
    category: "Y2K",
    imageUrl:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    stock: 45,
    rating: 4.4,
  },
  {
    name: "Glow Serum",
    description: "Vitamin C face serum with niacinamide for radiant, dewy skin.",
    price: 39,
    category: "Beauty",
    imageUrl:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?auto=format&fit=crop&w=800&q=80",
    stock: 90,
    rating: 4.7,
  },
  {
    name: "Oversized Graphic Tee",
    description: "Heavyweight cotton tee with retro graphic print and dropped shoulders.",
    price: 69,
    category: "Streetwear",
    imageUrl:
      "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?auto=format&fit=crop&w=800&q=80",
    stock: 55,
    rating: 4.6,
  },
  {
    name: "Nova Smartwatch",
    description: "Minimalist smartwatch with AMOLED display, health tracking, and 5-day battery.",
    price: 249,
    category: "Tech",
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    stock: 25,
    rating: 4.8,
  },
];

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const adminEmail = process.env.ADMIN_EMAIL || "admin@nova.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "NovaAdmin123!";
  const adminName = process.env.ADMIN_NAME || "Nova Admin";

  let adminUser = await User.findOne({ email: adminEmail }).select("+password");

  if (!adminUser) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hashed,
      role: "admin",
    });
    console.log(`Created admin user ${adminEmail}`);
  } else if (adminUser.role !== "admin") {
    adminUser.role = "admin";
    await adminUser.save();
    console.log(`Updated ${adminEmail} to admin role`);
  }

  const inserted = [];
  for (const product of seedProducts) {
    const existing = await Product.findOne({ name: product.name });
    if (!existing) {
      inserted.push(await Product.create(product));
    }
  }

  console.log(`Seeded ${inserted.length} products`);
  console.log("Seed complete");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
