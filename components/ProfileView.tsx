"use client";

import Image from "next/image";
import React, { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Camera,
  Check,
  ChevronLeft,
  Globe,
  Grid2x2,
  Image as ImageIcon,
  MapPin,
  MoreHorizontal,
  PlayCircle,
  Radio,
  Sparkles,
  Tags,
  UserPlus,
  X,
} from "lucide-react";
import FeedPost, { Post } from "./FeedPost";
import DezbatereModal from "./DezbatereModal";
import AiAnalysisModal from "./AiAnalysisModal";

const PROFILE = {
  id: "u123",
  name: "Alexandru Marin",
  username: "@alexmarin",
  isVerified: true,
  avatar: "https://i.pravatar.cc/300?u=alex",
  coverImage:
    "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1400&auto=format&fit=crop",
  headline: "Creator, antreprenor si strategist digital",
  bio: "Construiesc produse digitale, documentez idei de business si transform profilul intr-un spatiu editorial cu ritm, claritate si identitate.",
  location: "Bucuresti, Romania",
  work: "Fondator la TechStart",
  birthDate: "12 mai 1998",
  joinDate: "Membru din sept. 2024",
  website: "alexmarin.ro",
  followers: "124K",
  following: "342",
  postsCount: "56",
  likes: "2.4M",
  badges: ["Top Voice", "Verified Creator"],
  mutualFriends: [
    {
      id: "m1",
      name: "Andreea Pop",
      avatar: "https://i.pravatar.cc/160?u=andreea",
    },
    {
      id: "m2",
      name: "Mihai Ionescu",
      avatar: "https://i.pravatar.cc/160?u=mihai",
    },
    {
      id: "m3",
      name: "Elena Tudor",
      avatar: "https://i.pravatar.cc/160?u=elena",
    },
  ],
  skills: ["Product strategy", "Social UX", "Creator tools", "Mobile storytelling", "Growth loops", "AI workflows"],
  highlights: [
    {
      id: "h1",
      title: "Profil",
      subtitle: "Fotografii de profil",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "h2",
      title: "Vacante",
      subtitle: "Amintiri magice",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "h3",
      title: "Momente",
      subtitle: "Momentele mele",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=500&auto=format&fit=crop",
    },
    {
      id: "h4",
      title: "Timeline",
      subtitle: "Cronologia mea",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop",
    },
  ],
  photos: [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop",
  ],
  posts: [
    {
      id: "p1",
      authorName: "Alexandru Marin",
      authorAvatar: "https://i.pravatar.cc/150?u=alex",
      isVerified: true,
      time: "2h",
      caption:
        "Inteligența artificială nu va înlocui oamenii, ci oamenii care folosesc inteligența artificială îi vor înlocui pe cei care nu o folosesc. Trebuie să ne adaptăm rapid.",
      hasMoreText: false,
      likes: 245,
      likesText: "245",
      comments: 42,
      shares: 12,
      imageUrl:
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "p2",
      authorName: "Alexandru Marin",
      authorAvatar: "https://i.pravatar.cc/150?u=alex",
      isVerified: true,
      time: "1 zi",
      caption: "Am participat ieri la un eveniment excelent despre viitorul e-commerce-ului.",
      hasMoreText: true,
      likes: 89,
      likesText: "89",
      comments: 14,
      shares: 3,
    },
  ] as Post[],
  videos: [
    {
      id: "v1",
      title: "Studio breakdown",
      subtitle: "3.1K views",
      poster: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=900&auto=format&fit=crop",
    },
    {
      id: "v2",
      title: "Product notes",
      subtitle: "1.8K views",
      poster: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=900&auto=format&fit=crop",
    },
  ],
};

type TabId = "postari" | "media" | "despre";

export default function ProfileView() {
  const defaultPostId = PROFILE.posts[0]?.id ?? PROFILE.id;
  const profileMetricsLabel = `${PROFILE.followers} urmăritori · ${PROFILE.following} urmăriri · ${PROFILE.postsCount} postări`;
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("postari");
  const deferredTab = useDeferredValue(activeTab);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isDezbatereOpen, setIsDezbatereOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState(PROFILE.avatar);
  const [avatarObjectUrl, setAvatarObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 220);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (avatarObjectUrl) {
        URL.revokeObjectURL(avatarObjectUrl);
      }
    };
  }, [avatarObjectUrl]);

  const handleFollow = () => {
    setIsFollowed((current) => !current);
  };

  const handleSendMessage = () => {
    if (!messageDraft.trim()) {
      return;
    }

    setMessageStatus("Mesaj trimis.");
    setMessageDraft("");
  };

  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (avatarObjectUrl) {
      URL.revokeObjectURL(avatarObjectUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setAvatarObjectUrl(nextUrl);
    setAvatarSrc(nextUrl);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[linear-gradient(180deg,#f4f7fb_0%,#eef3f8_36%,#edf2f7_100%)] text-[#0f172a]">
      <div
        className={`fixed left-0 right-0 top-0 z-30 transition-all duration-300 ${showStickyHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}`}
      >
        <div className="mx-auto flex max-w-[600px] items-center gap-3 border-b border-white/70 bg-white/88 px-4 py-3 backdrop-blur-xl">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-[#dbe4f0]">
            <Image src={avatarSrc} alt={PROFILE.name} fill sizes="44px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-[16px] font-[760] tracking-[-0.03em]" style={{ color: "#0f172a" }}>
              {PROFILE.name}
            </div>
            <div className="truncate text-[13px] font-[600] tracking-[-0.01em] text-[#65676b]">{profileMetricsLabel}</div>
          </div>
          <button
            onClick={handleFollow}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-[760] transition-transform active:scale-[0.98] ${
              isFollowed ? "bg-[#e9eef5] text-[#0f172a]" : "bg-[linear-gradient(135deg,#2f7dff_0%,#1858f2_100%)] text-white shadow-[0_12px_24px_rgba(37,99,235,0.22)]"
            }`}
          >
            {isFollowed ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <UserPlus className="h-4 w-4" strokeWidth={2.4} />}
            {isFollowed ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      <section className="relative">
        <div className="relative aspect-[0.88/1] w-full overflow-hidden bg-[#d9c6c0]">
          <Image
            src={avatarSrc}
            alt={PROFILE.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 600px"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.10)_0%,rgba(15,23,42,0.04)_30%,rgba(15,23,42,0.12)_74%,rgba(15,23,42,0.18)_100%)]" />
          <button className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-md transition-transform active:scale-[0.96]">
            <ArrowLeft className="h-6 w-6" strokeWidth={2.4} />
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            aria-label="Schimbă poza de profil"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/18 text-white backdrop-blur-md transition-transform active:scale-[0.98]"
          >
            <Camera className="h-4 w-4" strokeWidth={2.1} />
          </button>
        </div>

        <div className="relative -mt-8 px-0 pb-3">
          <div className="overflow-hidden rounded-t-[34px] rounded-b-none bg-[linear-gradient(180deg,#ffffff_0%,#f6f8ff_100%)] px-5 pb-6 pt-4 shadow-[0_-8px_26px_rgba(15,23,42,0.03),0_22px_44px_rgba(15,23,42,0.10)] sm:rounded-[34px] sm:px-6">
            <div className="rounded-[30px] bg-[linear-gradient(135deg,rgba(255,255,255,0.96)_0%,rgba(243,247,255,0.98)_52%,rgba(237,242,255,0.92)_100%)] px-5 py-5 shadow-[0_20px_40px_rgba(15,23,42,0.08)] ring-1 ring-white/90">
              <div className="flex items-start gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <h1
                        className="truncate font-[790]"
                        style={{
                          fontSize: "clamp(22px, 5.7vw, 32px)",
                          lineHeight: 1.02,
                          letterSpacing: "-0.05em",
                          color: "#111111",
                        }}
                      >
                        {PROFILE.name}
                      </h1>
                      {PROFILE.isVerified ? <VerifiedBadge /> : null}
                    </div>
                    <button
                      onClick={handleFollow}
                      className={`inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2 text-[14px] font-[760] text-white transition-transform active:scale-[0.98] ${
                        isFollowed
                          ? "bg-[linear-gradient(135deg,#8ea5c7_0%,#64748b_100%)]"
                          : "bg-[linear-gradient(135deg,#4c86ff_0%,#1f5eff_100%)] shadow-[0_18px_34px_rgba(37,99,235,0.28)]"
                      }`}
                    >
                      {isFollowed ? <Check className="h-4 w-4" strokeWidth={2.4} /> : <UserPlus className="h-4 w-4" strokeWidth={2.4} />}
                      {isFollowed ? "Following" : "Follow"}
                    </button>
                  </div>
                  <div className="mt-2 whitespace-nowrap text-[12px] font-[600] tracking-[-0.015em] text-[#65676b] sm:text-[13px]">
                    {profileMetricsLabel}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              <QuickCard icon={<ImageIcon className="h-6 w-6 text-[#ff5d7a]" strokeWidth={2.2} />} label="Photos" glow="rgba(255,93,122,0.18)" />
              <QuickCard icon={<PlayCircle className="h-6 w-6 text-[#2f7dff]" strokeWidth={2.2} />} label="Videos" glow="rgba(47,125,255,0.18)" />
              <QuickCard icon={<Radio className="h-6 w-6 text-[#6d5efc]" strokeWidth={2.2} />} label="Stories" glow="rgba(109,94,252,0.18)" />
              <QuickCard icon={<Tags className="h-6 w-6 text-[#f59e0b]" strokeWidth={2.2} />} label="Tags" glow="rgba(245,158,11,0.18)" />
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[18px] bg-[#f3f6fa] px-4 py-3 text-[14px] font-[620] text-[#334155]">
              <Globe className="h-4 w-4 text-[#7c8aa5]" strokeWidth={2.1} />
              <span className="truncate">{PROFILE.website}</span>
              <ChevronLeft className="ml-auto h-4 w-4 rotate-180 text-[#7c8aa5]" strokeWidth={2.2} />
            </div>

            <p className="mt-4 text-[15px] leading-[1.68] text-[#4b5563]">
              {PROFILE.headline}. {PROFILE.bio}
            </p>

            <button
              onClick={() => startTransition(() => setActiveTab("despre"))}
              className="mt-4 flex w-full items-center gap-3 rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_100%)] px-4 py-4 text-left text-white shadow-[0_20px_36px_rgba(15,23,42,0.18)] transition-transform active:scale-[0.99]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/14 backdrop-blur-sm">
                <Radio className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-[800] uppercase tracking-[0.16em] text-white/64">Start a conversation</div>
                <div className="mt-1 text-[16px] font-[760] tracking-[-0.03em] text-white">Trimite un mesaj premium</div>
                <div className="mt-1 text-[13px] font-[600] text-white/72">Deschide direct zona de contact și scrie un mesaj clar.</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1d4ed8] shadow-[0_10px_20px_rgba(255,255,255,0.2)]">
                <ChevronLeft className="h-5 w-5 rotate-180" strokeWidth={2.4} />
              </div>
            </button>

            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[14px] font-[580] text-[#64748b]">
              <MetaItem icon={<MapPin className="h-4 w-4" />} text={PROFILE.location} />
              <MetaItem icon={<Briefcase className="h-4 w-4" />} text={PROFILE.work} />
              <MetaItem icon={<Calendar className="h-4 w-4" />} text={`Data nasterii: ${PROFILE.birthDate}`} />
              <MetaItem icon={<Calendar className="h-4 w-4" />} text={PROFILE.joinDate} />
            </div>
          </div>
        </div>
      </section>

      <div className="px-0">
        <section className="mb-3 overflow-hidden rounded-none bg-white px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-white sm:rounded-[30px]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-[12px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">Prieteni comuni</div>
                <button className="shrink-0 rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[760] text-[#334155]">Vezi toți</button>
              </div>
              <div
                className="mt-1 whitespace-nowrap font-[780] tracking-[-0.045em] text-[#0f172a]"
                style={{ fontSize: "clamp(15px, 4.5vw, 21px)" }}
              >
                Cunoștințe care vă conectează
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-[28px] bg-[linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] p-4 shadow-[0_12px_30px_rgba(37,99,235,0.08)]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                {PROFILE.mutualFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-[#dbe4f0] shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
                  >
                    <Image src={friend.avatar} alt={friend.name} fill sizes="48px" className="object-cover" />
                  </div>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-[760] tracking-[-0.025em] text-[#0f172a]">Aveți 3 prieteni comuni</div>
                <div className="mt-1 text-[13px] font-[600] text-[#64748b]">
                  {PROFILE.mutualFriends.map((friend) => friend.name).join(", ")}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-3 overflow-hidden rounded-none bg-white px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-white sm:rounded-[30px]">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <div className="truncate text-[12px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">Highlights</div>
                <button className="shrink-0 rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[760] text-[#334155]">See all</button>
              </div>
              <div
                className="mt-1 whitespace-nowrap font-[780] tracking-[-0.045em] text-[#0f172a]"
                style={{ fontSize: "clamp(15px, 4.5vw, 21px)" }}
              >
                Momente care definesc profilul
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3">
              {PROFILE.highlights.map((highlight) => (
                <button key={highlight.id} className="group w-[108px] shrink-0 text-left">
                  <div className="relative h-[108px] w-[108px] overflow-hidden rounded-[32px] bg-[#dbe4f0] shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                    <Image src={highlight.image} alt={highlight.title} fill sizes="108px" className="object-cover transition duration-300 group-hover:scale-[1.04]" />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/45 to-transparent" />
                  </div>
                  <div className="mt-3 text-[14px] font-[760] tracking-[-0.02em] text-[#0f172a]">{highlight.title}</div>
                  <div className="mt-1 text-[12px] font-[600] text-[#64748b]">{highlight.subtitle}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="sticky top-[60px] z-20 bg-[linear-gradient(180deg,rgba(238,243,248,0.96),rgba(238,243,248,0.85))] px-0 pb-3 pt-1 backdrop-blur-xl">
          <div className="overflow-hidden rounded-none bg-white p-2 shadow-[0_14px_34px_rgba(15,23,42,0.08)] ring-1 ring-white sm:rounded-[28px]">
            <div className="grid grid-cols-3 gap-2">
              <TabButton id="postari" current={activeTab} onChange={setActiveTab} label="Posts" icon={<Radio className="h-4 w-4" strokeWidth={2.1} />} />
              <TabButton id="media" current={activeTab} onChange={setActiveTab} label="Media" icon={<Grid2x2 className="h-4 w-4" strokeWidth={2.1} />} />
              <TabButton id="despre" current={activeTab} onChange={setActiveTab} label="About" icon={<Sparkles className="h-4 w-4" strokeWidth={2.1} />} />
            </div>
          </div>
        </div>

        {deferredTab === "postari" ? (
          <div className="space-y-3">
            {PROFILE.posts.map((post) => (
              <section key={post.id} className="overflow-hidden rounded-none bg-white shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-white sm:rounded-[30px]">
                <div className="flex items-center justify-between border-b border-[#eef2f7] px-4 py-3">
                  <div>
                    <div className="text-[12px] font-[800] uppercase tracking-[0.16em] text-[#7c8aa5]">Profile post</div>
                    <div className="mt-1 text-[15px] font-[740] tracking-[-0.02em] text-[#0f172a]">Conversații și idei din profil</div>
                  </div>
                  <button className="rounded-full bg-[#f8fafc] p-2 text-[#64748b]">
                    <MoreHorizontal className="h-4 w-4" strokeWidth={2.1} />
                  </button>
                </div>
                <FeedPost post={post} />
              </section>
            ))}
          </div>
        ) : null}

        {deferredTab === "media" ? (
          <section className="overflow-hidden rounded-none bg-white px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-white sm:rounded-[30px]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">Media</div>
                <div className="mt-1 text-[21px] font-[780] tracking-[-0.045em] text-[#0f172a]">Galerie curată și modernă</div>
              </div>
              <div className="rounded-full bg-[#eef4ff] p-3 text-[#2563eb]">
                <ImageIcon className="h-5 w-5" strokeWidth={2.1} />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {PROFILE.photos.map((photo, index) => (
                <button
                  key={photo}
                  onClick={() => setActivePhotoIndex(index)}
                  className={`group relative overflow-hidden rounded-[28px] bg-[#dbe4f0] ${index === 0 ? "col-span-2 h-[240px]" : "h-[168px]"}`}
                >
                  <Image src={photo} alt={`Media ${index + 1}`} fill sizes={index === 0 ? "(max-width: 640px) 100vw, 600px" : "50vw"} className="object-cover transition duration-300 group-hover:scale-[1.04]" />
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
                  <div className="absolute bottom-3 left-3 rounded-full bg-white/88 px-3 py-1.5 text-[11px] font-[780] uppercase tracking-[0.12em] text-[#0f172a]">
                    Shot {index + 1}
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {PROFILE.videos.map((video) => (
                <div key={video.id} className="overflow-hidden rounded-[28px] border border-[#eef2f7] bg-[#f8fafc]">
                  <div className="relative aspect-[0.86/1] overflow-hidden">
                    <Image src={video.poster} alt={video.title} fill sizes="50vw" className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(2,6,23,0.62))]" />
                    <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/88 text-[#0f172a] shadow-lg">
                      <PlayCircle className="h-6 w-6" strokeWidth={2.1} />
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <div className="text-[14px] font-[760] tracking-[-0.02em] text-[#0f172a]">{video.title}</div>
                    <div className="mt-1 text-[12px] font-[600] text-[#64748b]">{video.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {deferredTab === "despre" ? (
          <section className="overflow-hidden rounded-none bg-white px-4 py-4 shadow-[0_16px_38px_rgba(15,23,42,0.07)] ring-1 ring-white sm:rounded-[30px]">
            <div className="text-[12px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">About</div>
            <div className="mt-1 text-[21px] font-[780] tracking-[-0.045em] text-[#0f172a]">Claritate, context și contact</div>

            <div className="mt-5 grid gap-3">
              <InfoCard icon={<Briefcase className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />} title="Work" text={PROFILE.work} />
              <InfoCard icon={<MapPin className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />} title="Location" text={PROFILE.location} />
              <InfoCard icon={<Calendar className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />} title="Joined" text={PROFILE.joinDate} />
              <InfoCard icon={<Globe className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />} title="Website" text={PROFILE.website} />
            </div>

            <div className="mt-5 rounded-[28px] bg-[#f8fafc] p-4">
              <div className="text-[12px] font-[800] uppercase tracking-[0.16em] text-[#8190a8]">Top skills</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {PROFILE.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-white px-3 py-2 text-[13px] font-[700] text-[#334155] shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-5 rounded-[28px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] p-4 text-white">
              <div className="text-[12px] font-[800] uppercase tracking-[0.16em] text-white/58">Start a conversation</div>
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder="Scrie un mesaj scurt și clar..."
                className="mt-3 min-h-[110px] w-full resize-none rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 text-[14px] text-white outline-none placeholder:text-white/38"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="text-[13px] font-[600] text-white/62">{messageStatus || "Mesajele scurte primesc răspuns mai repede."}</div>
                <button
                  onClick={handleSendMessage}
                  className="rounded-full bg-white px-4 py-2.5 text-[13px] font-[760] text-[#0f172a] transition-transform active:scale-[0.98]"
                >
                  Trimite
                </button>
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {activePhotoIndex !== null ? (
        <PhotoViewer
          photos={PROFILE.photos}
          activeIndex={activePhotoIndex}
          onClose={() => setActivePhotoIndex(null)}
          onPrevious={() => setActivePhotoIndex((current) => (current === null ? 0 : (current - 1 + PROFILE.photos.length) % PROFILE.photos.length))}
          onNext={() => setActivePhotoIndex((current) => (current === null ? 0 : (current + 1) % PROFILE.photos.length))}
        />
      ) : null}

      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={defaultPostId} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={defaultPostId} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleAvatarFileChange}
        className="hidden"
      />

      <style jsx global>{`
        @keyframes profile-shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
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

function MetaItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[#94a3b8]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function QuickCard({
  icon,
  label,
  glow,
}: {
  icon: React.ReactNode;
  label: string;
  glow: string;
}) {
  return (
    <button
      className="relative overflow-hidden rounded-[24px] bg-[linear-gradient(180deg,#ffffff_0%,#f7f9ff_100%)] px-3 py-5 text-center shadow-[0_16px_28px_rgba(15,23,42,0.06)] ring-1 ring-[#edf2fb] transition-transform active:scale-[0.98]"
      style={{ boxShadow: `0 16px 28px rgba(15,23,42,0.06), inset 0 0 0 1px rgba(255,255,255,0.72), 0 0 34px ${glow}` }}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
        {icon}
      </div>
      <div className="mt-4 text-[14px] font-[700] tracking-[-0.02em] text-[#222222]">{label}</div>
    </button>
  );
}

function TabButton({
  id,
  current,
  onChange,
  label,
  icon,
}: {
  id: TabId;
  current: TabId;
  onChange: (value: TabId) => void;
  label: string;
  icon: React.ReactNode;
}) {
  const isActive = current === id;

  return (
    <button
      onClick={() =>
        startTransition(() => {
          onChange(id);
        })
      }
      className={`flex items-center justify-center gap-1.5 rounded-[18px] px-3 py-3 text-[13px] font-[720] tracking-[-0.02em] transition-all ${
        isActive ? "bg-[#0f172a] text-white shadow-[0_12px_22px_rgba(15,23,42,0.16)]" : "text-[#64748b]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] bg-[#f8fafc] px-4 py-4">
      <div className="flex items-center gap-2 text-[13px] font-[800] uppercase tracking-[0.14em] text-[#7c8aa5]">
        {icon}
        {title}
      </div>
      <div className="mt-2 text-[15px] font-[700] tracking-[-0.02em] text-[#0f172a]">{text}</div>
    </div>
  );
}

function PhotoViewer({
  photos,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}: {
  photos: string[];
  activeIndex: number;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const activePhoto = photos[activeIndex] ?? photos[0];

  return (
    <div className="fixed inset-0 z-[90] bg-[rgba(5,9,18,0.88)] backdrop-blur-md" onClick={onClose}>
      <div className="flex items-center justify-between px-4 py-5 text-white">
        <button onClick={onClose} className="rounded-full bg-white/10 p-2" aria-label="Închide galeria">
          <X className="h-6 w-6" />
        </button>
        <div className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white/82">
          {activeIndex + 1} / {photos.length}
        </div>
      </div>
      <div className="relative flex h-[calc(100%-88px)] items-center justify-center px-4 pb-8" onClick={(event) => event.stopPropagation()}>
        <button onClick={onPrevious} className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="relative h-full w-full max-w-[520px] overflow-hidden rounded-[32px] bg-white/6 ring-1 ring-white/10">
          <Image src={activePhoto} alt={`Fotografie ${activeIndex + 1}`} fill sizes="(max-width: 640px) 100vw, 520px" className="object-contain" />
        </div>
        <button onClick={onNext} className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white">
          <Camera className="hidden" />
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </button>
      </div>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-[#2563eb]">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
