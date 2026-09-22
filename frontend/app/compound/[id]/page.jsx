import React from 'react';
import Viewer from '@/components/compoundViewer/Viewer'; 

export default function CompoundViewerPage() {
  // Hardcoded values as requested, matching the reference image layout
  const compound = {
    name: 'Dimethyl Tetradioxide',
    formula: 'C2H6O4',
    weight: '126.07 g/mol',
    density: '1.42 g/cm³',
    meltingPoint: '45 °C',
    boilingPoint: '132 °C',
    modelUrl: '/glucose_molecule.glb', // Still using your available model
    description: 'This is a detailed placeholder description for Dimethyl Tetradioxide. It demonstrates how the bottom-left bento box will look when populated with structural and chemical data.',
    hazards: 'Highly reactive. Handle with extreme caution in controlled laboratory environments.',
    solubility: 'Reacts violently with water.',
    type: 'Peroxide'
  };

  return (
    // FULL WINDOW WRAPPER: h-screen, p-3, font_vend, tracking-[-5%]
    <main className="w-screen h-screen bg-white p-3 font-vend tracking-[-5%] flex flex-col overflow-hidden">
      
      {/* 
        Main Grid Layout 
        min-h-0 is required here so flex children don't overflow the h-screen constraint 
      */}
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-12 gap-3 min-h-0">
        
        {/* LEFT COLUMN */}
        <div className="col-span-1 md:col-span-7 flex flex-col gap-3 h-full min-h-0">
          
          {/* 1. 3D Viewer Box (Takes up majority of the left column height) */}
          <div className="flex-[5_5_0%] bg-[#222222] rounded-[32px] overflow-hidden relative">
            <Viewer 
              url={compound.modelUrl}
              autoFrame={true}
              fadeIn={true}
              enableMouseParallax={true}
              environmentPreset={null} 
              defaultZoom={0.85} 
            />
          </div>

          {/* 2. Title Box (Fixed height, perfectly matches the image) */}
          <div className="h-[75px] shrink-0 bg-[#e5e5e5] rounded-[24px] px-8 flex items-center justify-between">
            <h1 className="text-3xl font-medium text-black">{compound.name}</h1>
          </div>

          {/* 3. Description Box (Takes up remaining space) */}
          <div className="flex-[3_3_0%] bg-[#e5e5e5] rounded-[32px] p-8 flex flex-col overflow-y-auto">
             <p className="text-gray-800 text-lg leading-relaxed">{compound.description}</p>
          </div>
        </div>


        {/* RIGHT COLUMN */}
        <div className="col-span-1 md:col-span-5 flex flex-col gap-3 h-full min-h-0">
          
          {/* 4. Chemical Properties */}
          <div className="flex-[4_4_0%] bg-[#e5e5e5] rounded-[32px] p-8 flex flex-col gap-3 overflow-y-auto">
            <h2 className="text-xl font-medium text-black mb-2">Chemical Property</h2>
            
            <PropertyRow label="Molecular Weight" value={compound.weight} />
            <PropertyRow label="Density" value={compound.density} />
            <PropertyRow label="Melting Point" value={compound.meltingPoint} />
            <PropertyRow label="Boiling Point" value={compound.boilingPoint} />
          </div>

          {/* 5. Small Middle Box */}
          <div className="h-[90px] shrink-0 bg-[#e5e5e5] rounded-[24px] px-8 flex items-center">
             <span className="text-gray-600 font-medium text-lg">Class: {compound.type}</span>
          </div>

          {/* 6. Bottom Right Box (Safety/Handling) */}
          <div className="flex-[5_5_0%] bg-[#e5e5e5] rounded-[32px] p-8 flex flex-col overflow-y-auto">
             <h2 className="text-xl font-medium text-black mb-4">Safety Data</h2>
             <p className="text-gray-800 text-lg">{compound.hazards}</p>
             <p className="text-gray-800 text-lg mt-3">{compound.solubility}</p>
          </div>

        </div>

      </div>
    </main>
  );
}

// Helper component for properties
function PropertyRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-300/60 last:border-0 last:pb-0">
      <span className="text-gray-600 font-medium w-1/2 pr-4">{label}</span>
      <span className="text-gray-900 font-medium w-1/2 text-right">{value}</span>
    </div>
  );
}