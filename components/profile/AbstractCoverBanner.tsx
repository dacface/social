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
      className={`relative overflow-hidden ${compact ? "h-32 rounded-[24px]" : "h-[50svh] min-h-[460px]"} ${className}`}
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
      <div className="absolute inset-x-[8%] bottom-[4%] h-[120px] rounded-[52px] bg-white/10 blur-[48px]" />
      <div className="absolute inset-x-[2%] bottom-[-8%] h-[220px] rounded-[72px] bg-[#f8fafc]/58 blur-[68px]" />
      <div className="absolute inset-x-0 bottom-[-4%] h-[220px] bg-gradient-to-t from-[rgba(248,250,252,0.99)] via-[rgba(248,250,252,0.62)] via-[rgba(248,250,252,0.28)] to-transparent blur-[10px]" />
      {!compact ? (
        <div className="absolute inset-x-0 bottom-[-10%] h-[180px] bg-white/12 backdrop-blur-[42px]" />
      ) : null}
    </div>
  );
}
