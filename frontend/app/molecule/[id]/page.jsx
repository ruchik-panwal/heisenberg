"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProfileModal from "@/components/profile/ProfileModal"; 
import Dashboard from "@/components/moleculePage/dashboard";

export default function MoleculePage({ params }) {
  const unwrappedParams = use(params);
  const identifier = unwrappedParams.id;
  const router = useRouter();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (!identifier) return;

    const fetchMolecule = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/molecule/${identifier}`);
        
        if (!res.ok) {
          if (res.status === 404) throw new Error("Compound not found in database.");
          throw new Error("Failed to load molecular data.");
        }
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMolecule();
  }, [identifier]);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 gap-2 h-screen w-full overflow-hidden relative">
        
        {/* Your standard Header */}
        <Header onOpenProfile={() => setIsProfileOpen(true)} />
        
        {/* The Dashboard Container taking the remaining height */}
        <div className="flex-1 w-full relative overflow-hidden rounded-4xl">
          {loading ? (
            <div className="h-full w-full flex items-center justify-center bg-[#0a0a0a]">
              <span className="animate-pulse text-white/50 text-xl tracking-widest font-sans">
                Synthesizing molecule...
              </span>
            </div>
          ) : error ? (
            <div className="h-full w-full flex flex-col items-center justify-center bg-[#0a0a0a] text-white font-sans">
              <p className="text-red-400 mb-6">{error}</p>
              <button 
                onClick={() => router.back()} 
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              >
                Go Back
              </button>
            </div>
          ) : (
            <Dashboard data={data} />
          )}
        </div>

      </div>

      {/* Modal is completely free from overflow clipping */}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}