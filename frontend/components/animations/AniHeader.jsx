"use client";

import { useRef } from "react";
import gsap from "gsap";

export default function AnimatedHeader({ children }) {
  const headerRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(wrapperRef.current, {
      height: "auto",
      duration: 0.4,
      ease: "power2.out",
      overwrite: true,
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
      overwrite: true,
    });
    gsap.to(headerRef.current, {
      y: "-100%",
      duration: 0.3,
      ease: "power2.in",
      overwrite: true,
    });
  };

  return (
    <div 
      className="w-full flex flex-col items-center relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Invisible top hover trigger area */}
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
          {children}
        </div>
      </div>
    </div>
  );
}