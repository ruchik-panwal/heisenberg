"use client";

import GlobalSearch from "@/components/GlobalSearch";
import Header from "@/components/Header";

export default function HeroSection() {
  return (
    <div className="flex flex-col justify-center items-center p-3 gap-3 h-full w-full">
      <Header />
      <div className="flex flex-col justify-center items-center h-full w-full text-[20rem] font-bold tracking-[-6%] bg-gray-400 rounded-4xl">
        <div className="font-vend leading-[84%]">Heisenberg</div>
        <div className="w-full max-w-287.5 h-14">
          <GlobalSearch
            placeholder="Explore molecules..."
            onSearch={(q) => console.log(q)}
          />
        </div>
      </div>
    </div>
  );
}
