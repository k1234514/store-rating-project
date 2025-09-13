import express from "express";
import { Store } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// ✅ POST /stores - create a store (authenticated users)
router.post("/", authMiddleware(), async (req, res) => {
  try {
    const { name, location, ownerId, email, address } = req.body;

    if (!name || !location || !ownerId || !email || !address) {
      return res.status(400).json({
        error: "Name, location, ownerId, email, and address are required",
      });
    }

    const store = await Store.create({
      name,
      location,
      ownerId,
      email,
      address,
    });

    res.status(201).json({ message: "Store created successfully", store });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET /stores - fetch all stores
router.get("/", async (req, res) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
