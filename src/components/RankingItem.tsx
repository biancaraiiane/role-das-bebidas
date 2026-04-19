type RankingItemProps = {
  position: number;
  name: string;
  total: number;
};

export function RankingItem({
  position,
  name,
  total,
}: RankingItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white/70 px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-2xl">
          {position === 1 ? "🥇" : position === 2 ? "🥈" : "🥉"}
        </span>

        <span className="text-xl font-semibold text-[#2b2b2b]">
          {name}
        </span>
      </div>

      <span className="text-lg font-semibold text-[#2b2b2b]">
        {total} bebidas
      </span>
    </div>
  );
}