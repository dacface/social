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
  const scale = Math.max(0.92, 1 - scrollY * 0.00035);
  const avatarHeight = "clamp(20rem, 58vw, 28rem)";

  return (
    <div className="relative w-full">
      <button
        onClick={editable ? onEditAvatar : undefined}
        className={`group relative block w-full overflow-hidden ${editable ? "active:scale-[0.995]" : ""}`}
        aria-label={editable ? "Schimbă fotografia de profil" : `Fotografia de profil a lui ${name}`}
      >
        <div className="relative w-full overflow-hidden" style={{ transform: `scale(${scale})` }}>
          <img
            src={avatarUrl}
            alt={name}
            className="block h-full w-full object-cover object-center"
            style={{ height: avatarHeight }}
          />
        </div>

        {editable ? (
          <span className="absolute bottom-6 right-4 flex h-[56px] w-[56px] items-center justify-center rounded-full border border-white/85 bg-white/92 text-[#111827] shadow-[0_20px_46px_rgba(15,23,42,0.2)] backdrop-blur">
            <Camera className="h-[24px] w-[24px]" strokeWidth={2} />
          </span>
        ) : null}
      </button>

      {isVerified ? (
        <span className="absolute bottom-8 left-4 flex h-[58px] w-[58px] items-center justify-center rounded-full border-[7px] border-white bg-[#1877F2] shadow-[0_16px_32px_rgba(24,119,242,0.34)]">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      ) : null}
    </div>
  );
}
