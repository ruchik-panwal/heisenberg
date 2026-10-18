import { cache } from "../services/cache.js";
import {
  resolveCidByName,
  fetchCompoundProperties,
  fetch3DConformer,
  fetchPugView,
} from "../services/pubchem.js";
import { shred3DCoordinates, extractDescription, extractPugViewSection } from "../utils/shredder.js";

export async function handleGetMolecule(req, res) {
  const identifier = req.params.identifier.toLowerCase().trim();

  // 1. Cache hit check
  if (cache.has(identifier)) {
    console.log(`[Cache Hit] Serving '${identifier}' from memory`);
    return res.json({ cached: true, ...cache.get(identifier) });
  }

  console.log(`[Cache Miss] Fetching '${identifier}' from PubChem...`);

  try {
    // 2. Resolve CID
    const cid = await resolveCidByName(identifier);
    if (!cid) {
      return res.status(404).json({ error: `Molecule '${identifier}' not found.` });
    }

    // 3. Parallel external calls
    const [propRes, conformerRes, viewRes] = await Promise.allSettled([
      fetchCompoundProperties(cid),
      fetch3DConformer(cid),
      fetchPugView(cid),
    ]);

    // 4. Transform / Shred data
    let shredded3D = null;
    if (conformerRes.status === "fulfilled") {
      const rawCompound = conformerRes.value.data?.PC_Compounds?.[0];
      shredded3D = shred3DCoordinates(rawCompound);
    }

    const properties =
      propRes.status === "fulfilled"
        ? propRes.value.data?.PropertyTable?.Properties?.[0] || {}
        : {};

    // Safely extract the raw PUG-View JSON for the deep shredder
    const rawPugView = viewRes.status === "fulfilled" ? viewRes.value.data : null;

    // 5. Structure the Ultimate Payload
    const unifiedPayload = {
      basics: {
        cid,
        name: identifier.charAt(0).toUpperCase() + identifier.slice(1),
        description: extractDescription(rawPugView) || "No general description available.",
      },
      pharmacology: {
        mechanismOfAction: extractPugViewSection(rawPugView, "Mechanism of Action"),
        therapeuticUses: extractPugViewSection(rawPugView, "Therapeutic Uses"),
        toxicity: extractPugViewSection(rawPugView, "Toxicity Summary"),
      },
      safety: {
        hazards: extractPugViewSection(rawPugView, "Hazards Summary"),
      },
      properties: {
        iupacName: properties.IUPACName || "N/A",
        formula: properties.MolecularFormula || "N/A",
        molecularWeight: properties.MolecularWeight || "N/A",
        exactMass: properties.ExactMass || "N/A",
        smiles: properties.CanonicalSMILES || "N/A",
        hBondDonors: properties.HBondDonorCount ?? 0,
        hBondAcceptors: properties.HBondAcceptorCount ?? 0,
        xLogP: properties.XLogP ?? "N/A",
        tpsa: properties.TPSA ?? "N/A",
        complexity: properties.Complexity ?? "N/A",
        rotatableBonds: properties.RotatableBondCount ?? 0,
        heavyAtomCount: properties.HeavyAtomCount ?? 0,
      },
      model3d: shredded3D,
    };

    // 6. Cache and return
    cache.set(identifier, unifiedPayload);
    return res.json({ cached: false, ...unifiedPayload });
  } catch (error) {
    if (error.response?.status === 503) {
      console.warn("PubChem throttled request (HTTP 503).");
      return res.status(503).json({
        error: "PubChem servers are currently overloaded. Please try again shortly.",
      });
    }

    if (error.response?.status === 404) {
      return res.status(404).json({ error: `Molecule '${identifier}' not found.` });
    }

    console.error("Internal API error:", error.message);
    return res.status(500).json({ error: "Failed to process molecular data." });
  }
}