import Image from "next/image";

type PinModalProps = {
  isOpen: boolean;
  profileName: string;
  avatar: string;
  pin: string;
  error: string;
  onPinChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export function PinModal({
  isOpen,
  profileName,
  avatar,
  pin,
  error,
  onPinChange,
  onClose,
  onSubmit,
}: PinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl md:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-200">
            <Image
              src={avatar}
              alt={profileName}
              width={96}
              height={96}
              className="h-full w-full object-cover"
            />
          </div>

          <h2 className="mt-4 text-3xl font-semibold text-[#2b2b2b]">
            {profileName}
          </h2>

          <p className="mt-2 text-base text-slate-600 md:text-lg">
            Digite o PIN para acessar o perfil
          </p>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-lg font-medium text-[#2b2b2b]">
            PIN
          </label>

          <input
            type="password"
            value={pin}
            onChange={(e) => onPinChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-4 text-xl outline-none focus:border-[#9bb6cb]"
            placeholder="Digite seu PIN"
          />

          {error ? (
            <p className="mt-3 text-sm font-medium text-red-500">{error}</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 px-6 py-4 text-lg font-semibold"
          >
            Cancelar
          </button>

          <button
            onClick={onSubmit}
            className="rounded-2xl bg-[#3f7fcb] px-6 py-4 text-lg font-semibold text-white"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
}
