import Image from "next/image";

type ProfileCardProps = {
  name: string;
  avatar: string;
  onClick: () => void;
};

export function ProfileCard({ name, avatar, onClick }: ProfileCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex w-full max-w-[220px] flex-col items-center rounded-2xl border border-slate-200 bg-[#eef6fb] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-4 h-28 w-28 overflow-hidden rounded-full bg-slate-200">
        <Image
          src={avatar}
          alt={name}
          width={112}
          height={112}
          className="h-full w-full object-cover"
        />
      </div>

      <h2 className="text-3xl font-semibold text-[#2b2b2b]">{name}</h2>

      <span className="mt-4 rounded-full bg-[#9db7cb] px-5 py-1 text-sm font-medium text-white">
        GO
      </span>
    </button>
  );
}
