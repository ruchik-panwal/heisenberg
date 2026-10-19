import User from "../models/User.js";

// Fetch user dashboard data
export const getUserDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      bookmarks: user.bookmarks,
      history: user.history,
      customMolecules: user.customMolecules // Added this so the frontend receives the sketches
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
};

// Add or update a bookmark (and its note)
export const saveBookmark = async (req, res) => {
  try {
    const { cid, name, note } = req.body;
    const user = await User.findById(req.user._id);

    // Check if already bookmarked
    const existingIndex = user.bookmarks.findIndex(b => b.cid === cid);
    
    if (existingIndex >= 0) {
      // Update the existing note
      user.bookmarks[existingIndex].note = note !== undefined ? note : user.bookmarks[existingIndex].note;
    } else {
      // Add new bookmark
      user.bookmarks.push({ cid, name, note });
    }

    await user.save();
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ error: "Failed to save bookmark" });
  }
};

// Remove a bookmark
export const removeBookmark = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = await User.findById(req.user._id);
    
    user.bookmarks = user.bookmarks.filter(b => b.cid !== cid);
    await user.save();
    
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
};

// Add to search history
export const addSearchHistory = async (req, res) => {
  try {
    const { query, cid } = req.body;
    const user = await User.findById(req.user._id);

    // Add to the front of the array
    user.history.unshift({ query, cid });

    // Keep only the 50 most recent searches so DB doesn't bloat
    if (user.history.length > 50) {
      user.history = user.history.slice(0, 50);
    }

    await user.save();
    res.json(user.history);
  } catch (error) {
    res.status(500).json({ error: "Failed to save history" });
  }
};

export const saveCustomMolecule = async (req, res) => {
  try {
    const { name, smiles } = req.body;

    if (!name || !smiles) {
      return res.status(400).json({ message: "Name and SMILES are required." });
    }

    // req.user is provided by your protect middleware
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.customMolecules.push({ name, smiles });
    await user.save();

    res.status(201).json({ 
      message: "Molecule saved to profile!", 
      customMolecules: user.customMolecules 
    });
  } catch (error) {
    console.error("Save molecule error:", error);
    res.status(500).json({ message: "Failed to save molecule." });
  }
};