"use client";

import Viewer from "@/components/moleculePage/3dViewer";

export default function SketchViewer({ model3d }) {
  return (
    <div className="flex-1 h-full bg-[#0a0a0a] rounded-4xl border border-white/5 relative overflow-hidden flex items-center justify-center">
      {model3d ? (
        <Viewer moleculeData={model3d} />
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 opacity-40">
          <svg className="w-24 h-24 mb-6 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2-1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
          </svg>
          <h3 className="text-xl font-mono tracking-widest uppercase text-neutral-400 mb-2">Awaiting Synthesis</h3>
          <p className="text-sm text-neutral-500 max-w-sm">
            The 3D WebGL viewport is standing by. Draw a structure on the left and synthesize to render.
          </p>
        </div>
      )}
    </div>
  );
}