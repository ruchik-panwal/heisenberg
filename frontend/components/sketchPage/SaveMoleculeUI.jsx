"use client";

import { useState } from "react";

export default function SaveMoleculeUI({ smiles }) {
  const [customName, setCustomName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToProfile = async () => {
    if (!customName || !smiles) return;
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to save custom molecules.");
        setIsSaving(false);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/user/custom-molecules`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ name: customName, smiles })
      });

      if (!res.ok) throw new Error("Failed to save");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setCustomName(""); 
    } catch (error) {
      console.error("Save error:", error);
      alert("Could not save to profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
      <h3 className="text-sm font-semibold text-white mb-3">Save to Profile</h3>
      <div className="flex gap-2">
        <input 
          type="text" 
          placeholder="Name your molecule..." 
          value={customName}
          onChange={(e) => setCustomName(e.target.value)}
          className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
        <button
          onClick={handleSaveToProfile}
          disabled={!customName || isSaving || saveSuccess}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap"
        >
          {isSaving ? "Saving..." : saveSuccess ? "Saved ✓" : "Save"}
        </button>
      </div>
    </div>
  );
}