'use client'
import GlobalSearch from "../GlobalSearch"

export default function NaviHub() {
  return (
    <div className="w-full h-13 flex items-center justify-between gap-6 font-vend">
      
      {/* Left: Page Changer */}
      <div className="h-full flex-shrink-0">
        <PageChanger />
      </div>

      {/* Middle: Search Bar Outline 
          flex-1 keeps it fluid, but max-w-2xl stops it from getting too wide.
          mx-auto helps it stay centered in the remaining space.
      */}
      <div className="flex-1 max-w-4xl h-full bg-white border border-gray-600 rounded-full mx-auto">
        <GlobalSearch
            placeholder="Explore molecules..."
            onSearch={(q) => console.log(q)}
          />  
      </div>

      {/* Right: Action Buttons 
          h-full makes them exactly the same height as the search bar 
          and PageChanger. Increased px-8 for that wide pill look.
      */}
      <div className="flex items-center gap-3 h-full flex-shrink-0">
        <button className="h-full bg-[#222222] text-white px-8 rounded-full text-lg font-medium">
          Sort
        </button>
        <button className="h-full bg-[#222222] text-white px-8 rounded-full text-lg font-medium">
          Filter
        </button>
      </div>
      
    </div>
  );
}

function PageChanger() {
  return (
    // Added h-full to the parent so it can scale to its container if needed,
    // or rely on the text size to set the base height.
    <div className="flex items-center h-full gap-3 bg-white border border-gray-600 rounded-full p-1.5">
      {/* 
        Replaced fixed w-7 h-7 with h-full aspect-square. 
        This makes the button scale to 100% of the parent's inner height while remaining perfectly round.
      */}
      <button
        className="h-full aspect-square bg-[#222222] rounded-full flex items-center justify-center text-white focus:outline-none"
        aria-label="Previous Page"
      >
        {/* Changed SVG width/height to percentages so the icon scales with the button */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[55%] h-[55%]"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      {/* Page Number */}
      <span className="text-2xl text-black font-medium leading-none px-1">
        05
      </span>

      <button
        className="h-full aspect-square bg-[#222222] rounded-full flex items-center justify-center text-white focus:outline-none"
        aria-label="Next Page"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-[55%] h-[55%]"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
