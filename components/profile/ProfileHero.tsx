"use client";

import { BadgeCheck, Link as LinkIcon, MapPin, Sparkles } from "lucide-react";

import type { ProfileCoverTemplate } from "@/lib/profileCovers";

import AbstractCoverBanner from "./AbstractCoverBanner";
import ProfileActionButtons from "./ProfileActionButtons";
import ProfileAvatar3D from "./ProfileAvatar3D";
import ProfileStatsRow, { type ProfileStatItem } from "./ProfileStatsRow";

interface ProfileHeroUser {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  tags: string[];
  badges: string[];
  isVerified: boolean;
}

export default function ProfileHero({
  user,
  cover,
  scrollY,
  stats,
  isOwnProfile,
  isFollowing,
  onFollow,
  onMessage,
  onMore,
  onEdit,
  onEditAvatar,
  onChangeCover,
  onSelectStat,
}: {
  user: ProfileHeroUser;
  cover: ProfileCoverTemplate;
  scrollY: number;
  stats: ProfileStatItem[];
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  onEdit?: () => void;
  onEditAvatar?: () => void;
  onChangeCover?: () => void;
  onSelectStat?: (id: string) => void;
}) {
  return (
    <section className="relative">
      <AbstractCoverBanner cover={cover} scrollY={scrollY} />

      <div className="-mt-[18rem]">
        <div className="relative w-full px-4 pb-6 pt-[17.25rem]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[24rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(248,250,252,0.18)_38%,rgba(248,250,252,0.74)_72%,rgba(248,250,252,0.98)_100%)] backdrop-blur-[28px]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[42%]">
            <ProfileAvatar3D
              name={user.name}
              avatarUrl={user.avatar}
              isVerified={user.isVerified}
              editable={isOwnProfile}
              onEditAvatar={onEditAvatar}
              scrollY={scrollY}
            />
          </div>

          <div className="absolute right-4 top-4">
            <button
              onClick={onChangeCover}
              className="rounded-full bg-white/58 px-4 py-2 text-[13px] font-semibold text-[#374151] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-md transition-transform active:scale-[0.985]"
            >
              Alege cover
            </button>
          </div>

          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-[34px] font-[760] tracking-[-0.06em] text-[#0f172a]">{user.name}</h1>
              {user.isVerified ? <BadgeCheck className="h-6 w-6 fill-[#1877F2] text-white" /> : null}
            </div>
            <div className="mt-1 text-[15px] font-medium text-[#667085]">@{user.username}</div>
            <p className="mx-auto mt-4 max-w-[34rem] text-[15px] leading-7 text-[#344054]">{user.bio}</p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[13px] font-medium text-[#4b5563] shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                {user.location}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[13px] font-medium text-[#4b5563] shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <LinkIcon className="h-3.5 w-3.5" strokeWidth={2} />
                {user.website}
              </span>
              {user.badges.map((badge) => (
                <span key={badge} className="inline-flex items-center gap-1.5 rounded-full bg-[#111827] px-3 py-2 text-[12px] font-semibold text-white">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {user.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-[#eef3f8] px-3 py-1.5 text-[12px] font-semibold text-[#526071]">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <ProfileStatsRow items={stats} onSelect={onSelectStat} />
          </div>

          <div className="mt-5">
            <ProfileActionButtons
              isOwnProfile={isOwnProfile}
              isFollowing={isFollowing}
              onFollow={onFollow}
              onMessage={onMessage}
              onMore={onMore}
              onEdit={onEdit}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
