// app/compound/page.jsx
import Link from "next/link";
import CompoundCard from "./CompoundCard";
import NaviHub from "./navHub";

export default function CardNavig() {
  return (
    <div className="w-full flex flex-col justify-between items-center gap-10 min-h-screen bg-[#EFEFEF] p-8 rounded-4xl">
      <NaviHub />
      <Cardholder />
    </div>
  );
}

function Cardholder() {
  const compounds = [
    { id: "hydrochloric-acid", name: "Hydrochloric Acid", description: "Strong mineral acid" },
    { id: "aspirin", name: "Aspirin", description: "Acetylsalicylic acid" },
    { id: "penicillin", name: "Penicillin", description: "Beta-lactam antibiotic" },
    { id: "sodium-chloride", name: "Sodium Chloride", description: "Common table salt" },
    { id: "sulfuric-acid", name: "Sulfuric Acid", description: "Corrosive industrial acid" },
    { id: "dopamine", name: "Dopamine", description: "Neurotransmitter medication" },
    { id: "benzene", name: "Benzene", description: "Aromatic hydrocarbon" },
    { id: "ibuprofen", name: "Ibuprofen", description: "Nonsteroidal anti-inflammatory" },
    { id: "caffeine", name: "Caffeine", description: "Central nervous system stimulant" },
    { id: "paracetamol", name: "Paracetamol", description: "Mild analgesic and antipyretic" },
    { id: "ethanol", name: "Ethanol", description: "Primary alcohol in beverages" },
    { id: "glucose", name: "Glucose", description: "Simple sugar, primary energy source" },
    { id: "ammonia", name: "Ammonia", description: "Nitrogen and hydrogen compound" },
    { id: "citric-acid", name: "Citric Acid", description: "Weak organic acid in citrus" },
    { id: "methane", name: "Methane", description: "Simplest alkane hydrocarbon" },
    { id: "ascorbic-acid", name: "Ascorbic Acid", description: "Vitamin C, dietary supplement" },
  ];

  return (
    <div className="w-full flex flex-col justify-between items-center">
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-5 justify-items-center">
        {compounds.map((compound) => (
          <Link 
            key={compound.id} 
            href={`/compound/${compound.id}`}
            className="transition-transform hover:scale-105 active:scale-95"
          >
            <CompoundCard
              name={compound.name}
              description={compound.description}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}