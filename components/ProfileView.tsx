"use client";

import React, { startTransition, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  X,
} from "lucide-react";

import FeedPost, { type Post } from "./FeedPost";
import AiAnalysisModal from "./AiAnalysisModal";
import DezbatereModal from "./DezbatereModal";
import EmptyProfileState from "./profile/EmptyProfileState";
import LoadingSkeletonProfile from "./profile/LoadingSkeletonProfile";
import ProfileHero from "./profile/ProfileHero";
import ProfilePostGrid from "./profile/ProfilePostGrid";
import StickyProfileTabs from "./profile/StickyProfileTabs";

const MOCK_USER = {
  id: "u123",
  name: "Alexandru Marin",
  username: "alexmarin",
  isVerified: true,
  avatar: "https://i.pravatar.cc/300?u=alex-premium",
  coverImage: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1400&auto=format&fit=crop",
  bio: "Construiesc produse digitale, documentez idei de business și transform profilul într-un spațiu editorial cu ritm, claritate și identitate.",
  location: "București, România",
  joinDate: "Membru din sept. 2024",
  website: "alexmarin.ro",
  work: "Fondator la TechStart Studio",
  followers: "124K",
  following: "342",
  postsCount: "56",
  likesCount: "2.4M",
  tags: ["creator", "business", "travel", "minimal"],
  badges: ["Top Voice", "Verified Creator"],
};

const PROFILE_POSTS: Post[] = [
  {
    id: "p1",
    authorName: MOCK_USER.name,
    authorAvatar: MOCK_USER.avatar,
    isVerified: true,
    time: "2h",
    caption:
      "Când construiești un produs social, profilul nu este o simplă pagină de prezentare. Este spațiul în care încrederea, stilul și recurența de engagement trebuie să se vadă instant, chiar din primul scroll.",
    likes: 245,
    comments: 42,
    shares: 12,
    imageUrl: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "p2",
    authorName: MOCK_USER.name,
    authorAvatar: MOCK_USER.avatar,
    isVerified: true,
    time: "ieri",
    caption:
      "Am testat mai multe ritmuri de publicare și cel mai bun engagement a venit când feed-ul, reel-urile și profilul au avut aceeași identitate vizuală. Coerența bate zgomotul.",
    likes: 129,
    comments: 19,
    shares: 7,
  },
];

const PROFILE_REELS: Post[] = [
  {
    id: "r1",
    type: "reel",
    authorName: MOCK_USER.name,
    authorAvatar: MOCK_USER.avatar,
    isVerified: true,
    time: "3 zile",
    caption: "Un recap din culisele ultimei campanii video, gândită pentru retenție și shareability.",
    likes: 412,
    comments: 58,
    shares: 26,
    videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  },
];

const PROFILE_MEDIA = [
  {
    id: "m1",
    title: "Lisabona notes",
    subtitle: "Album editorial",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "m2",
    title: "Studio morning",
    subtitle: "Behind the scenes",
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "m3",
    title: "Campaign frames",
    subtitle: "Creator drop",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "m4",
    title: "Blue hour",
    subtitle: "City diary",
    imageUrl: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "m5",
    title: "Product table",
    subtitle: "Editorial stills",
    imageUrl: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=900&auto=format&fit=crop",
  },
];

const PROFILE_HIGHLIGHTS = [
  {
    id: "h1",
    title: "Highlights 2026",
    subtitle: "Saved moments",
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: "h2",
    title: "Brand edits",
    subtitle: "Collections",
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=900&auto=format&fit=crop",
  },
];

const PROFILE_TABS = [
  { id: "posts", label: "Posts" },
  { id: "reels", label: "Reels" },
  { id: "media", label: "Media" },
  { id: "about", label: "About" },
  { id: "saved", label: "Saved" },
];

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [isDezbatereOpen, setIsDezbatereOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [statsSheet, setStatsSheet] = useState<null | "followers" | "following" | "posts" | "likes">(null);
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(MOCK_USER.avatar);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsLoadingProfile(false);
    }, 650);

    return () => {
      window.clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const stats = [
    { id: "followers", label: "Followers", value: MOCK_USER.followers, tone: "accent" as const },
    { id: "following", label: "Following", value: MOCK_USER.following },
    { id: "posts", label: "Posts", value: MOCK_USER.postsCount },
    { id: "likes", label: "Likes", value: MOCK_USER.likesCount },
  ];

  const handleFollow = () => {
    setIsFollowing((current) => !current);
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "USER_FOLLOW", userId: MOCK_USER.id, timestamp: new Date().toISOString() }),
    }).catch(() => {});
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim()) {
      return;
    }

    setMessageStatus("Mesaj trimis.");
    setMessageDraft("");
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);
    setMessageStatus("Avatar actualizat local.");
    event.target.value = "";
  };

  if (isLoadingProfile) {
    return <LoadingSkeletonProfile />;
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#eef3f8_0%,#f5f7fb_26%,#f8fafc_100%)]">
      <ProfileHero
        user={{
          name: MOCK_USER.name,
          username: MOCK_USER.username,
          avatar: avatarUrl,
          coverImage: MOCK_USER.coverImage,
          bio: MOCK_USER.bio,
          location: MOCK_USER.location,
          website: MOCK_USER.website,
          tags: MOCK_USER.tags,
          badges: MOCK_USER.badges,
          isVerified: MOCK_USER.isVerified,
        }}
        scrollY={scrollY}
        stats={stats}
        isOwnProfile
        isFollowing={isFollowing}
        onFollow={handleFollow}
        onMessage={() => startTransition(() => setActiveTab("about"))}
        onMore={() => setIsAiOpen(true)}
        onEdit={() => setIsEditSheetOpen(true)}
        onEditAvatar={() => avatarInputRef.current?.click()}
        onSelectStat={(id) => setStatsSheet(id as "followers" | "following" | "posts" | "likes")}
      />

      <div className="px-4 pb-24 pt-4">
        <StickyProfileTabs
          tabs={PROFILE_TABS}
          activeTab={activeTab}
          onChange={(tabId) => {
            startTransition(() => {
              setActiveTab(tabId);
            });
          }}
        />

        <div className="mt-3 flex flex-col gap-3">
          {activeTab === "posts" ? (
            PROFILE_POSTS.map((post) => (
              <div key={post.id} className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <FeedPost post={{ ...post, authorAvatar: avatarUrl }} />
              </div>
            ))
          ) : null}

          {activeTab === "reels" ? (
            PROFILE_REELS.map((post) => (
              <div key={post.id} className="overflow-hidden rounded-[30px] border border-white/70 bg-white shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
                <FeedPost post={{ ...post, authorAvatar: avatarUrl }} />
              </div>
            ))
          ) : null}

          {activeTab === "media" ? (
            <ProfilePostGrid
              items={PROFILE_MEDIA}
              onSelect={(item) => {
                setActivePhoto(item.imageUrl);
              }}
            />
          ) : null}

          {activeTab === "saved" ? (
            PROFILE_HIGHLIGHTS.length > 0 ? (
              <ProfilePostGrid items={PROFILE_HIGHLIGHTS} onSelect={(item) => setActivePhoto(item.imageUrl)} />
            ) : (
              <EmptyProfileState
                title="Nimic salvat încă"
                description="Colecțiile și highlight-urile tale apar aici imediat ce începi să salvezi momente și postări."
                actionLabel="Încarcă o postare"
                onAction={() => startTransition(() => setActiveTab("posts"))}
              />
            )
          ) : null}

          {activeTab === "about" ? (
            <div className="rounded-[30px] border border-white/70 bg-white/92 p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)]">
              <div className="text-[22px] font-[720] tracking-[-0.05em] text-[#111827]">About</div>
              <div className="mt-5 space-y-4">
                <AboutRow icon={<Briefcase className="h-5 w-5" />} title="Rol" value={MOCK_USER.work} />
                <AboutRow icon={<MapPin className="h-5 w-5" />} title="Locație" value={MOCK_USER.location} />
                <AboutRow icon={<LinkIcon className="h-5 w-5" />} title="Link" value={MOCK_USER.website} accent />
                <AboutRow icon={<Calendar className="h-5 w-5" />} title="Joined" value={MOCK_USER.joinDate} />
              </div>

              <div className="mt-6 rounded-[26px] bg-[#f6f8fb] p-4">
                <div className="flex items-center gap-2 text-[16px] font-semibold text-[#111827]">
                  <MessageCircle className="h-4.5 w-4.5 text-[#1877F2]" />
                  Mesaj rapid
                </div>
                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder={`Scrie-i lui ${MOCK_USER.name}...`}
                  className="mt-3 min-h-[112px] w-full resize-none rounded-[22px] border border-[#dde5ee] bg-white px-4 py-3 text-[15px] text-[#111827] outline-none"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[13px] text-[#6b7280]">{messageStatus}</span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageDraft.trim()}
                    className="rounded-full bg-[#111827] px-5 py-2.5 text-[14px] font-semibold text-white disabled:bg-[#cbd5e1]"
                  >
                    Trimite
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarUpload}
      />

      <EditProfileSheet
        isOpen={isEditSheetOpen}
        avatarUrl={avatarUrl}
        onClose={() => setIsEditSheetOpen(false)}
        onEditAvatar={() => avatarInputRef.current?.click()}
      />

      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <ProfileStatsSheet kind={statsSheet} onClose={() => setStatsSheet(null)} />
      <ProfilePhotoViewer imageUrl={activePhoto} onClose={() => setActivePhoto(null)} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function EditProfileSheet({
  isOpen,
  avatarUrl,
  onClose,
  onEditAvatar,
}: {
  isOpen: boolean;
  avatarUrl: string;
  onClose: () => void;
  onEditAvatar: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[94] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[32px] bg-[#f8fafc] px-4 pb-8 pt-4 shadow-[0_-24px_80px_rgba(15,23,42,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d6dde8]" />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[21px] font-[720] tracking-[-0.05em] text-[#111827]">Edit profile</div>
            <div className="mt-1 text-[13px] text-[#6b7280]">Poți actualiza rapid fotografia de profil.</div>
          </div>
          <button onClick={onClose} className="rounded-full bg-white p-2 text-[#111827]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center gap-3 rounded-[26px] bg-white p-4 shadow-[0_16px_36px_rgba(15,23,42,0.07)]">
            <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
            <div className="flex-1">
              <div className="text-[15px] font-semibold text-[#111827]">Profile photo</div>
              <div className="mt-1 text-[13px] text-[#6b7280]">Poți schimba fotografia de profil prin upload local.</div>
            </div>
            <button onClick={onEditAvatar} className="rounded-full bg-[#111827] px-4 py-2 text-[13px] font-semibold text-white">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutRow({
  icon,
  title,
  value,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] bg-[#f8fafc] px-4 py-3">
      <div className="text-[#98a2b3]">{icon}</div>
      <div>
        <div className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#98a2b3]">{title}</div>
        <div className={`mt-1 text-[15px] ${accent ? "font-semibold text-[#1877F2]" : "text-[#111827]"}`}>{value}</div>
      </div>
    </div>
  );
}

function ProfileStatsSheet({
  kind,
  onClose,
}: {
  kind: null | "followers" | "following" | "posts" | "likes";
  onClose: () => void;
}) {
  if (!kind) {
    return null;
  }

  const content =
    kind === "followers"
      ? { title: "Followers", rows: ["Ana Preda", "Darius Enache", "Ioana Pavel"] }
      : kind === "following"
        ? { title: "Following", rows: ["Creator Economy România", "TechStart Labs", "Comunitatea Reels"] }
        : kind === "likes"
          ? { title: "Likes", rows: ["2.4M aprecieri totale", "72% din media", "Top 8% engagement"] }
          : { title: "Posts", rows: ["56 postări publice", "8 reel-uri", "3 drafturi programate"] };

  return (
    <div className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[32px] bg-white px-4 pb-8 pt-4 shadow-[0_-24px_80px_rgba(15,23,42,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#d6dde8]" />
        <div className="text-[21px] font-[720] tracking-[-0.05em] text-[#111827]">{content.title}</div>
        <div className="mt-4 space-y-2">
          {content.rows.map((row) => (
            <div key={row} className="rounded-[22px] bg-[#f6f8fb] px-4 py-3 text-[15px] font-semibold text-[#111827]">
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePhotoViewer({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[92] bg-black/94" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/12 p-2 text-white backdrop-blur-sm"
        aria-label="Închide fotografia"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="flex h-full w-full items-center justify-center p-4">
        <img src={imageUrl} alt="Fotografie profil" className="max-h-full max-w-full rounded-[28px] object-contain shadow-[0_24px_80px_rgba(0,0,0,0.4)]" />
      </div>
    </div>
  );
}
