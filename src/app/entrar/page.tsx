"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PinModal } from "@/components/PinModal";
import { ProfileCard } from "@/components/ProfileCard";
import { profiles } from "@/data/profiles";
import { ProfileName } from "@/types";

export default function EnterPage() {
  const router = useRouter();

  const [selectedProfile, setSelectedProfile] =
    useState<ProfileName | null>(null);

  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedProfileData = useMemo(() => {
    return profiles.find(
      (profile) => profile.id === selectedProfile
    );
  }, [selectedProfile]);

  function handleSelectProfile(profile: ProfileName) {
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

  async function handleSubmitPin() {
    if (!selectedProfile) return;

    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("/api/auth-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileName: selectedProfile,
          pin,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "PIN inválido.");
        return;
      }

      sessionStorage.setItem(
        "selectedProfile",
        selectedProfile
      );

      sessionStorage.setItem(
        "profileAuthorized",
        "true"
      );

      router.push("/dashboard");
    } catch {
      setError("Erro ao validar PIN.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-gradient-to-r from-[#9bb6cb] to-[#c7d8cf] px-6 py-5 text-white">
          <h1 className="text-3xl font-light">
            Bem-vindo(a)!
          </h1>
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
                onClick={() =>
                  handleSelectProfile(profile.id)
                }
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
        onPinChange={setPin}
        onClose={handleCloseModal}
        onSubmit={handleSubmitPin}
      />

      {isLoading ? (
        <div className="fixed bottom-4 right-4 rounded-xl bg-black px-4 py-2 text-white">
          Validando...
        </div>
      ) : null}
    </main>
  );
}