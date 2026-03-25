import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";
import { User } from "./models/User";
import dotenv from "dotenv";
dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGO_URI!);
  await User.deleteMany({});

  const hash = await bcrypt.hash("password", 10);
  const users = Array.from({ length: 1000 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: hash,
  }));
  await User.insertMany(users);
  console.log("✅ 1000 utilisateurs seedés");
  process.exit(0);
}

seed();
