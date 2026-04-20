"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { drinks } from "@/data/drinks";
import { RankingRow } from "@/types";
import { getGroupTotal, getProfileTotal, getRanking } from "@/lib/utils";

export default function PublicRankingPage() {
  const [rows, setRows] = useState<RankingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ranking")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const ranking = useMemo(() => getRanking(rows), [rows]);
  const totalGeral = useMemo(() => getGroupTotal(rows), [rows]);

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
                const first = ranking[0];
                const max = first ? getProfileTotal(first) : 1;
                const total = getProfileTotal(item);
                const width = max > 0 ? `${(total / max) * 100}%` : "0%";

                return (
                  <div
                    key={item.profile_name}
                    className="grid items-center gap-3 rounded-xl bg-white/70 p-3 md:grid-cols-[260px_1fr_100px]"
                  >
                    <div className="flex items-center gap-3 text-xl font-semibold text-[#2b2b2b] md:text-3xl">
                      <span>
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </span>

                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm md:h-14 md:w-14">
                        <Image
                          src={`/avatars/${item.profile_name.toLowerCase()}.jpeg`}
                          alt={item.profile_name}
                          width={56}
                          height={56}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <span>{item.profile_name.toUpperCase()}</span>
                    </div>

                    <div className="h-4 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[#9db7cb]"
                        style={{ width }}
                      />
                    </div>

                    <div className="text-right text-2xl font-semibold text-[#2b2b2b] md:text-4xl">
                      {total}
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
                const totalDrink = rows.reduce(
                  (acc, row) => acc + row[drink.id],
                  0,
                );

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
                      {loading ? "..." : totalDrink}
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
