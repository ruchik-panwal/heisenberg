import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Bookmarks with custom notes
    bookmarks: [
      {
        cid: { type: String, required: true },
        name: { type: String, required: true },
        note: { type: String, default: "" },
        savedAt: { type: Date, default: Date.now },
      },
    ],
    // Add this inside your User schema definition
    customMolecules: [
      {
        name: { type: String, required: true },
        smiles: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Search history (kept to max 50 items in the controller)
    history: [
      {
        query: { type: String, required: true },
        cid: { type: String }, // Optional, if they clicked a specific compound
        searchedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
