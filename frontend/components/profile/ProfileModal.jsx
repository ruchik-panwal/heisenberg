"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfileModal({ onClose }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("sketches"); // Default to new sketches tab
  const [dashboardData, setDashboardData] = useState({ bookmarks: [], searchHistory: [], customMolecules: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/user/dashboard", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Merge fetched data with defaults to prevent mapping errors
          setDashboardData({
            bookmarks: data.bookmarks || [],
            searchHistory: data.searchHistory || data.history || [],
            customMolecules: data.customMolecules || []
          });
        }
      } catch (error) {
        console.error("Failed to fetch dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Quick way to reset state and redirect
  };

  const handleOpenSketch = (smiles) => {
    onClose();
    router.push(`/sketch?load=${encodeURIComponent(smiles)}`);
  };

  const handleOpenMolecule = (cid) => {
    onClose();
    router.push(`/molecule/${cid}`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-4xl h-[75vh] min-h-[500px] bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <h2 className="text-xl font-bold text-white font-sans tracking-tight">Command Center</h2>
          <button 
            onClick={onClose}
            className="text-neutral-400 hover:text-white transition-colors text-2xl leading-none cursor-pointer h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
          >
            &times;
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-56 bg-neutral-950/30 border-r border-neutral-800 flex flex-col p-4 gap-2">
            <SidebarButton name="sketches" label="Custom Sketches" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton name="bookmarks" label="Saved Medicines" activeTab={activeTab} setActiveTab={setActiveTab} />
            <SidebarButton name="history" label="Search History" activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex-1"></div>
            <SidebarButton name="settings" label="Settings" activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="flex-1 p-8 overflow-y-auto [&::-webkit-scrollbar]:hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-neutral-500 animate-pulse space-y-3">
                <div className="h-8 w-8 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm font-mono tracking-widest uppercase">Syncing Data...</span>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300 h-full">
                
                {/* SKETCHES TAB */}
                {activeTab === "sketches" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-6">Molecular Sandbox Saves</h3>
                    {dashboardData.customMolecules.length === 0 ? (
                      <p className="text-neutral-500 text-sm">No custom molecules synthesized yet.</p>
                    ) : (
                      dashboardData.customMolecules.map((mol, idx) => (
                        <div key={idx} className="bg-black border border-neutral-800 p-5 rounded-xl flex justify-between items-center group hover:border-neutral-700 transition-colors">
                          <div>
                            <h4 className="text-white font-medium mb-1">{mol.name}</h4>
                            <p className="text-xs text-neutral-500 font-mono w-64 truncate">{mol.smiles}</p>
                          </div>
                          <button 
                            onClick={() => handleOpenSketch(mol.smiles)}
                            className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            Open in Sandbox
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* BOOKMARKS TAB */}
                {activeTab === "bookmarks" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-6">Saved Medicines</h3>
                    {dashboardData.bookmarks.length === 0 ? (
                      <p className="text-neutral-500 text-sm">No bookmarks yet. Start exploring compounds!</p>
                    ) : (
                      dashboardData.bookmarks.map((b) => (
                        <div key={b.cid} className="bg-black border border-neutral-800 p-5 rounded-xl flex justify-between items-center group hover:border-neutral-700 transition-colors">
                          <div>
                            <h4 className="text-white font-medium mb-1">{b.name || `Compound ${b.cid}`}</h4>
                            <span className="text-xs text-neutral-600 font-mono">CID: {b.cid}</span>
                            {b.note && <p className="text-neutral-400 text-sm mt-2">"{b.note}"</p>}
                          </div>
                          <button 
                            onClick={() => handleOpenMolecule(b.cid)}
                            className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer opacity-0 group-hover:opacity-100"
                          >
                            View Data
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* HISTORY TAB */}
                {activeTab === "history" && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-6">Recent Searches</h3>
                    {dashboardData.searchHistory.length === 0 ? (
                      <p className="text-neutral-500 text-sm">No recent searches.</p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {dashboardData.searchHistory.slice().reverse().map((h, i) => (
                          <div 
                            key={i} 
                            onClick={() => handleOpenMolecule(h.cid)}
                            className="px-4 py-2 bg-black text-neutral-300 text-sm rounded-lg border border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900 transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <span>{h.query}</span>
                            <span className="text-[10px] text-neutral-600 font-mono">CID:{h.cid}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* SETTINGS TAB */}
                {activeTab === "settings" && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-white mb-6">Account Settings</h3>
                    <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                      <h4 className="text-red-400 font-bold mb-2">Danger Zone</h4>
                      <p className="text-neutral-500 text-sm mb-6">Sign out of your account on this device. You will need to log back in to access your bookmarks and custom molecules.</p>
                      <button 
                        onClick={handleLogout}
                        className="bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component for cleaner sidebar buttons
function SidebarButton({ name, label, activeTab, setActiveTab }) {
  const isActive = activeTab === name;
  return (
    <button 
      onClick={() => setActiveTab(name)}
      className={`text-left px-4 py-3 rounded-xl transition-all cursor-pointer text-sm ${
        isActive 
          ? "bg-white text-black font-bold shadow-sm" 
          : "text-neutral-400 hover:bg-white/5 hover:text-white font-medium"
      }`}
    >
      {label}
    </button>
  );
}