"use client";

import { Camera } from "lucide-react";

export default function ProfileAvatar3D({
  name,
  avatarUrl,
  isVerified,
  scrollY = 0,
  editable = false,
  onEditAvatar,
}: {
  name: string;
  avatarUrl: string;
  isVerified?: boolean;
  scrollY?: number;
  editable?: boolean;
  onEditAvatar?: () => void;
}) {
  const scale = Math.max(0.88, 1 - scrollY * 0.00075);

  return (
    <div className="relative">
      <button
        onClick={editable ? onEditAvatar : undefined}
        className={`group relative rounded-full transition-transform duration-300 ${editable ? "active:scale-[0.985]" : ""}`}
        aria-label={editable ? "Schimbă fotografia de profil" : `Fotografia de profil a lui ${name}`}
      >
        <div
          className="relative rounded-full p-[3px] shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
          style={{
            background:
              "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(238,244,252,0.84) 42%, rgba(177,206,255,0.72) 100%)",
            transform: `scale(${scale})`,
          }}
        >
          <div className="absolute inset-[6px] rounded-full bg-white/40 blur-md" />
          <div className="relative h-40 w-40 overflow-hidden rounded-full border border-white/70 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-active:scale-[1.03]" />
            <div className="absolute inset-x-6 top-3 h-8 rounded-full bg-white/35 blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_26%,rgba(255,255,255,0.28),transparent_26%),linear-gradient(180deg,transparent_58%,rgba(15,23,42,0.14)_100%)]" />
          </div>
        </div>

        {editable ? (
          <span className="absolute bottom-3 right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/88 text-[#111827] shadow-[0_12px_32px_rgba(15,23,42,0.18)] backdrop-blur">
            <Camera className="h-5 w-5" strokeWidth={2} />
          </span>
        ) : null}
      </button>

      {isVerified ? (
        <span className="absolute bottom-5 left-[calc(100%-44px)] flex h-11 w-11 items-center justify-center rounded-full border-[5px] border-white bg-[#1877F2] shadow-[0_10px_24px_rgba(24,119,242,0.32)]">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
