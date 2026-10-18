import axios from "axios";
import { monitorThrottling } from "../middleware/throttle.js";

const BASE_PUG_REST = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const BASE_PUG_VIEW = "https://pubchem.ncbi.nlm.nih.gov/rest/pug_view";

export async function fetchAutocomplete(query) {
  const url = `https://pubchem.ncbi.nlm.nih.gov/rest/autocomplete/compound/${encodeURIComponent(
    query
  )}/json?limit=10`;

  const res = await axios.get(url, { timeout: 4000 });
  monitorThrottling(res);
  return res.data;
}

export async function resolveCidByName(name) {
  const url = `${BASE_PUG_REST}/compound/name/${encodeURIComponent(name)}/cids/JSON`;
  const res = await axios.get(url, { timeout: 5000 });
  monitorThrottling(res);
  return res.data?.IdentifierList?.CID?.[0] || null;
}

export async function fetchCompoundProperties(cid) {
  // Upgraded with TPSA, Complexity, RotatableBonds, and HeavyAtomCount
  const url = `${BASE_PUG_REST}/compound/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName,ExactMass,CanonicalSMILES,HBondDonorCount,HBondAcceptorCount,XLogP,TPSA,Complexity,RotatableBondCount,HeavyAtomCount/JSON`;
  return axios.get(url, { timeout: 5000 });
}

export async function fetch3DConformer(cid) {
  const url = `${BASE_PUG_REST}/compound/cid/${cid}/record/JSON/?record_type=3d`;
  return axios.get(url, { timeout: 7000 });
}

export async function fetchPugView(cid) {
  const url = `${BASE_PUG_VIEW}/data/compound/${cid}/JSON/`;
  return axios.get(url, { timeout: 5000 });
}