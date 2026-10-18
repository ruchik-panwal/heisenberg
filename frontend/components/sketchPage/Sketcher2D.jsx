"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import JSME to prevent Next.js SSR crashes
const Jsme = dynamic(() => import("jsme-react"), { ssr: false });

export default function Sketcher2D({ onClose }) {
  const [smiles, setSmiles] = useState("");
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const handleSynthesize = async () => {
    if (!smiles) return;
    setIsSynthesizing(true);
    
    try {
      // Future backend route to convert SMILES to 3D coordinates
      const res = await fetch(`http://localhost:5000/api/generate-3d`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles })
      });
      
      const data = await res.json();
      console.log("Generated 3D Data:", data);
      
    } catch (error) {
      console.error("Synthesis failed:", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md pointer-events-auto">
      <div className="bg-[#111111] border border-white/10 rounded-[2rem] p-8 flex flex-col items-center shadow-2xl max-w-4xl w-full mx-4">
        
        <div className="flex justify-between w-full mb-6 items-center">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">2D Molecular Sketcher</h2>
            <p className="text-sm text-neutral-400">Draw a structure to generate a 3D model.</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-xl p-2 cursor-pointer">
            ✕
          </button>
        </div>

        {/* The JSME Canvas */}
        <div className="bg-white rounded-xl overflow-hidden">
          <Jsme
            height="400px"
            width="600px"
            options="oldlook,star"
            onChange={(newSmiles) => setSmiles(newSmiles)}
          />
        </div>

        {/* Real-time SMILES output */}
        <div className="w-full mt-6 bg-black/50 border border-white/5 p-4 rounded-xl">
          <span className="text-xs text-neutral-500 uppercase tracking-widest block mb-1">Generated SMILES</span>
          <span className="font-mono text-sm text-neutral-300 break-all">
            {smiles || "Draw a molecule to generate SMILES..."}
          </span>
        </div>

        <button
          onClick={handleSynthesize}
          disabled={!smiles || isSynthesizing}
          className="mt-8 px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-md cursor-pointer"
        >
          {isSynthesizing ? "Computing 3D Coordinates..." : "Synthesize 3D Model"}
        </button>
      </div>
    </div>
  );
}