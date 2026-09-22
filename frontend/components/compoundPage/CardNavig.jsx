// app/compound/page.jsx
import CompoundCard from "./CompoundCard";
import NaviHub from "./navHub";

export default function CardNavig() {
  return (
    <div className="w-full flex flex-col justify-between items-center gap-10 min-h-screen bg-[#EFEFEF] p-8  rounded-4xl">
      <NaviHub />
      <Cardholder />
    </div>
  );
}

function Cardholder() {
  const compounds = [
    { name: "Hydrochloric Acid", description: "Strong mineral acid" },
    { name: "Aspirin", description: "Acetylsalicylic acid" },
    { name: "Penicillin", description: "Beta-lactam antibiotic" },
    { name: "Sodium Chloride", description: "Common table salt" },
    { name: "Sulfuric Acid", description: "Corrosive industrial acid" },
    { name: "Dopamine", description: "Neurotransmitter medication" },
    { name: "Benzene", description: "Aromatic hydrocarbon" },
    { name: "Ibuprofen", description: "Nonsteroidal anti-inflammatory" },
    { name: "Caffeine", description: "Central nervous system stimulant" },
    { name: "Paracetamol", description: "Mild analgesic and antipyretic" },
    { name: "Ethanol", description: "Primary alcohol in beverages" },
    { name: "Glucose", description: "Simple sugar, primary energy source" },
    { name: "Ammonia", description: "Nitrogen and hydrogen compound" },
    { name: "Citric Acid", description: "Weak organic acid in citrus" },
    { name: "Methane", description: "Simplest alkane hydrocarbon" },
    { name: "Ascorbic Acid", description: "Vitamin C, dietary supplement" },
  ];

  return (
    <div className="w-full flex flex-col justify-between items-center">
      {/* 
        Replaced flex flex-wrap with a responsive grid.
        xl:grid-cols-7 perfectly matches the 7-column layout from your design image.
      */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5 justify-items-center">
        {compounds.map((compound, index) => (
          <CompoundCard
            key={index}
            name={compound.name}
            description={compound.description}
          />
        ))}
      </div>
    </div>
  );
}
