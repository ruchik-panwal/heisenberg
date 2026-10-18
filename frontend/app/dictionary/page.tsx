"use client";

import { useState, useEffect, SetStateAction } from "react";
import { useRouter } from "next/navigation";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function DictionaryPage() {
  const router = useRouter();
  const [activeLetter, setActiveLetter] = useState("A");
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ compounds: [], totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDictionary = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/dictionary?letter=${activeLetter}&page=${page}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch dictionary", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDictionary();
  }, [activeLetter, page]);

  // Handlers
  const handleLetterClick = (letter: SetStateAction<string>) => {
    setActiveLetter(letter);
    setPage(1); // Reset to page 1 when changing letters
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 md:p-16">
      <div className="max-w-7xl mx-auto mt-8">
        
        <div className="mb-12">
          <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
            Compound Dictionary
          </h1>
          <p className="text-xl text-neutral-400">
            Browse the WHO Essential Medicines index alphabetically.
          </p>
        </div>

        {/* A-Z Navigation Bar */}
        <div className="flex flex-wrap gap-2 mb-12 bg-white/5 p-4 rounded-3xl border border-white/10">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                activeLetter === letter
                  ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  : "text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Grid and Loading States */}
        {loading ? (
          <div className="flex justify-center py-20 text-neutral-500">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
              <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75"></path>
            </svg>
          </div>
        ) : data.compounds.length > 0 ? (
          <>
            {/* Compound Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.compounds.map((med, idx) => (
                <div
                  key={idx}
                  onClick={() => router.push(`/molecule/${encodeURIComponent(med)}`)}
                  className="group bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:bg-neutral-800 hover:border-neutral-600 transition-all cursor-pointer flex items-center justify-between"
                >
                  <span className="text-neutral-200 font-medium truncate pr-2 group-hover:text-white">
                    {med}
                  </span>
                  <svg className="w-4 h-4 text-neutral-600 group-hover:text-white transition-colors shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-16">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-6 py-3 rounded-full bg-white/10 text-white font-medium hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="text-neutral-400 font-mono">
                  Page {page} of {data.totalPages}
                </span>
                <button
                  disabled={page === data.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-2xl font-semibold text-neutral-300 mb-2">No compounds found</h3>
            <p className="text-neutral-500">There are no essential medicines starting with "{activeLetter}" in the database.</p>
          </div>
        )}

      </div>
    </div>
  );
}