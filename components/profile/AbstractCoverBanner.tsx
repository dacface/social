"use client";

import type { CSSProperties } from "react";

import type { ProfileCoverTemplate } from "@/lib/profileCovers";

export default function AbstractCoverBanner({
  cover,
  scrollY = 0,
  compact = false,
  className = "",
}: {
  cover: ProfileCoverTemplate;
  scrollY?: number;
  compact?: boolean;
  className?: string;
}) {
  const tilt = Math.min(scrollY * 0.04, 10);
  const backdropStyle: CSSProperties = {
    backgroundImage: cover.fullAsset,
    transform: compact ? undefined : `translateY(${Math.min(scrollY * 0.16, 22)}px) scale(${1 + Math.min(scrollY * 0.00035, 0.04)})`,
  };

  return (
    <div
      className={`relative overflow-hidden ${compact ? "h-32 rounded-[24px]" : "h-[38svh] min-h-[320px] rounded-b-[34px]"} ${className}`}
    >
      <div className="absolute inset-0" style={backdropStyle} />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 22%, rgba(255,255,255,0.42), transparent 22%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.22), transparent 20%), linear-gradient(180deg, rgba(15,23,42,0.04) 0%, rgba(15,23,42,0.12) 54%, rgba(15,23,42,0.24) 100%)",
        }}
      />
      <div
        className="absolute inset-x-[-12%] top-[14%] h-28 rounded-full opacity-60 blur-3xl"
        style={{
          background: "linear-gradient(90deg, rgba(255,255,255,0.26), rgba(255,255,255,0.05), rgba(255,255,255,0.22))",
          transform: `translateX(${tilt}px)`,
        }}
      />
      <div className="absolute inset-x-5 bottom-4 h-20 rounded-[28px] bg-white/10 blur-2xl" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[rgba(248,250,252,0.92)] via-[rgba(248,250,252,0.18)] to-transparent" />
    </div>
  );
}
