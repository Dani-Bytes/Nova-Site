import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/User.js";

dotenv.config();

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return null;
  }
  return process.argv[index + 1];
};

const run = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI is not set");
    process.exit(1);
  }

  const id = getArgValue("--id");
  const email = getArgValue("--email");

  if (!id && !email) {
    console.error("Provide --id or --email to promote a user");
    process.exit(1);
  }

  await mongoose.connect(mongoUri);

  const query = id ? { _id: id } : { email };
  const user = await User.findOneAndUpdate(query, { role: "admin" }, { new: true });

  if (!user) {
    console.error("User not found");
    await mongoose.disconnect();
    process.exit(1);
  }

  console.log(`Promoted ${user.email} to admin`);
  await mongoose.disconnect();
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
