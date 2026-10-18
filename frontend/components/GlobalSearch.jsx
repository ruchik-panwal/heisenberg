"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function GlobalSearch({
  placeholder = "Search medicines, compounds...",
  onSearch,
  className = "",
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchRef = useRef(null);

  // Close dropdown when clicking outside of the search component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch suggestions from the Express backend with debouncing
  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setSuggestions([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setLoading(true);
      setShowDropdown(true); // Open dropdown immediately to show "Searching..." state
      try {
        const res = await fetch(
          `http://localhost:5000/api/search?q=${encodeURIComponent(trimmedQuery)}`,
        );
        const data = await res.json();

        if (data.suggestions) {
          setSuggestions(data.suggestions);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    // Wait 300ms after the last keystroke before fetching
    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Handle form submission (hitting Enter)
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSelection(query);
  };

  // Handle clicking a suggestion or submitting the form
  const handleSelection = (selectedQuery) => {
    const trimmed = selectedQuery.trim();
    if (trimmed) {
      if (onSearch) onSearch(trimmed);
      setQuery(trimmed);
      setShowDropdown(false);
      router.push(`/compound?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div ref={searchRef} className={`relative w-full h-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full h-full bg-white border rounded-full px-6 shadow-sm focus-within:ring-2 focus-within:ring-neutral-200 transition-all"
      >
        {/* Spinner if loading, otherwise Search Icon */}
        {loading ? (
          <svg
            className="animate-spin w-6 h-6 text-gray-400 mr-4 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              className="opacity-25"
            ></circle>
            <path
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              className="opacity-75"
            ></path>
          </svg>
        ) : (
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
        )}

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length > 0) setShowDropdown(true);
          }}
          placeholder={placeholder}
          className="flex-1 h-full bg-transparent text-xl font-medium text-gray-900 placeholder-gray-400 focus:outline-none"
        />

        <button type="submit" className="hidden" aria-label="Submit search">
          Search
        </button>
      </form>

      {/* Auto-complete Dropdown */}
      {showDropdown && (
        <ul className="absolute top-full left-0 w-full mt-2 bg-white border rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto py-2">
          {loading && suggestions.length === 0 ? (
            <li className="px-6 py-3 text-gray-400 text-lg italic">
              Searching...
            </li>
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => handleSelection(suggestion)}
                className="px-6 py-3 hover:bg-neutral-100 cursor-pointer text-lg text-gray-700 capitalize transition-colors"
              >
                {suggestion}
              </li>
            ))
          ) : (
            <li className="px-6 py-3 text-gray-400 text-lg italic">
              No compounds found.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
