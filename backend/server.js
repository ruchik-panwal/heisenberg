import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { protect } from "./middleware/authMiddleware.js";
dotenv.config();

import { connectDB } from "./config/db.js";
import { handleSearch } from "./controllers/searchController.js";
import { handleGetMolecule } from "./controllers/moleculeController.js";
import { handleGetDictionary } from "./controllers/dictionaryController.js";
import { registerUser, loginUser } from "./controllers/authController.js";
import {
  getUserDashboard,
  saveBookmark,
  removeBookmark,
  addSearchHistory,
  saveCustomMolecule
} from "./controllers/userController.js";

import { handleGenerate3D } from "./controllers/synthController.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Auth Routes
app.post("/api/auth/register", registerUser);
app.post("/api/auth/login", loginUser);

// API Routes
app.get("/api/search", handleSearch);
app.get("/api/molecule/:identifier", handleGetMolecule);
app.get("/api/dictionary", handleGetDictionary);

// User Routes
app.get("/api/user/dashboard", protect, getUserDashboard);
app.post("/api/user/bookmarks", protect, saveBookmark);
app.delete("/api/user/bookmarks/:cid", protect, removeBookmark);
app.post("/api/user/history", protect, addSearchHistory);
app.post("/api/user/custom-molecules", protect, saveCustomMolecule);

// 3D Synthesis Route
app.post("/api/generate-3d", handleGenerate3D);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HeisenBerg Backend running on http://localhost:${PORT}`);
});