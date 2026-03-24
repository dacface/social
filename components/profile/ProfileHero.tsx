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

      <div className="-mt-24 px-4">
        <div className="rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.97)_0%,rgba(248,250,252,0.92)_100%)] px-4 pb-5 pt-3 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <ProfileAvatar3D
              name={user.name}
              avatarUrl={user.avatar}
              isVerified={user.isVerified}
              editable={isOwnProfile}
              onEditAvatar={onEditAvatar}
              scrollY={scrollY}
            />

            <button
              onClick={onChangeCover}
              className="mt-3 rounded-full border border-white/80 bg-white/78 px-4 py-2 text-[13px] font-semibold text-[#374151] shadow-[0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur transition-transform active:scale-[0.985]"
            >
              Alege cover
            </button>
          </div>

          <div className="mt-4">
            <div className="flex items-center gap-2">
              <h1 className="text-[34px] font-[760] tracking-[-0.06em] text-[#0f172a]">{user.name}</h1>
              {user.isVerified ? <BadgeCheck className="h-6 w-6 fill-[#1877F2] text-white" /> : null}
            </div>
            <div className="mt-1 text-[15px] font-medium text-[#667085]">@{user.username}</div>
            <p className="mt-4 text-[15px] leading-7 text-[#344054]">{user.bio}</p>

            <div className="mt-4 flex flex-wrap gap-2">
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

            <div className="mt-4 flex flex-wrap gap-2">
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
