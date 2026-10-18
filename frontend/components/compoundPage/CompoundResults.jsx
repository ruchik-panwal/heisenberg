"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

import ControlCenter from "./ControlCenter"
import CompoundItem from "./CompoundItem"

export default function CompoundResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Sort and Filter state
  const [sortType, setSortType] = useState("");
  const [filterType, setFilterType] = useState("all");

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        setResults(data.suggestions || []);
      } catch (error) {
        console.error("Failed to fetch search results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  // Apply sorting and filtering logic
  const displayedResults = [...results]
    .filter((compound) => {
      if (filterType === "all") return true;
      // Note: Add specific logic here once your API returns objects with properties
      // e.g., if (filterType === "organic") return compound.type === "organic";
      return true; 
    })
    .sort((a, b) => {
      if (sortType === "A-Z") return a.localeCompare(b);
      if (sortType === "Z-A") return b.localeCompare(a);
      return 0; // Default order
    });

  // Use displayedResults length for the counter
  const formattedCount = displayedResults.length.toString().padStart(2, "0");

  return (
    <div className="flex flex-col justify-center items-center h-full w-full font-vend">
      <div className="h-full w-full bg-[#0f0f0f] rounded-4xl">
        <ControlCenter
          formattedCount={formattedCount}
          loading={loading}
          onSearch={(q) => router.push(`?q=${encodeURIComponent(q)}`)}
          onSort={(type) => setSortType(type)}
          onFilter={(type) => setFilterType(type)}
        />

        <div className="flex-1 overflow-y-auto px-10">
          <div className="w-full" />

          {loading ? (
            <div className="flex items-center justify-center h-48 text-neutral-400">
              <span className="animate-pulse">Loading results...</span>
            </div>
          ) : displayedResults.length > 0 ? (
            displayedResults.map((compound, idx) => (
              <CompoundItem
                key={idx}
                compound={compound}
                onClick={() =>
                  router.push(`/molecule/${encodeURIComponent(compound)}`)
                }
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-neutral-500 space-y-2">
              <p>No results found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          {!loading &&
            displayedResults.length > 0 &&
            displayedResults.length < 10 &&
            Array.from({ length: 10 - displayedResults.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="border-b border-[#969696] h-10 w-full pointer-events-none"
              />
            ))}
        </div>
      </div>
    </div>
  );
}