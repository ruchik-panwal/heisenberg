"use client";

import { useState } from "react";
import Header from "@/components/Header";
import ProfileModal from "@/components/profile/ProfileModal";
import SketchSidebar from "@/components/sketchPage/SketchSidebar";
import SketchViewer from "@/components/sketchPage/SketchViewer";

export default function SketchPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [smiles, setSmiles] = useState("");
  const [model3d, setModel3d] = useState(null);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 gap-2 h-screen w-full overflow-hidden relative font-vend">
        
        <Header onOpenProfile={() => setIsProfileOpen(true)} />
        
        <div className="flex-1 w-full flex gap-2 overflow-hidden">
          <SketchSidebar 
            smiles={smiles} 
            setSmiles={setSmiles} 
            setModel3d={setModel3d} 
            hasModel={!!model3d} 
          />
          
          <SketchViewer model3d={model3d} />
        </div>
      </div>

      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}