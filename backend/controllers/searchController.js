import { fetchAutocomplete } from "../services/pubchem.js";

export async function handleSearch(req, res) {
  const query = req.query.q?.trim();
  if (!query) {
    return res.status(400).json({ error: "Query parameter 'q' is required." });
  }

  try {
    const data = await fetchAutocomplete(query);
    const suggestions =
      data?.dictionary_terms?.compound ||
      (data?.total ? data.compound : []);

    return res.json({
      query,
      suggestions,
    });
  } catch (error) {
    console.error(`Search error for '${query}':`, error.message);
    return res.status(500).json({ error: "Failed to fetch search suggestions." });
  }
}