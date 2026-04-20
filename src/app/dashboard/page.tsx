"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { drinks } from "@/data/drinks";
import { DrinkKey, ProfileName, RankingRow } from "@/types";
import { getGroupTotal, getProfileTotal, getRanking } from "@/lib/utils";
import { DrinkCard } from "@/components/DrinkCard";
import { RankingItem } from "@/components/RankingItem";

export default function DashboardPage() {
  const router = useRouter();

  const [selectedProfile] = useState<ProfileName | null>(() => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("selectedProfile") as ProfileName | null;
  });

  const [isAuthorized] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("profileAuthorized") === "true";
  });

  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingDrink, setSavingDrink] = useState(false);

  useEffect(() => {
    if (!selectedProfile || !isAuthorized) {
      router.push("/entrar");
      return;
    }

    fetch("/api/ranking")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedProfile, isAuthorized, router]);

  const ranking = useMemo(() => getRanking(rows), [rows]);
  const groupTotal = useMemo(() => getGroupTotal(rows), [rows]);

  const currentRow = useMemo(() => {
    return rows.find((row) => row.profile_name === selectedProfile) ?? null;
  }, [rows, selectedProfile]);

  const currentProfileTotal = useMemo(() => {
    return currentRow ? getProfileTotal(currentRow) : 0;
  }, [currentRow]);

  async function reloadRanking() {
    const rankingResponse = await fetch("/api/ranking");
    const rankingData = await rankingResponse.json();
    setRows(Array.isArray(rankingData) ? rankingData : []);
  }

  async function handleAddDrink(drink: DrinkKey) {
    if (!selectedProfile || savingDrink) return;

    try {
      setSavingDrink(true);

      const response = await fetch("/api/add-drink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileName: selectedProfile,
          drinkType: drink,
        }),
      });

      if (!response.ok) {
        return;
      }

      await reloadRanking();
    } finally {
      setSavingDrink(false);
    }
  }

  function handleChangeProfile() {
    sessionStorage.removeItem("selectedProfile");
    sessionStorage.removeItem("profileAuthorized");
    router.push("/entrar");
  }

  if (loading || !selectedProfile) return null;

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-gradient-to-r from-[#9bb6cb] to-[#c7d8cf] px-6 py-5 text-white">
          <h1 className="text-3xl font-light">Rolê das Bebidas</h1>

          <button
            onClick={handleChangeProfile}
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Trocar perfil
          </button>
        </header>

        <section className="px-4 py-8 md:px-8 md:py-10">
          <h2 className="text-center text-3xl font-semibold text-[#2b2b2b] md:text-6xl">
            RANKING DE BEBIDAS
          </h2>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl bg-[#e7f3ec] p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm font-semibold uppercase text-[#2b2b2b] md:text-lg">
                  Contagem de ranking total geral
                </p>

                <div className="text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                  Total de Bebidas: {groupTotal}
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                {ranking.map((item, index) => (
                  <RankingItem
                    key={item.profile_name}
                    position={index + 1}
                    name={item.profile_name}
                    total={getProfileTotal(item)}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#dceaf6] p-4 shadow-sm">
              <p className="text-base font-semibold uppercase text-[#2b2b2b] md:text-xl">
                Seu perfil: {selectedProfile}
              </p>

              {currentRow ? (
                <>
                  <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-5">
                    <div className="text-sm md:text-lg">
                      Drink: <strong>{currentRow.drink}</strong>
                    </div>
                    <div className="text-sm md:text-lg">
                      Cerveja: <strong>{currentRow.cerveja}</strong>
                    </div>
                    <div className="text-sm md:text-lg">
                      Whisky: <strong>{currentRow.whisky}</strong>
                    </div>
                    <div className="text-sm md:text-lg">
                      Vinho: <strong>{currentRow.vinho}</strong>
                    </div>
                    <div className="text-sm md:text-lg">
                      Espumante: <strong>{currentRow.espumante}</strong>
                    </div>
                  </div>

                  <div className="mt-3 text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                    Seu total: {currentProfileTotal}
                  </div>
                </>
              ) : null}
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
                  count={currentRow ? currentRow[drink.id] : 0}
                  onClick={() => handleAddDrink(drink.id)}
                />
              ))}
            </div>
          </div>

          {savingDrink ? (
            <div className="mt-6 text-sm font-medium text-slate-600">
              Salvando bebida...
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}