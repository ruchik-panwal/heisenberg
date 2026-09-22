"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Import the router

export default function GlobalSearch({
  placeholder = "Search medicines, compounds...",
  onSearch, // Kept this in case you still need to trigger parent events
  className = "",
}) {
  const [query, setQuery] = useState("");
  const router = useRouter(); // Initialize the router

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    
    if (trimmedQuery) {
      if (onSearch) {
        onSearch(trimmedQuery);
      }
      // Push the user to the compound page with the query parameter
      router.push(`/compound?q=${encodeURIComponent(trimmedQuery)}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center w-full h-full bg-white border border-gray-200 rounded-2xl px-6 shadow-sm ${className}`}
    >
      {/* Search Icon (Scaled up slightly for the bigger font) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-gray-400 mr-4 shrink-0"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>

      {/* Transparent Input Field (Big font, dark text) */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-full bg-transparent text-xl font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
      />
      
      {/* Hidden submit button */}
      <button type="submit" className="hidden" aria-label="Submit search">
        Search
      </button>
    </form>
  );
}