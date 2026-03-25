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
  const scale = Math.max(0.82, 1 - scrollY * 0.00068);
  const avatarSize = "clamp(15.5rem, 52vw, 21rem)";

  return (
    <div className="relative">
      <button
        onClick={editable ? onEditAvatar : undefined}
        className={`group relative rounded-full transition-transform duration-300 ${editable ? "active:scale-[0.985]" : ""}`}
        aria-label={editable ? "Schimbă fotografia de profil" : `Fotografia de profil a lui ${name}`}
      >
        <div
          className="relative rounded-full p-[6px] shadow-[0_28px_90px_rgba(15,23,42,0.24)]"
          style={{
            background:
              "linear-gradient(150deg, rgba(255,255,255,0.99), rgba(244,248,255,0.94) 30%, rgba(189,215,255,0.82) 70%, rgba(240,248,255,0.98) 100%)",
            transform: `scale(${scale})`,
          }}
        >
          <div className="absolute inset-[10px] rounded-full bg-white/48 blur-md" />
          <div
            className="relative overflow-hidden rounded-full border border-white/80 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_48px_rgba(15,23,42,0.16)]"
            style={{ width: avatarSize, height: avatarSize }}
          >
            <img src={avatarUrl} alt={name} className="h-full w-full object-cover transition-transform duration-500 group-active:scale-[1.03]" />
            <div className="absolute inset-x-10 top-5 h-12 rounded-full bg-white/44 blur-xl" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_24%,rgba(255,255,255,0.38),transparent_24%),radial-gradient(circle_at_68%_76%,rgba(15,23,42,0.16),transparent_30%),linear-gradient(180deg,transparent_50%,rgba(15,23,42,0.2)_100%)]" />
          </div>
          <div className="pointer-events-none absolute inset-[14px] rounded-full border border-white/38" />
        </div>

        {editable ? (
          <span className="absolute bottom-5 right-4 flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/85 bg-white/92 text-[#111827] shadow-[0_20px_46px_rgba(15,23,42,0.2)] backdrop-blur">
            <Camera className="h-[24px] w-[24px]" strokeWidth={2} />
          </span>
        ) : null}
      </button>

      {isVerified ? (
        <span className="absolute bottom-7 left-[calc(100%-58px)] flex h-[58px] w-[58px] items-center justify-center rounded-full border-[7px] border-white bg-[#1877F2] shadow-[0_16px_32px_rgba(24,119,242,0.34)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
