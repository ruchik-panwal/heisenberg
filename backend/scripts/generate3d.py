import sys
import json
from rdkit import Chem
from rdkit.Chem import AllChem

def generate(smiles):
    try:
        mol = Chem.MolFromSmiles(smiles)
        if not mol:
            return json.dumps({"error": "Invalid SMILES structure"})
        
        mol = Chem.AddHs(mol)
        AllChem.EmbedMolecule(mol, randomSeed=42)
        AllChem.MMFFOptimizeMolecule(mol)
        
        conf = mol.GetConformer()
        atoms = []
        for i, atom in enumerate(mol.GetAtoms()):
            pos = conf.GetAtomPosition(i)
            atoms.append({
                "id": i,
                "element": atom.GetSymbol(),
                "position": [round(pos.x, 4), round(pos.y, 4), round(pos.z, 4)]
            })
            
        bonds = []
        for bond in mol.GetBonds():
            bonds.append({
                "source": bond.GetBeginAtomIdx(),
                "target": bond.GetEndAtomIdx(),
                "order": int(bond.GetBondTypeAsDouble())
            })
            
        return json.dumps({"atoms": atoms, "bonds": bonds})
        
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(generate(sys.argv[1]))
    else:
        print(json.dumps({"error": "No SMILES provided"}))