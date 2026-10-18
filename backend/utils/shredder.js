const ELEMENT_SYMBOLS = {
  1: "H",
  6: "C",
  7: "N",
  8: "O",
  9: "F",
  15: "P",
  16: "S",
  17: "Cl",
  35: "Br",
  53: "I",
};

export function shred3DCoordinates(rawCompound) {
  if (!rawCompound) return null;

  const atomsRaw = rawCompound.atoms || {};
  const bondsRaw = rawCompound.bonds || {};
  const coordsRaw = rawCompound.coords?.[0]?.conformers?.[0] || {};

  const atomicNumbers = atomsRaw.element || [];
  const x = coordsRaw.x || [];
  const y = coordsRaw.y || [];
  const z = coordsRaw.z || [];

  const atoms = atomicNumbers.map((atomicNum, idx) => ({
    id: atomsRaw.aid?.[idx] ?? idx + 1,
    element: ELEMENT_SYMBOLS[atomicNum] || `E_${atomicNum}`,
    atomicNumber: atomicNum,
    position: [x[idx] ?? 0, y[idx] ?? 0, z[idx] ?? 0],
  }));

  const bonds = (bondsRaw.aid1 || []).map((sourceAid, idx) => ({
    source: sourceAid,
    target: bondsRaw.aid2[idx],
    order: bondsRaw.order?.[idx] ?? 1,
  }));

  return {
    atomCount: atoms.length,
    bondCount: bonds.length,
    atoms,
    bonds,
  };
}

export function extractDescription(pugViewData) {
  try {
    const sections = pugViewData?.Record?.Section || [];
    for (const sec of sections) {
      if (sec.TOCHeading === "Description") {
        const descSection = sec.Section?.[0]?.Information?.[0];
        const stringVal = descSection?.Value?.StringWithMarkup?.[0]?.String;
        if (stringVal) return stringVal;
      }
    }
  } catch {
    // Fallback on structural change
  }
  return "No description available for this compound.";
}

export function extractPugViewSection(pugViewData, targetHeading) {
  if (!pugViewData?.Record?.Section) return null;

  const searchTree = (sections) => {
    for (const sec of sections) {
      if (sec.TOCHeading === targetHeading) {
        // PubChem sometimes hides the text in 'Information' or nests it in another 'Section'
        const infoBlocks = sec.Information || sec.Section?.[0]?.Information;
        if (infoBlocks) {
          // Grab the first valid text string we find
          for (const info of infoBlocks) {
            const text = info.Value?.StringWithMarkup?.[0]?.String;
            if (text) return text;
          }
        }
      }
      // If not found here, dig deeper into children
      if (sec.Section) {
        const result = searchTree(sec.Section);
        if (result) return result;
      }
    }
    return null;
  };

  return searchTree(pugViewData.Record.Section) || "Data not available.";
}