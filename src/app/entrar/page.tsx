"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PinModal } from "@/components/PinModal";
import { ProfileCard } from "@/components/ProfileCard";
import { profilePins, profiles } from "@/data/profiles";
import {
  clearProfileAuth,
  saveProfileAuth,
  saveSelectedProfile,
} from "@/lib/storage";
import { ProfileName } from "@/types";

export default function EnterPage() {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<ProfileName | null>(
    null,
  );
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedProfileData = useMemo(() => {
    return profiles.find((profile) => profile.id === selectedProfile);
  }, [selectedProfile]);

  function handleSelectProfile(profile: ProfileName) {
    clearProfileAuth();
    saveSelectedProfile(profile);
    setSelectedProfile(profile);
    setPin("");
    setError("");
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setPin("");
    setError("");
    setSelectedProfile(null);
  }

  function handleSubmitPin() {
    if (!selectedProfile) return;

    const correctPin = profilePins[selectedProfile];

    if (pin === correctPin) {
      saveProfileAuth(selectedProfile);
      setIsModalOpen(false);
      router.push("/dashboard");
      return;
    }

    setError("PIN incorreto.");
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-linear-to-r from-[#9bb6cb] to-[#c7d8cf] px-6 py-5 text-white">
          <h1 className="text-3xl font-light">Bem-vindo(a)!</h1>
        </header>

        <section className="px-6 py-12 md:px-12 md:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-wide text-[#2b2b2b] md:text-6xl">
              SELECIONE SEU PERFIL
            </h2>
            <p className="mt-3 text-lg text-slate-600 md:text-3xl">
              QUEM VAI BEBER HOJE?
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 place-items-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                name={profile.name}
                avatar={profile.avatar}
                onClick={() => handleSelectProfile(profile.id)}
              />
            ))}
          </div>
        </section>
      </div>

      <PinModal
        isOpen={isModalOpen && !!selectedProfileData}
        profileName={selectedProfileData?.name ?? ""}
        avatar={selectedProfileData?.avatar ?? ""}
        pin={pin}
        error={error}
        onPinChange={(value) => {
          setPin(value);
          setError("");
        }}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPin}
      />
    </main>
  );
}
