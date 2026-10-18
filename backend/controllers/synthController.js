import { spawn } from "child_process";

export const handleGenerate3D = (req, res) => {
  const { smiles } = req.body;

  if (!smiles) {
    return res.status(400).json({ error: "SMILES string is required." });
  }

  // Point directly to the virtual environment's python executable
  const pythonPath = "scripts/myven/bin/python";
  const scriptPath = "scripts/generate3d.py";

  const pythonProcess = spawn(pythonPath, [scriptPath, smiles]);
  
  let outputData = "";
  let errorData = "";

  pythonProcess.stdout.on("data", (data) => {
    outputData += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorData += data.toString();
    console.error(`Python stderr: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      return res.status(500).json({ 
        error: "Python script crashed.", 
        details: errorData 
      });
    }

    try {
      const parsedData = JSON.parse(outputData);
      
      if (parsedData.error) {
        return res.status(400).json(parsedData);
      }
      
      res.json({ model3d: parsedData });
    } catch (error) {
      console.error("JSON Parse Error. Output was:", outputData);
      res.status(500).json({ 
        error: "Failed to parse 3D coordinates from Python.",
        details: outputData
      });
    }
  });
};