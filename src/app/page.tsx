"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useSyncExternalStore } from "react";
import { drinks } from "@/data/drinks";
import { getGroupTotal, getRanking, initialProfilesData } from "@/lib/utils";
import { ProfilesData } from "@/types";

const STORAGE_KEY = "ranking-bebidas-data";
const serverSnapshot: ProfilesData = initialProfilesData();

let cachedRaw = "";
let cachedSnapshot: ProfilesData = serverSnapshot;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): ProfilesData {
  if (typeof window === "undefined") return serverSnapshot;

  const raw = localStorage.getItem(STORAGE_KEY) ?? "";

  if (raw === cachedRaw) {
    return cachedSnapshot;
  }

  cachedRaw = raw;

  if (!raw) {
    cachedSnapshot = initialProfilesData();
    return cachedSnapshot;
  }

  try {
    cachedSnapshot = JSON.parse(raw) as ProfilesData;
    return cachedSnapshot;
  } catch {
    cachedSnapshot = initialProfilesData();
    return cachedSnapshot;
  }
}

function getServerSnapshot(): ProfilesData {
  return serverSnapshot;
}

export default function PublicRankingPage() {
  const data = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const ranking = useMemo(() => getRanking(data), [data]);
  const totalGeral = useMemo(() => getGroupTotal(data), [data]);

  return (
    <main className="min-h-screen bg-[#f7f8f5] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
        <header className="flex items-center justify-between bg-linear-to-r from-[#9bb6cb] to-[#c7d8cf] px-6 py-5 text-white">
          <h1 className="text-lg font-medium md:text-4xl">
            PÁGINA PÚBLICA DO RANKING DE BEBIDAS
          </h1>

          <Link
            href="/entrar"
            className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/30"
          >
            Área dos Perfis
          </Link>
        </header>

        <section className="px-4 py-8 md:px-8 md:py-10">
          <h2 className="text-center text-2xl font-semibold text-[#2b2b2b] md:text-5xl">
            RANKING TOTAL GERAL
          </h2>

          <div className="mt-8 rounded-2xl bg-[#e7f3ec] p-4 shadow-sm md:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <p className="text-sm font-semibold uppercase text-[#2b2b2b] md:text-lg">
                Contagem de ranking total geral
              </p>

              <p className="text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                Total de Bebidas: {totalGeral}
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {ranking.map((item, index) => {
                const max = ranking[0]?.total || 1;
                const width = max > 0 ? `${(item.total / max) * 100}%` : "0%";

                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-xl bg-white/70 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-semibold text-[#2b2b2b] md:text-3xl">
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>

                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm md:h-14 md:w-14">
                        <Image
                          src={`/avatars/${item.name.toLowerCase()}.jpeg`}
                          alt={item.name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <span className="text-lg font-semibold text-[#2b2b2b] md:text-3xl">
                        {item.name.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden h-4 w-40 overflow-hidden rounded-full bg-white md:block">
                        <div
                          className="h-full rounded-full bg-[#9db7cb]"
                          style={{ width }}
                        />
                      </div>

                      <div className="text-lg font-semibold text-[#2b2b2b] md:text-2xl">
                        {item.total}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold uppercase text-[#2b2b2b] md:text-3xl">
              Total por categoria de bebida
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
              {drinks.map((drink) => {
                const totalDrink =
                  data.Bianca[drink.id] +
                  data.Samira[drink.id] +
                  data.Luciana[drink.id];

                return (
                  <div
                    key={drink.id}
                    className={`${drink.bgColor} rounded-2xl border border-slate-200 p-4 text-center shadow-sm`}
                  >
                    <div className="text-5xl md:text-6xl">{drink.icon}</div>

                    <h4 className="mt-3 text-xl font-semibold text-[#2b2b2b] md:text-2xl">
                      {drink.name}
                    </h4>

                    <p className="mt-2 text-lg font-medium text-[#2b2b2b] md:text-3xl">
                      {totalDrink}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
