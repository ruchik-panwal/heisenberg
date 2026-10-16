"use client";

import GlobalSearch from "@/components/GlobalSearch";
import Header from "@/components/Header";
import AnimatedHeader from "./AniHeader"; // Adjust the import path as needed

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center p-2 pt-0 gap-2 h-full w-full overflow-hidden relative">
      <AnimatedHeader>
        <Header />
      </AnimatedHeader>

      {/* Main Hero Content */}
      <div className="flex flex-col justify-center items-center h-full w-full text-[20rem] font-bold tracking-[-6%] bg-black rounded-4xl relative overflow-hidden">
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
  );
}
