"use client";

import dynamic from "next/dynamic";

const Jsme = dynamic(() => import("jsme-react").then((mod) => mod.Jsme), { 
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full flex flex-col items-center justify-center bg-black/40 rounded-2xl border border-white/5">
      <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <span className="text-neutral-500 font-mono text-xs tracking-widest uppercase">Mounting Canvas...</span>
    </div>
  )
});

// ADDED: initialSmiles prop
export default function JsmeCanvas({ onChange, initialSmiles }) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#e5e5e5] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.5)] flex flex-col transition-all mb-6">
      
      <div className="w-full bg-[#121212] px-4 py-3 flex justify-between items-center z-20 shadow-md">
        <div className="flex items-center gap-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          <span className="text-[10px] text-neutral-300 font-mono uppercase tracking-[0.2em] font-semibold">
            Interactive Editor
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-500 font-mono uppercase tracking-widest px-2 py-1 bg-white/5 rounded-md border border-white/5">
            JSME v2020
          </span>
        </div>
      </div>
      
      <div className="w-full bg-[#f4f4f5] relative z-10 p-3 border-t border-white/10">
        <div className="rounded-xl overflow-hidden bg-white ring-1 ring-black/5 shadow-sm">
          <Jsme
            height="340px"
            width="100%"
            options="newlook,star,autoez,nozoom"
            smiles={initialSmiles} // Pass the saved smiles here
            onChange={onChange}
          />
        </div>
      </div>

    </div>
  );
}