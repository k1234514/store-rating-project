import dotenv from "dotenv";
import { sequelize, User, Store } from "./models/index.js";
import bcrypt from "bcryptjs";

dotenv.config();

async function seed() {
  try {
    await sequelize.sync({ force: true }); // Reset database

    // 🔹 Admin user
    const adminPass = await bcrypt.hash("Admin@123", 10);
    await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: adminPass,
      address: "Admin Address",
      role: "admin"
    });

    // 🔹 Store owner
    const ownerPass = await bcrypt.hash("Owner@123", 10);
    const owner = await User.create({
      name: "Store Owner",
      email: "owner@example.com",
      password: ownerPass,
      address: "Owner Address",
      role: "owner"
    });

    // 🔹 Normal user (for rating tests)
    const userPass = await bcrypt.hash("User@123", 10);
    await User.create({
      name: "Normal User",
      email: "user@example.com",
      password: userPass,
      address: "User Address",
      role: "user"
    });

    // 🔹 Sample Store
    await Store.create({
      name: "Sample Store",
      email: "store@example.com",
      address: "Sample Address",
      ownerId: owner.id
    });

    console.log("✅ Database seeded successfully!");
    console.log("👉 Login credentials:");
    console.log("   Admin  -> admin@example.com / Admin@123");
    console.log("   Owner  -> owner@example.com / Owner@123");
    console.log("   User   -> user@example.com  / User@123");

    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}

seed();
