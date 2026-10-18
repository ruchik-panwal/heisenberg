"use client";

import { useState } from "react";
import GlobalSearch from "@/components/GlobalSearch";
import Header from "@/components/Header";
import AnimatedHeader from "../animations/AniHeader"; 
import ProfileModal from "../profile/ProfileModal"; // Make sure path is correct

export default function HeroSection() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 pt-0 gap-2 h-full w-full overflow-hidden relative">
        <AnimatedHeader>
          <Header onOpenProfile={() => setIsProfileOpen(true)} />
        </AnimatedHeader>

        {/* Main Hero Content */}
        <div className="flex flex-col justify-center items-center h-full w-full text-[20rem] font-bold tracking-[-6%] bg-black rounded-4xl relative ">
          <div className="relative z-10 flex flex-col justify-center items-center h-full w-full">
            <div className="font-vend leading-[84%] text-white">Heisenberg</div>
            <div className="w-full max-w-287.5 h-14">
              <GlobalSearch
                placeholder="Explore molecules..."
                onSearch={(q) => console.log(q)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Modal is now totally free from overflow clipping! */}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}