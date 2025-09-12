import express from "express";
import { Rating, Store, User } from "../models/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

// Add a rating to a store
// Endpoint: POST /stores/:storeId/ratings
router.post("/:storeId/ratings", authMiddleware(), async (req, res) => {
  try {
    const { storeId } = req.params;
    const { score, comment } = req.body;
    const userId = req.user.id; // from JWT

    if (!score) {
      return res.status(400).json({ error: "Score is required" });
    }
    if (score < 1 || score > 5) {
      return res.status(400).json({ error: "Score must be between 1 and 5" });
    }

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const rating = await Rating.create({
      userId,
      storeId,
      rating: score,
      comment: comment || null,
    });

    res.status(201).json({ message: "Rating added successfully", rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get all ratings for a store
// Endpoint: GET /stores/:storeId/ratings
router.get("/:storeId/ratings", async (req, res) => {
  try {
    const { storeId } = req.params;

    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ error: "Store not found" });

    const ratings = await Rating.findAll({
      where: { storeId },
      include: [{ model: User, attributes: ["id", "name", "email"] }],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
