import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { sequelize } from "./models/index.js";
import authRoutes from "./routes/auth.js";
import storeRoutes from "./routes/store.js";
import ratingRoutes from "./routes/rating.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Test route to verify server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/auth", authRoutes);
app.use("/stores", storeRoutes);
app.use("/stores", ratingRoutes); // <-- ratings route works as /stores/:storeId/ratings

const PORT = process.env.PORT || 5000;

// Test DB connection and sync
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    return sequelize.sync({ alter: true }); // Keeps existing data, updates tables safely
  })
  .then(() => {
    console.log("✅ Database synced (alter: true)");
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch(err => console.error("❌ Unable to connect to DB:", err));
