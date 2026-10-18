"use client";

import { useState } from "react";
import GlobalSearch from "@/components/GlobalSearch";

export default function ControlCenter({ 
  loading, 
  formattedCount, 
  onSearch, 
  onSort, 
  onFilter 
}) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="flex justify-between items-center text-[#0f0f0f] p-6 px-8 mb-10 relative">
      {/* Left: Counter */}
      <div className="h-13 w-40 bg-white rounded-full flex justify-between items-center px-1">
        <button className="w-11 h-11 bg-[#0f0f0f] rounded-full cursor-default"></button>
        <span className="text-3xl">{loading ? "--" : formattedCount}</span>
        <button className="w-11 h-11 bg-[#0f0f0f] rounded-full cursor-default"></button>
      </div>

      {/* Center: Search */}
      <div className="flex-1 rounded-full mx-50 h-13">
        <GlobalSearch
          placeholder="Explore molecules..."
          onSearch={onSearch}
        />
      </div>

      {/* Right: Sort & Filter Buttons with Dropdowns */}
      <div className="flex items-center gap-3 text-2xl relative">
        
        {/* Sort Menu */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsSortOpen(!isSortOpen);
              setIsFilterOpen(false);
            }}
            className="bg-white w-25 h-13 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Sort
          </button>
          
          {isSortOpen && (
            <div className="absolute top-16 right-0 w-40 bg-white rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col text-lg">
              <button onClick={() => { onSort("A-Z"); setIsSortOpen(false); }} className="px-4 py-3 hover:bg-neutral-100 text-left">A - Z</button>
              <button onClick={() => { onSort("Z-A"); setIsSortOpen(false); }} className="px-4 py-3 hover:bg-neutral-100 text-left">Z - A</button>
            </div>
          )}
        </div>

        {/* Filter Menu */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsSortOpen(false);
            }}
            className="bg-white w-25 h-13 rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
          >
            Filter
          </button>
          
          {isFilterOpen && (
            <div className="absolute top-16 right-0 w-48 bg-white rounded-2xl shadow-xl overflow-hidden z-50 flex flex-col text-lg">
              <button onClick={() => { onFilter("all"); setIsFilterOpen(false); }} className="px-4 py-3 hover:bg-neutral-100 text-left">All</button>
              <button onClick={() => { onFilter("organic"); setIsFilterOpen(false); }} className="px-4 py-3 hover:bg-neutral-100 text-left">Organic</button>
              <button onClick={() => { onFilter("inorganic"); setIsFilterOpen(false); }} className="px-4 py-3 hover:bg-neutral-100 text-left">Inorganic</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}