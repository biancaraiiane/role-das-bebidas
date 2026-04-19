type DrinkCardProps = {
  name: string;
  icon: string;
  count: number;
  bgColor: string;
  onClick: () => void;
};

export function DrinkCard({
  name,
  icon,
  count,
  bgColor,
  onClick,
}: DrinkCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${bgColor} relative flex min-h-45 flex-col items-center justify-between rounded-2xl border border-slate-200 p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md`}
    >
      <div className="text-6xl">{icon}</div>

      <h3 className="text-2xl font-semibold text-[#2b2b2b]">{name}</h3>

      <div className="rounded-full bg-[#9db7cb] px-4 py-1 text-sm font-medium text-white">
        Select
      </div>

      <div className="absolute right-3 top-3 rounded-full bg-[#9db7cb] px-2 py-1 text-xs font-semibold text-white">
        {count}
      </div>
    </button>
  );
}
