"use client";

import { BadgeCheck, Link as LinkIcon, MapPin, Sparkles } from "lucide-react";

import { type ProfileStatItem } from "./ProfileStatsRow";

interface ProfileHeroUser {
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  bio: string;
  location: string;
  website: string;
  tags: string[];
  badges: string[];
  isVerified: boolean;
}

export default function ProfileHero({
  user,
  stats,
  isOwnProfile,
  isFollowing,
  onFollow,
  onMessage,
  onMore,
  onEdit,
  onSelectStat,
}: {
  user: ProfileHeroUser;
  stats: ProfileStatItem[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  onEdit?: () => void;
  onSelectStat?: (id: string) => void;
}) {
  return (
    <section className="relative overflow-hidden bg-[#eef2f8]">
      <div className="profile-hero relative w-full overflow-hidden">
        <img
          src={user.coverImage}
          alt={`${user.name} cover`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,12,20,0.75)_0%,rgba(10,12,20,0.4)_40%,rgba(10,12,20,0)_100%)]" />
        <div className="pointer-events-none absolute bottom-[-56px] right-[-88px] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(120,160,255,0.25)_0%,rgba(120,160,255,0.1)_40%,transparent_70%)] blur-[60px]" />
        <div className="pointer-events-none absolute bottom-[16%] right-[8%] h-2.5 w-2.5 rounded-full bg-white/70 shadow-[0_0_22px_rgba(255,255,255,0.85)]" />
        <div className="pointer-events-none absolute bottom-[13%] right-[20%] h-1.5 w-1.5 rounded-full bg-white/60 shadow-[0_0_14px_rgba(255,255,255,0.75)]" />
        <div className="pointer-events-none absolute bottom-[6%] left-0 right-0 h-28 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.35)_58%,rgba(255,255,255,0.88)_100%)] blur-[10px]" />

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="rounded-t-[24px] bg-[linear-gradient(to_top,rgba(255,255,255,0.25),rgba(255,255,255,0.05))] px-4 pb-5 pt-4 backdrop-blur-[20px]">
            <div className="flex items-center gap-2 text-white">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="min-w-0 text-[2.55rem] font-[780] leading-none tracking-[-0.06em]">{user.name}</h1>
                {user.isVerified ? <BadgeCheck className="h-7 w-7 shrink-0 fill-[#1877F2] text-white" /> : null}
              </div>
              <button
                onClick={onFollow}
                className="ml-auto shrink-0 rounded-full bg-[linear-gradient(180deg,#3b82f6_0%,#1768f2_100%)] px-4 py-2 text-[0.95rem] font-semibold text-white shadow-[0_14px_28px_rgba(23,104,242,0.28)]"
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>

            <div className="mt-2 text-[1.05rem] font-medium text-white/92">@{user.username}</div>

            <div className="mt-4 flex items-center gap-2">
              {stats.slice(0, 2).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectStat?.(item.id)}
                  className="min-w-0 rounded-full bg-white/82 px-4 py-2.5 text-[#111827] shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
                >
                  <span className="text-[1rem] font-bold tracking-[-0.04em]">{item.value}</span>
                  <span className="ml-1 text-[0.95rem] font-medium text-[#3f4757]">
                    {item.label === "Followers" ? "Urmăritori" : "Urmăriri"}
                  </span>
                </button>
              ))}
              <button
                onClick={isOwnProfile ? onEdit : onMore}
                className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-full bg-white/88 text-[#111827] shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
                aria-label="Mai multe opțiuni"
              >
                <span className="text-[1.35rem] leading-none">...</span>
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={onMessage}
                className="min-w-0 flex-1 rounded-full bg-white/86 px-5 py-3 text-[1rem] font-semibold text-[#111827] shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
              >
                Message
              </button>
              <button
                onClick={onMore}
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-white/86 text-[#111827] shadow-[0_10px_22px_rgba(15,23,42,0.08)]"
                aria-label="Mai multe opțiuni"
              >
                <span className="text-[1.35rem] leading-none">...</span>
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-[#171f34] px-3.5 py-2 text-[0.95rem] font-semibold text-white shadow-[0_10px_20px_rgba(15,23,42,0.16)]">
                  <Sparkles className="h-4 w-4" strokeWidth={2} />
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-5 max-w-[22rem] text-[1rem] leading-8 text-[#111827]">
              {user.bio}
            </div>

            <div className="mt-5 space-y-3 text-[1rem] text-[#111827]">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 shrink-0 text-[#374151]" strokeWidth={2} />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-5 w-5 shrink-0 text-[#374151]" strokeWidth={2} />
                <span>{user.website}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
