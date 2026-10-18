"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import JsmeCanvas from "./JsmeCanvas";
import SaveMoleculeUI from "./SaveMoleculeUI";

export default function SketchSidebar({ smiles, setSmiles, setModel3d, hasModel }) {
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  
  // Catch the "?load=" parameter from the URL if coming from the Profile
  const searchParams = useSearchParams();
  const initialSmiles = searchParams.get("load") || "";

  // Auto-set the SMILES state if we loaded from a save
  useEffect(() => {
    if (initialSmiles) setSmiles(initialSmiles);
  }, [initialSmiles, setSmiles]);

  const handleSynthesize = async () => {
    if (!smiles) return;
    setIsSynthesizing(true);
    
    try {
      const res = await fetch(`http://localhost:5000/api/generate-3d`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ smiles })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.details || data.error || "Synthesis failed");
      
      setModel3d(data.model3d || data);
    } catch (error) {
      console.error("Synthesis error:", error);
      alert(`Synthesis Failed: ${error.message}`);
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="w-[40%] min-w-[450px] h-full bg-[#050505] rounded-[2rem] border border-white/10 p-8 flex flex-col relative overflow-y-auto [&::-webkit-scrollbar]:hidden shadow-2xl">
      
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-neutral-500 tracking-tight mb-3">
          Molecular Sandbox
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed font-medium">
          Draw any 2D chemical structure using the JSME canvas below. When you are ready, synthesize it to generate computed 3D coordinates.
        </p>
      </div>

      <div className="ring-1 ring-white/10 rounded-2xl overflow-hidden mb-6 shadow-2xl">
        {/* Pass initialSmiles to the Canvas */}
        <JsmeCanvas initialSmiles={initialSmiles} onChange={(newSmiles) => setSmiles(newSmiles)} />
      </div>

      <div className="w-full bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl mb-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
            Generated SMILES
          </span>
          {smiles && (
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.6)]"></div>
          )}
        </div>
        <span suppressHydrationWarning className="font-mono text-sm text-neutral-200 break-all leading-relaxed">
          {smiles || "Awaiting structural input..."}
        </span>
      </div>

      <div className="flex-1"></div>

      <button
        onClick={handleSynthesize}
        disabled={!smiles || isSynthesizing}
        suppressHydrationWarning
        className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(255,255,255,0.2)] active:translate-y-0 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-3 text-lg"
      >
        {isSynthesizing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path>
            </svg>
            Computing Coordinates...
          </>
        ) : (
          "Synthesize 3D Model"
        )}
      </button>

      {hasModel && (
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <SaveMoleculeUI smiles={smiles} />
        </div>
      )}
    </div>
  );
}