import { RankingRow } from "@/types";

export function getProfileTotal(row: RankingRow) {
  return (
    row.drink +
    row.cerveja +
    row.whisky +
    row.vinho +
    row.espumante
  );
}

export function getGroupTotal(rows: RankingRow[]) {
  return rows.reduce((acc, row) => {
    return acc + getProfileTotal(row);
  }, 0);
}

export function getRanking(rows: RankingRow[]) {
  return [...rows].sort(
    (a, b) => getProfileTotal(b) - getProfileTotal(a)
  );
}