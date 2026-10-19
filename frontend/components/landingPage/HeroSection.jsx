"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import GlobalSearch from "@/components/GlobalSearch";
import Header from "@/components/Header";
import AnimatedHeader from "../animations/AniHeader";
import ProfileModal from "../profile/ProfileModal";

const Ballpit = dynamic(() => import("./Ballpit"), { ssr: false });

export default function HeroSection() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 pt-0 gap-2 h-full w-full overflow-hidden relative">
        <AnimatedHeader>
          <Header onOpenProfile={() => setIsProfileOpen(true)} />
        </AnimatedHeader>

        <div className="flex flex-col justify-center items-center h-full w-full text-[20rem] font-bold tracking-[-6%] bg-black rounded-4xl relative overflow-hidden">
          {/* Background Layer: Ballpit */}
          <div className="absolute inset-0 z-0">
            <Ballpit
              gravity={0}
              colors={["#ffffff", "#222222", "#ff4444"]}
              drift={0.4}
              followCursor
              grab
              clickEffect="burst"
              minSize={0.5}
              maxSize={1}
              friction={0.9975}
              wallBounce={0.95}
              bounce={0.85}
              depth={3.25}
              cursorSize={1}
              lightIntensity={2}
              exposure={0.6}
              shadows={0.8}
              intro
            />
          </div>

          {/* Middle Layer: Semi-transparent Overlay */}
          {/* Adjust the /50 to /40 for lighter, or /70 for darker */}
          <div className="absolute inset-0 z-[5] bg-black/30 pointer-events-none"></div>

          {/* Foreground Layer: Text and Search */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full w-full pointer-events-none">
            <div className="font-vend leading-[84%] text-white">Heisenberg</div>
            <div className="w-full max-w-287.5 h-14 pointer-events-auto">
              <GlobalSearch
                placeholder="Explore molecules..."
                onSearch={(q) => console.log(q)}
              />
            </div>
          </div>
        </div>
      </div>

      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}
