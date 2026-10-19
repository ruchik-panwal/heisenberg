"use client";

import Link from "next/link";

export default function Header({ onOpenProfile }) {
  return (
    <header className="flex justify-between items-center h-6 w-full px-2 font-vend tracking-[-6%]">
      {/* Logo linking to Home */}
      <Link href="/" className="font-extrabold text-[2rem] leading-[95%]">
        Heisenberg
      </Link>

      <div className="flex items-center gap-3 text-[1.2rem] h-full">
        {/* Navigation Links */}
        <Link href="/compound" >
          compounds
        </Link>
        <Link href="/sketch" >
          sketchbook
        </Link>

        {/* Profile Button */}
        <button 
          onClick={onOpenProfile}
          className="h-full w-10 bg-accent-foreground rounded-[5px] ml-2 text-white text-[1rem] select-none text-center cursor-pointer hover:opacity-80 transition-opacity"
        >
          AC
        </button>
      </div>
    </header>
  );
}