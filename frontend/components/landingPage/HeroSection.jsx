"use client";

import { useRef } from "react";
import gsap from "gsap";
import GlobalSearch from "@/components/GlobalSearch";
import Header from "@/components/Header";

export default function HeroSection() {
  const headerRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(wrapperRef.current, {
      height: "auto",
      duration: 0.4,
      ease: "power2.out",
      overwrite: true, // Prevents animations from getting stuck
    });
    gsap.to(headerRef.current, {
      y: 0,
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
    });
  };

  const handleMouseLeave = () => {
    gsap.to(wrapperRef.current, {
      height: 0,
      duration: 0.3,
      ease: "power2.in",
      overwrite: true, // Forces the close animation to override the open animation
    });
    gsap.to(headerRef.current, {
      y: "-100%",
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
    });
  };

  return (
    <div className="flex flex-col justify-center items-center p-2 pt-0 gap-2 h-full w-full overflow-hidden relative">
      {/* Top hover trigger zone and header wrapper */}
      <div 
        className="w-full flex flex-col items-center relative"
        onMouseEnter={handleMouseEnter} // Moved here
        onMouseLeave={handleMouseLeave}
      >
        {/* Invisible top hover trigger area expands the parent's hoverable zone */}
        <div className="absolute -top-2 left-0 w-full h-24 z-30" />

        {/* Normal flow wrapper starting at height 0 */}
        <div
          ref={wrapperRef}
          className="w-full overflow-hidden shrink-0 z-40"
          style={{ height: 0 }}
        >
          <div
            ref={headerRef}
            className="w-full pt-2"
            style={{ transform: "translateY(-100%)" }}
          >
            <Header />
          </div>
        </div>
      </div>

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