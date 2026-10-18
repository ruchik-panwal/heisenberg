import axios from "axios";
import { cache } from "../services/cache.js";

export async function handleGetDictionary(req, res) {
  const letter = (req.query.letter || "A").toLowerCase();
  const page = parseInt(req.query.page) || 1;
  const limit = 50; 

  const cacheKey = `api_dict_${letter}`;
  let cleanList = [];

  // Check cache so clicking "Next Page" is instant and doesn't re-fetch from PubChem
  if (cache.has(cacheKey)) {
    cleanList = cache.get(cacheKey);
  } else {
    try {
      // 1. PubChem blocks 1-letter searches. 
      // We trick it by searching common 2-letter combos (vowels + common consonants).
      const secondLetters = ["a", "e", "i", "o", "u", "c", "l", "p", "s", "t"];
      let rawList = [];

      // 2. Fetch in small batches of 3 to perfectly respect PubChem's "5 requests per second" limit
      for (let i = 0; i < secondLetters.length; i += 3) {
        const batch = secondLetters.slice(i, i + 3);
        const searchPromises = batch.map((char) => {
          const prefix = letter + char; // e.g., "A" + "s" = "as"
          const url = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${prefix}/json?limit=60`;
          
          // Catch individual errors so one bad prefix doesn't crash the loop
          return axios.get(url, { timeout: 5000 }).catch(() => null);
        });

        const results = await Promise.all(searchPromises);
        
        results.forEach((response) => {
          if (response?.data?.dictionary_terms?.compound) {
            rawList.push(...response.data.dictionary_terms.compound);
          }
        });
        
        // Wait 200ms between batches to keep the Throttle Monitor in the Green (0%)
        await new Promise(resolve => setTimeout(resolve, 200)); 
      }

      // 3. Clean up the data (remove fragments like 'a+', capitalize first letter)
      cleanList = rawList
        .filter((name) => name.toLowerCase().startsWith(letter))
        .filter((name) => name.length > 2 && /^[a-zA-Z0-9]/.test(name)) 
        .map((name) => name.charAt(0).toUpperCase() + name.slice(1));

      // 4. Remove exact duplicates and sort alphabetically
      cleanList = [...new Set(cleanList)].sort((a, b) => a.localeCompare(b));

      cache.set(cacheKey, cleanList);
    } catch (error) {
      console.error("PubChem API error:", error.message);
      return res.status(500).json({ error: "Failed to fetch from PubChem API." });
    }
  }

  // 5. Slice exactly the 50 compounds needed for the current page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginatedData = cleanList.slice(startIndex, endIndex);

  return res.json({
    letter: letter.toUpperCase(),
    currentPage: page,
    totalPages: Math.ceil(cleanList.length / limit) || 1,
    totalItems: cleanList.length,
    compounds: paginatedData,
  });
}