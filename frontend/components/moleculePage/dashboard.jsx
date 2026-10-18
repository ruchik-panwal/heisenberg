"use client";

import Viewer from "@/components/moleculePage/3dViewer";

export default function Dashboard({ data }) {
  if (!data) return null;

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden rounded-4xl bg-black font-vend">
      
      {/* 3D Viewer Background Layer */}
      <div className="absolute inset-0 z-0">
        <Viewer moleculeData={data.model3d} />
      </div>

      {/* UI Overlay Layer - pointer-events-none allows clicks to pass through to the 3D canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none p-8 flex justify-between">
        
        {/* Left Side Column */}
        <div className="w-[30%] min-w-[320px] flex flex-col gap-6 h-full overflow-y-auto pointer-events-auto [&::-webkit-scrollbar]:hidden">
          
          {/* Basics Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-white shadow-2xl">
            <h1 className="text-4xl font-bold tracking-tight mb-2 capitalize">{data.basics.name}</h1>
            <div className="flex items-center gap-3 text-sm text-neutral-300 font-medium mb-4">
              <span className="bg-white/10 px-3 py-1 rounded-full">{data.properties.formula}</span>
              <span className="bg-white/10 px-3 py-1 rounded-full">{data.properties.molecularWeight} g/mol</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              {data.basics.description}
            </p>
          </div>

          {/* Properties Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-white shadow-2xl">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Chemical Properties</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/20 rounded-2xl p-4">
                <span className="text-neutral-400 text-xs uppercase tracking-wider block mb-1">Exact Mass</span>
                <span className="font-medium text-lg">{data.properties.exactMass}</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4">
                <span className="text-neutral-400 text-xs uppercase tracking-wider block mb-1">Complexity</span>
                <span className="font-medium text-lg">{data.properties.complexity}</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4">
                <span className="text-neutral-400 text-xs uppercase tracking-wider block mb-1">H-Bond Donors</span>
                <span className="font-medium text-lg">{data.properties.hBondDonors}</span>
              </div>
              <div className="bg-black/20 rounded-2xl p-4">
                <span className="text-neutral-400 text-xs uppercase tracking-wider block mb-1">H-Bond Acceptors</span>
                <span className="font-medium text-lg">{data.properties.hBondAcceptors}</span>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Side Column */}
        <div className="w-[30%] min-w-[320px] flex flex-col gap-6 h-full overflow-y-auto pointer-events-auto [&::-webkit-scrollbar]:hidden">
          
          {/* Pharmacology Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-white shadow-2xl flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Pharmacology</h2>
            
            <div className="space-y-5">
              {data.pharmacology.mechanismOfAction && data.pharmacology.mechanismOfAction !== "Data not available." && (
                <div>
                  <h3 className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Mechanism of Action</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed bg-black/20 p-4 rounded-2xl">
                    {data.pharmacology.mechanismOfAction}
                  </p>
                </div>
              )}
              
              {data.pharmacology.therapeuticUses && data.pharmacology.therapeuticUses !== "Data not available." && (
                <div>
                  <h3 className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Therapeutic Uses</h3>
                  <p className="text-sm text-neutral-200 leading-relaxed bg-black/20 p-4 rounded-2xl">
                    {data.pharmacology.therapeuticUses}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Safety Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 text-white shadow-2xl flex-shrink-0">
            <h2 className="text-xl font-semibold mb-4 text-white/90">Safety & Hazards</h2>
            <p className="text-sm text-neutral-200 leading-relaxed bg-black/20 p-4 rounded-2xl">
              {data.safety.hazards}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}