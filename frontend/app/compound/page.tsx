"use client";

import { Suspense, useState } from "react";
import CompoundResults from "@/components/compoundPage/CompoundResults";
import Header from "@/components/Header";
import ProfileModal from "@/components/profile/ProfileModal"; // Make sure path is correct

export default function SearchResultsPage() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-center items-center p-2 gap-2 h-screen w-full overflow-hidden relative">
          <Header onOpenProfile={() => setIsProfileOpen(true)} />
        
        <Suspense
          fallback={
            <div className="h-full w-full bg-black flex items-center justify-center text-white rounded-4xl mt-1">
              Loading framework...
            </div>
          }
        >
          <CompoundResults />
        </Suspense>
      </div>

      {/* Modal is completely free from overflow clipping */}
      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}
    </>
  );
}