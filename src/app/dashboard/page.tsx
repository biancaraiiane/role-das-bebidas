"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { drinks } from "@/data/drinks";
import {
  clearAllData,
  loadProfilesData,
  loadSelectedProfile,
  saveProfilesData,
} from "@/lib/storage";
import {
  getGroupTotal,
  getProfileTotal,
  getRanking,
  incrementDrink,
  initialProfilesData,
} from "@/lib/utils";
import { DrinkKey, ProfileName, ProfilesData } from "@/types";
import { DrinkCard } from "@/components/DrinkCard";
import { RankingItem } from "@/components/RankingItem";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedProfile] = useState<ProfileName | null>(() => {
    if (typeof window === "undefined") return null;
    return loadSelectedProfile();
  });

  const [data, setData] = useState<ProfilesData>(() => {
    if (typeof window === "undefined") return initialProfilesData();
    return loadProfilesData();
  });

  useEffect(() => {
    if (!selectedProfile) {
      router.push("/");
    }
  }, [selectedProfile, router]);

  const ranking = useMemo(() => getRanking(data), [data]);
  const groupTotal = useMemo(() => getGroupTotal(data), [data]);

  const currentProfileTotal = useMemo(() => {
    if (!selectedProfile) return 0;
    return getProfileTotal(data[selectedProfile]);
  }, [data, selectedProfile]);

  function handleAddDrink(drink: DrinkKey) {
    if (!selectedProfile) return;

    const updated = incrementDrink(data, selectedProfile, drink);
    setData(updated);
    saveProfilesData(updated);
  }

  function handleReset() {
    clearAllData();
    setData(initialProfilesData());
    router.push("/");
  }

  function handleChangeProfile() {
    router.push("/");
  }

  if (!selectedProfile) return null;

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-linear-to-r from-[#9bb6cb] to-[#c7d8cf] px-6 py-5 text-white">
          <h1 className="text-3xl font-light">Bem-vindo(a)!</h1>

          <nav className="hidden gap-8 text-sm font-medium md:flex">
            <span>SOBRE NÓS</span>
            <span>SUPORTE</span>
            <span>NOTÍCIAS</span>
            <span>CONTATO</span>
          </nav>

          <button className="text-2xl md:hidden">☰</button>
        </header>

        <section className="px-4 py-8 md:px-8 md:py-10">
          <h2 className="text-center text-3xl font-semibold text-[#2b2b2b] md:text-6xl">
            RANKING DE BEBIDAS
          </h2>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-[#e7f3ec] p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase text-[#2b2b2b] md:text-lg">
                    Contagem de ranking total geral
                  </p>
                </div>

                <div className="text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                  Total de Bebidas: {groupTotal}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {ranking.map((item, index) => (
                  <RankingItem
                    key={item.name}
                    position={index + 1}
                    name={item.name}
                    total={item.total}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#dceaf6] p-4 shadow-sm">
              <p className="text-base font-semibold uppercase text-[#2b2b2b] md:text-xl">
                Seu ranking atual: {selectedProfile}
              </p>

              <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                <div className="text-sm md:text-lg">
                  Drink: <strong>{data[selectedProfile].drink}</strong>
                </div>
                <div className="text-sm md:text-lg">
                  Cerveja: <strong>{data[selectedProfile].cerveja}</strong>
                </div>
                <div className="text-sm md:text-lg">
                  Whisky: <strong>{data[selectedProfile].whisky}</strong>
                </div>
                <div className="text-sm md:text-lg">
                  Vinho: <strong>{data[selectedProfile].vinho}</strong>
                </div>
                <div className="text-sm md:text-lg">
                  Espumante: <strong>{data[selectedProfile].espumante}</strong>
                </div>
              </div>

              <div className="mt-3 text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                Seu total: {currentProfileTotal}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold uppercase text-[#2b2b2b] md:text-3xl">
              Opções de bebidas
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {drinks.map((drink) => (
                <DrinkCard
                  key={drink.id}
                  name={drink.name}
                  icon={drink.icon}
                  bgColor={drink.bgColor}
                  count={data[selectedProfile][drink.id]}
                  onClick={() => handleAddDrink(drink.id)}
                />
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={handleChangeProfile}
              className="rounded-2xl bg-[#3f7fcb] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Trocar Perfil
            </button>

            <button
              onClick={handleReset}
              className="rounded-2xl bg-[#d75442] px-8 py-4 text-lg font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Zerar Contagem
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
