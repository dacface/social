"use client";

import Image from "next/image";
import React, { startTransition, useDeferredValue, useEffect, useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  Compass,
  FileText,
  Flame,
  Globe,
  HeartHandshake,
  Image as ImageIcon,
  Link as LinkIcon,
  MapPin,
  MessageCircle,
  MessageSquareText,
  MoveUpRight,
  Pin,
  PlayCircle,
  Radio,
  Scale,
  Send,
  Sparkles,
  Star,
  UserPlus,
  X,
} from "lucide-react";
import FeedPost, { Post } from "./FeedPost";
import DezbatereModal from "./DezbatereModal";
import AiAnalysisModal from "./AiAnalysisModal";

const MOCK_USER = {
  id: "u123",
  name: "Alexandru Marin",
  username: "@alexmarin",
  isVerified: true,
  avatar: "https://i.pravatar.cc/300?u=alex",
  coverImage:
    "https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=1400&auto=format&fit=crop",
  bio: "Construiesc produse digitale, documentez idei de business si transform profilul intr-un spatiu editorial cu ritm, claritate si identitate.",
  location: "Bucuresti, Romania",
  joinDate: "Membru din sept. 2024",
  website: "alexmarin.ro",
  work: "Fondator la TechStart",
  headline: "Creator, antreprenor si strategist digital",
  skills: ["Product strategy", "Social UX", "Creator tools", "Go-to-market", "Growth loops", "Mobile storytelling"],
  topTopics: ["social products", "creator economy", "AI workflows", "community design", "distribution", "mobile patterns"],
  collab: {
    title: "Collab / Contact / Ask me about",
    description: "Deschis pentru conversații despre produs, consultanță punctuală, feedback pe experiențe sociale și idei de colaborare.",
    asks: ["Audit de produs", "Strategie creator tools", "Social UX feedback", "Parteneriate media"],
    contact: "Răspund cel mai bine la mesaje scurte și specifice.",
  },
  followers: "124K",
  following: "342",
  postsCount: "56",
  likes: "2.4M",
  badges: ["Top Voice", "Verified Creator"],
  signals: ["Replies within the day", "Original posts weekly", "Community-first tone"],
  socialProof: {
    mutuals: "18 followers comuni",
    recentActivity: "Activ in ultimele 3 ore",
    responseRate: "Raspunde la 87% dintre mesaje",
  },
  featured: {
    eyebrow: "Pinned",
    title: "Construiesc produse care merita urmarite, nu doar lansate.",
    summary: "Seria mea despre social products si creator tools a strans engagement puternic in ultimele saptamani.",
    cta: "Vezi postarea fixata",
  },
  highlights: [
    { id: "h1", title: "Travel", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop", status: "Live now", isPinned: true, isFavorite: true, preview: "City breaks, meetings și cadre cu energie calmă." },
    { id: "h2", title: "Studio", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=500&auto=format&fit=crop", status: "Updated today", isFavorite: true, preview: "Spațiul în care iau formă produsele și ideile." },
    { id: "h3", title: "Events", image: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=500&auto=format&fit=crop", status: "Most viewed", preview: "Conversații, paneluri și momente din comunitate." },
    { id: "h4", title: "Ideas", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=500&auto=format&fit=crop", status: "Saved by 62", preview: "Note rapide despre produs, distribuție și growth." },
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
};

const PROFILE_POST_INSIGHTS: Record<
  string,
  {
    badge: "Most discussed" | "Most shared" | "New reply activity";
    summary: string;
    topComment: string;
    topCommentAuthor: string;
    replyCta: string;
  }
> = {
  p1: {
    badge: "Most discussed",
    summary: "Conversația e deja activă și atrage reply-uri noi din comunitate.",
    topComment: "Foarte bun punctul despre adaptare. Diferența o face cine știe să aplice, nu doar să înțeleagă.",
    topCommentAuthor: "Ioana Pavel",
    replyCta: "Intră în conversație",
  },
  p2: {
    badge: "New reply activity",
    summary: "Postarea a primit reacții recente și are spațiu bun pentru un comentariu nou.",
    topComment: "Ce insight-uri ți s-au părut cele mai utile de la eveniment?",
    topCommentAuthor: "Mara Ionescu",
    replyCta: "Lasă un reply",
  },
  v1: {
    badge: "Most shared",
    summary: "Clipul se distribuie bine și are retenție bună în profil.",
    topComment: "Formatul ăsta scurt chiar merge bine pentru updates rapide.",
    topCommentAuthor: "Andrei Popescu",
    replyCta: "Comentează la reel",
  },
};

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState("postari");
  const deferredActiveTab = useDeferredValue(activeTab);
  const [isFollowed, setIsFollowed] = useState(false);
  const [isDezbatereOpen, setIsDezbatereOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [messageStatus, setMessageStatus] = useState("");
  const [statsSheet, setStatsSheet] = useState<null | "followers" | "following" | "posts" | "likes">(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [loadedHighlights, setLoadedHighlights] = useState<Record<string, boolean>>({});
  const [loadedPhotos, setLoadedPhotos] = useState<Record<string, boolean>>({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [activeHighlightIndex, setActiveHighlightIndex] = useState<number | null>(null);

  const profilePhotos = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=900&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=900&auto=format&fit=crop",
  ];

  const profileVideos: Post[] = [
    {
      id: "v1",
      type: "reel",
      authorName: MOCK_USER.name,
      authorAvatar: MOCK_USER.avatar,
      isVerified: true,
      time: "3 zile",
      caption: "Un scurt tur din culisele ultimului eveniment la care am participat.",
      hasMoreText: false,
      likes: 118,
      likesText: "118",
      comments: 16,
      shares: 5,
      videoUrl: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
  ];

  const activeHighlight =
    activeHighlightIndex !== null ? MOCK_USER.highlights[activeHighlightIndex] : null;

  const handleFollow = () => {
    setIsFollowed((current) => !current);

    if (!isFollowed) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "USER_FOLLOW",
          userId: MOCK_USER.id,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {});
    }
  };

  const handleSendMessage = () => {
    const nextMessage = messageDraft.trim();

    if (!nextMessage) {
      return;
    }

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "USER_MESSAGE",
        userId: MOCK_USER.id,
        text: nextMessage,
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});

    setMessageStatus("Mesaj trimis.");
    setMessageDraft("");
  };

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollProgress(Math.min(1, y / 320));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const stickyProgress = Math.max(0, Math.min(1, (scrollProgress - 0.4) / 0.32));
  const heroMotionProgress = Math.max(0, Math.min(1, scrollProgress / 0.72));
  const heroCardScale = 1 - heroMotionProgress * 0.035;
  const heroCardLift = heroMotionProgress * 12;
  const heroMetaOpacity = 1 - heroMotionProgress * 0.18;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[radial-gradient(circle_at_top,_#f9fbfe_0%,_#eef2f6_34%,_#e8edf3_100%)] text-[#111827]">
      <div className="fixed left-0 right-0 top-0 z-30">
        <div
          className="mx-auto w-full max-w-[600px] px-4 pt-2 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            opacity: stickyProgress,
            transform: `translateY(${(1 - stickyProgress) * -18}px) scale(${0.985 + stickyProgress * 0.015})`,
            pointerEvents: stickyProgress > 0.08 ? "auto" : "none",
          }}
        >
        <div
          className="flex items-center gap-3 rounded-[24px] bg-white/90 px-3 py-2 shadow-[0_14px_28px_rgba(15,23,42,0.10)] ring-1 ring-white/85 backdrop-blur-[18px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{
            transform: `scale(${0.92 + stickyProgress * 0.08})`,
            borderRadius: `${26 - stickyProgress * 6}px`,
            paddingTop: `${8 - stickyProgress * 1.5}px`,
            paddingBottom: `${8 - stickyProgress * 1.5}px`,
            boxShadow: `0 ${10 + stickyProgress * 8}px ${22 + stickyProgress * 10}px rgba(15,23,42,${0.05 + stickyProgress * 0.07})`,
          }}
        >
          <div
            className="relative overflow-hidden rounded-2xl bg-[#dbe4f0] transition-all duration-300"
            style={{
              width: `${30 + stickyProgress * 12}px`,
              height: `${30 + stickyProgress * 12}px`,
              borderRadius: `${14 + stickyProgress * 6}px`,
            }}
          >
            <Image src={MOCK_USER.avatar} alt={MOCK_USER.name} fill sizes="40px" className="object-cover" />
          </div>
          <div
            className="min-w-0 flex-1 transition-all duration-300"
            style={{
              opacity: 0.72 + stickyProgress * 0.28,
              transform: `translateX(${(1 - stickyProgress) * 6}px)`,
            }}
          >
            <div
              className="truncate font-[760] tracking-[-0.02em] text-[#0f172a] transition-all duration-300"
              style={{ fontSize: `${13 + stickyProgress}px` }}
            >
              {MOCK_USER.name}
            </div>
            <div
              className="truncate font-[600] text-[#64748b] transition-all duration-300"
              style={{
                fontSize: `${11 + stickyProgress * 1}px`,
                opacity: 0.55 + stickyProgress * 0.45,
              }}
            >
              {MOCK_USER.socialProof.recentActivity}
            </div>
          </div>
          <button
            onClick={handleFollow}
            className={`rounded-full px-4 py-2 text-[13px] font-[760] transition-transform active:scale-[0.98] ${
              isFollowed ? "bg-[#e8eef8] text-[#0f172a]" : "bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_44%,#1746cc_100%)] text-white"
            }`}
            style={{
              opacity: 0.15 + stickyProgress * 0.85,
              transform: `translateX(${(1 - stickyProgress) * 12}px) scale(${0.94 + stickyProgress * 0.06})`,
            }}
          >
            {isFollowed ? "Following" : "Follow"}
          </button>
          <button
            onClick={() => setActiveTab("despre")}
            className="rounded-full bg-[#eef3f8] px-4 py-2 text-[13px] font-[760] text-[#0f172a] transition-transform active:scale-[0.98]"
            style={{
              opacity: stickyProgress,
              transform: `translateX(${(1 - stickyProgress) * 18}px) scale(${0.92 + stickyProgress * 0.08})`,
            }}
          >
            Message
          </button>
        </div>
        </div>
      </div>

      <section className="relative">
        <div className="absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(circle_at_18%_18%,rgba(255,255,255,0.66),transparent_26%),radial-gradient(circle_at_82%_20%,rgba(104,154,255,0.24),transparent_30%),radial-gradient(circle_at_70%_84%,rgba(163,191,255,0.16),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.12),transparent)]" />
        <div className="relative h-[268px] overflow-hidden sm:h-[320px]">
          {!coverLoaded ? <ShimmerBlock className="absolute inset-0" /> : null}
          <Image
            src={MOCK_USER.coverImage}
            alt={MOCK_USER.name}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 600px"
            className={`object-cover transition duration-700 ${coverLoaded ? "opacity-100 scale-100" : "scale-[1.04] opacity-0"}`}
            style={{ transform: `translateY(${scrollProgress * 16}px) scale(${1.02 + scrollProgress * 0.035})` }}
            onLoad={() => setCoverLoaded(true)}
          />
          <div
            className="absolute inset-0 scale-[1.03] bg-[linear-gradient(180deg,rgba(8,15,28,0.04)_0%,rgba(8,15,28,0.16)_28%,rgba(8,15,28,0.42)_64%,rgba(8,15,28,0.62)_100%)]"
            style={{ opacity: 0.92 + scrollProgress * 0.08 }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[140px] bg-[linear-gradient(180deg,rgba(238,242,246,0)_0%,rgba(238,242,246,0.28)_45%,rgba(238,242,246,0.96)_100%)] backdrop-blur-[1.5px]" />
          <div
            className="absolute bottom-[-14px] right-[-36px] h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(71,120,255,0.50)_0%,rgba(71,120,255,0.18)_40%,transparent_74%)] blur-3xl"
            style={{ transform: `translate3d(${scrollProgress * -18}px, ${scrollProgress * 10}px, 0)` }}
          />
          <div
            className="absolute bottom-[78px] right-[18px] h-[120px] w-[240px] rotate-[-14deg] bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_45%,transparent_100%)] blur-xl"
            style={{ transform: `translate3d(${scrollProgress * -10}px, ${scrollProgress * 12}px, 0) rotate(-14deg)` }}
          />
          <div className="absolute bottom-11 right-8 h-1.5 w-1.5 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.88)]" />
          <div className="absolute bottom-20 right-16 h-1 w-1 rounded-full bg-white/70 shadow-[0_0_16px_rgba(255,255,255,0.72)]" />
          <div className="absolute bottom-16 right-28 h-[3px] w-[3px] rounded-full bg-white/70 shadow-[0_0_20px_rgba(255,255,255,0.75)]" />
        </div>

        <div className="relative -mt-20 px-4 pb-3 profile-reveal" style={{ animationDelay: "40ms" }}>
          <div
            className="overflow-hidden rounded-[34px] bg-[linear-gradient(180deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.90)_56%,rgba(249,251,255,0.93)_100%)] px-4 py-4 shadow-[0_24px_56px_rgba(15,23,42,0.12)] ring-1 ring-white/88 backdrop-blur-[20px] transition-[transform,box-shadow,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
            style={{
              transform: `translateY(${-heroCardLift}px) scale(${heroCardScale})`,
              opacity: heroMetaOpacity,
              boxShadow: `0 ${24 - heroMotionProgress * 6}px ${56 - heroMotionProgress * 10}px rgba(15,23,42,${0.12 - heroMotionProgress * 0.025})`,
            }}
          >
            <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.9),transparent)]" />
            <div className="mb-4 flex items-center gap-2 text-[11px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">
              <Radio className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.4} />
              Profil creator
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex min-w-0 items-end gap-3">
                <div className="relative shrink-0">
                  <div
                    className="relative overflow-hidden rounded-[30px] border-[3px] border-white bg-[#dbe4f0] shadow-[0_16px_26px_rgba(15,23,42,0.14)] ring-1 ring-[#d9e2ee] transition-transform duration-300 hover:scale-[1.03]"
                    style={{
                      width: `${96 - scrollProgress * 12}px`,
                      height: `${96 - scrollProgress * 12}px`,
                      transform: `translateY(${scrollProgress * -6}px) scale(${1 - scrollProgress * 0.04})`,
                    }}
                  >
                    {!avatarLoaded ? <ShimmerBlock className="absolute inset-0" /> : null}
                    <Image
                      src={MOCK_USER.avatar}
                      alt={MOCK_USER.name}
                      fill
                      sizes="96px"
                      className={`object-cover transition duration-500 ${avatarLoaded ? "opacity-100" : "opacity-0"}`}
                      onLoad={() => setAvatarLoaded(true)}
                    />
                  </div>
                  {MOCK_USER.isVerified ? (
                    <div className="absolute -bottom-1 -right-1 rounded-full border-4 border-white bg-white">
                      <VerifiedBadge />
                    </div>
                  ) : null}
                </div>

                <div className="min-w-0 flex-1 pb-1">
                  <div className="flex items-start gap-2">
                    <h1
                      className="font-[780] text-[#0f172a] break-words"
                      style={{
                        fontSize: "clamp(18px, 4.8vw, 24px)",
                        lineHeight: 1.08,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {MOCK_USER.name}
                    </h1>
                  </div>
                  <div className="mt-1 text-[14px] font-[620] tracking-[-0.015em] text-[#6b7a90]">
                    {MOCK_USER.username}
                  </div>
                  <div className="mt-3 flex justify-start">
                    <button
                      onClick={handleFollow}
                      className={`inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-[740] tracking-[-0.025em] shadow-[0_12px_28px_rgba(37,99,235,0.20)] transition-all active:scale-[0.98] sm:w-auto ${
                        isFollowed
                          ? "bg-[#e8eef8] text-[#0f172a]"
                          : "bg-[linear-gradient(135deg,#3b82f6_0%,#2563eb_44%,#1746cc_100%)] text-white"
                      }`}
                    >
                      <UserPlus className="h-4 w-4" strokeWidth={2.2} />
                      {isFollowed ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[16px] font-[700] tracking-[-0.025em] text-[#1d2939]">{MOCK_USER.headline}</div>
              <p className="mt-2 text-[15px] leading-[1.65] text-[#516072]">{MOCK_USER.bio}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {MOCK_USER.badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full bg-[#f4f7fb] px-3 py-2 text-[12px] font-[780] tracking-[0.01em] text-[#334155]"
                >
                  {badge}
                </span>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {MOCK_USER.signals.map((signal) => (
                <span
                  key={signal}
                  className="rounded-full border border-[#dce5f0] bg-white px-3 py-2 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#6d7b8f]"
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-[580] text-[#64748b]">
              <MetaItem icon={<MapPin className="h-4 w-4" />} text={MOCK_USER.location} />
              <MetaItem icon={<Briefcase className="h-4 w-4" />} text={MOCK_USER.work} />
              <MetaItem icon={<Calendar className="h-4 w-4" />} text={MOCK_USER.joinDate} />
              <MetaItem icon={<Globe className="h-4 w-4" />} text={MOCK_USER.website} />
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              <StatCard value={MOCK_USER.followers} label="Followers" onClick={() => setStatsSheet("followers")} />
              <StatCard value={MOCK_USER.following} label="Following" onClick={() => setStatsSheet("following")} />
              <StatCard value={MOCK_USER.postsCount} label="Posts" onClick={() => setStatsSheet("posts")} />
              <StatCard value={MOCK_USER.likes} label="Likes" onClick={() => setStatsSheet("likes")} />
            </div>

            <div className="mt-5 grid grid-cols-[1fr_1fr_auto_auto] gap-2">
              <PrimaryActionButton
                icon={<UserPlus className="h-4 w-4" strokeWidth={2.25} />}
                label={isFollowed ? "Following" : "Follow"}
                onClick={handleFollow}
                primary
              />
              <PrimaryActionButton
                icon={<MessageCircle className="h-4 w-4" strokeWidth={2.25} />}
                label="Message"
                onClick={() => setActiveTab("despre")}
              />
              <IconActionButton icon={<Sparkles className="h-4 w-4" strokeWidth={2.25} />} onClick={() => setIsAiOpen(true)} label="AI" />
              <IconActionButton icon={<Scale className="h-4 w-4" strokeWidth={2.25} />} onClick={() => setIsDezbatereOpen(true)} label="Debate" />
            </div>
          </div>
        </div>
      </section>

      <div className="px-4">
        <section className="mb-3 rounded-[30px] bg-white px-4 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] profile-reveal" style={{ animationDelay: "90ms" }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-[800] uppercase tracking-[0.18em] text-[#8190a8]">
                <HeartHandshake className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.3} />
                Social proof
              </div>
              <div className="mt-2 text-[21px] font-[760] tracking-[-0.04em] text-[#0f172a]">
                Motive rapide să interacționezi
              </div>
            </div>
            <div className="rounded-full bg-[#eef4ff] p-3 text-[#2563eb]">
              <Sparkles className="h-5 w-5" strokeWidth={2.1} />
            </div>
          </div>
          <div className="mt-4 grid gap-3">
            <SocialProofRow
              title="Mutual reach"
              value={MOCK_USER.socialProof.mutuals}
              description="Există deja public comun, deci follow-ul și conversația au context."
            />
            <SocialProofRow
              title="Response signal"
              value={MOCK_USER.socialProof.responseRate}
              description="Mesajele au șanse bune să primească răspuns rapid."
            />
            <SocialProofRow
              title="Presence"
              value={MOCK_USER.socialProof.recentActivity}
              description="Profil activ recent, cu ritm bun de publicare și răspuns."
            />
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[30px] bg-[linear-gradient(135deg,#0f172a_0%,#1b2740_48%,#21385f_100%)] p-4 text-white shadow-[0_20px_44px_rgba(15,23,42,0.18)] profile-reveal" style={{ animationDelay: "130ms" }}>
          <div className="pointer-events-none absolute right-[-30px] top-[-30px] h-28 w-28 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-[-40px] left-10 h-24 w-36 rounded-full bg-[#3b82f6]/20 blur-3xl" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-[800] uppercase tracking-[0.18em] text-white/62">
                <Pin className="h-3.5 w-3.5" strokeWidth={2.4} />
                {MOCK_USER.featured.eyebrow}
              </div>
              <div className="mt-2 text-[23px] font-[760] tracking-[-0.045em] text-white">
                {MOCK_USER.featured.title}
              </div>
            </div>
            <div className="rounded-full bg-white/10 p-3 backdrop-blur-md">
              <Flame className="h-5 w-5 text-[#ffb545]" strokeWidth={2.1} />
            </div>
          </div>
          <p className="mt-3 text-[15px] leading-[1.65] text-white/72">{MOCK_USER.featured.summary}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="rounded-full bg-white/10 px-4 py-3 text-[14px] font-[700] text-white backdrop-blur-md transition-all hover:bg-white/14 active:scale-[0.98]">
              {MOCK_USER.featured.cta}
            </button>
            <button
              onClick={() => setActiveTab("despre")}
              className="rounded-full bg-white px-4 py-3 text-[14px] font-[760] text-[#0f172a] transition-transform active:scale-[0.98]"
            >
              Comenteaza acum
            </button>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <FeaturedMetric label="Comentarii" value="418" />
            <FeaturedMetric label="Distribuiri" value="127" />
            <FeaturedMetric label="Conversii" value="Trending" />
          </div>
        </section>

        <section className="mt-3 rounded-[30px] bg-white px-4 py-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] profile-reveal" style={{ animationDelay: "170ms" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[19px] font-[760] tracking-[-0.04em] text-[#0f172a]">Highlights</div>
              <div className="mt-1 text-[14px] text-[#6b7a90]">Povesti, proiecte si momente care definesc profilul.</div>
            </div>
            <button className="rounded-full bg-[#f4f7fb] px-3 py-2 text-[13px] font-[680] text-[#334155]">
              Vezi tot
            </button>
          </div>
          <div className="mt-4 rounded-[22px] bg-[#f8fafc] px-4 py-3">
            <div className="flex items-center gap-2 text-[13px] font-[700] text-[#0f172a]">
              <MessageSquareText className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />
              Highlights orientate pe interacțiune
            </div>
            <p className="mt-1 text-[13px] leading-[1.55] text-[#64748b]">
              Fiecare highlight deschide o direcție diferită de conversație sau interes.
            </p>
          </div>

          <div className="mt-4 overflow-x-auto no-scrollbar">
            <div className="flex gap-3">
              {MOCK_USER.highlights.map((highlight, index) => (
                <button
                  key={highlight.id}
                  onClick={() => {
                    setActiveHighlightId(highlight.id);
                    setActiveHighlightIndex(index);
                  }}
                  className={`group shrink-0 transition-[transform,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.95] ${index === 0 ? "w-[132px]" : "w-[96px]"}`}
                >
                  <div className={`relative overflow-hidden rounded-[30px] bg-[#dbe4f0] shadow-[0_12px_24px_rgba(15,23,42,0.10)] ring-1 ring-[#e2e8f0] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${index === 0 ? "h-[132px] w-[132px]" : "h-[96px] w-[96px]"}`}>
                    {!loadedHighlights[highlight.id] ? <ShimmerBlock className="absolute inset-0" /> : null}
                    <Image
                      src={highlight.image}
                      alt={highlight.title}
                      fill
                      sizes={index === 0 ? "132px" : "96px"}
                      className={`object-cover transition duration-500 group-hover:scale-[1.06] ${
                        loadedHighlights[highlight.id] ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() =>
                        setLoadedHighlights((current) => ({
                          ...current,
                          [highlight.id]: true,
                        }))
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/45 to-transparent" />
                    <div className="absolute left-3 top-3 flex items-center gap-1.5">
                      {highlight.isPinned ? (
                        <span className="rounded-full bg-white/90 px-2 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#0f172a]">
                          Pinned
                        </span>
                      ) : null}
                      {highlight.isFavorite ? (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/88 text-[#f59e0b]">
                          <Star className="h-3.5 w-3.5 fill-current" strokeWidth={1.8} />
                        </span>
                      ) : null}
                    </div>
                    {activeHighlightId === highlight.id ? (
                      <div className="absolute inset-0 ring-2 ring-[#2f7dff] ring-offset-2 ring-offset-white rounded-[30px]" />
                    ) : null}
                    {index === 0 ? (
                      <div className="absolute left-3 top-3 rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#0f172a]">
                        Start here
                      </div>
                    ) : null}
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-1 text-[10px] font-[700] uppercase tracking-[0.1em] text-white backdrop-blur-md">
                      {highlight.status}
                    </div>
                  </div>
                  <div className="mt-2 truncate text-center text-[13px] font-[680] text-[#334155]">{highlight.title}</div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="sticky top-[57px] z-20 mt-4 rounded-[28px] bg-[#eef2f6]/94 p-1.5 backdrop-blur-[14px] profile-reveal" style={{ animationDelay: "210ms" }}>
          <div className="grid grid-cols-4 gap-1 rounded-[24px] bg-white p-1.5 shadow-[0_12px_26px_rgba(15,23,42,0.07)]">
            <TabButton id="postari" current={activeTab} set={setActiveTab} label="Posts" icon={<Radio className="h-3.5 w-3.5" strokeWidth={2.2} />} />
            <TabButton id="despre" current={activeTab} set={setActiveTab} label="About" icon={<Compass className="h-3.5 w-3.5" strokeWidth={2.2} />} />
            <TabButton id="fotografii" current={activeTab} set={setActiveTab} label="Media" icon={<ImageIcon className="h-3.5 w-3.5" strokeWidth={2.2} />} />
            <TabButton id="video" current={activeTab} set={setActiveTab} label="Video" icon={<PlayCircle className="h-3.5 w-3.5" strokeWidth={2.2} />} />
          </div>
        </div>

        <div
          key={deferredActiveTab}
          className="mt-4 flex animate-[profile-tab-enter_320ms_cubic-bezier(0.2,0.9,0.2,1)] flex-col gap-3 pb-8"
        >
          {deferredActiveTab === "postari" && (
            <section className="rounded-[30px] bg-white p-4 shadow-[0_18px_42px_rgba(15,23,42,0.09)] profile-reveal" style={{ animationDelay: "40ms" }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.18em] text-[#7c8aa5]">
                    <FileText className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.3} />
                    Profile feed
                  </div>
                  <div className="mt-2 text-[20px] font-[760] tracking-[-0.04em] text-[#0f172a]">
                    Postari care definesc vocea profilului
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#64748b]">
                    O combinatie de perspective, update-uri si continut cu engagement ridicat.
                  </p>
                </div>
                <div className="rounded-full bg-[#eef4ff] p-3 text-[#2563eb]">
                  <Radio className="h-5 w-5" strokeWidth={2.1} />
                </div>
              </div>
            </section>
          )}

          {deferredActiveTab === "postari" &&
            MOCK_USER.posts.map((post, index) => (
              <ProfilePostCard
                key={post.id}
                post={post}
                variant={index === 0 ? "featured" : "recent"}
                title={index === 0 ? "Performanță ridicată în profil" : "Actualizare din comunitate"}
                animationDelay={`${90 + index * 60}ms`}
              />
            ))}

          {deferredActiveTab === "despre" && (
            <>
              <SectionCard title="Despre" animationDelay="40ms">
                <div className="grid gap-4">
                  <InfoRow icon={<Briefcase />} text="Lucreaza la " highlight={MOCK_USER.work} />
                  <InfoRow icon={<MapPin />} text="Locuieste in " highlight={MOCK_USER.location} />
                  <InfoRow icon={<LinkIcon />} text="" highlight={MOCK_USER.website} isLink />
                  <InfoRow icon={<Calendar />} text={MOCK_USER.joinDate} />
                </div>
              </SectionCard>

              <SectionCard title="Interese și puncte forte" animationDelay="80ms">
                <div className="grid gap-4">
                  <SmartInfoCard
                    title="Skills"
                    eyebrow="What this profile is good at"
                    items={MOCK_USER.skills}
                    accent="blue"
                  />
                  <SmartInfoCard
                    title="Top topics"
                    eyebrow="Best conversation starters"
                    items={MOCK_USER.topTopics}
                    accent="violet"
                  />
                </div>
              </SectionCard>

              <SectionCard title="Perspective" animationDelay="100ms">
                <div className="grid gap-3">
                  <InsightCard
                    icon={<Compass className="h-4 w-4 text-[#2563eb]" strokeWidth={2.2} />}
                    title="Ce construieste"
                    description="Produse sociale, tooling pentru creatori si experiente mobile care pun accent pe claritate si ritm."
                  />
                  <InsightCard
                    icon={<Flame className="h-4 w-4 text-[#f97316]" strokeWidth={2.2} />}
                    title="Ce performeaza bine"
                    description="Continut despre produs, strategie si observatii practice care invita oamenii sa raspunda, nu doar sa dea like."
                  />
                </div>
              </SectionCard>

              <SectionCard title={MOCK_USER.collab.title} animationDelay="130ms">
                <div className="rounded-[22px] bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] px-4 py-4">
                  <div className="text-[15px] font-[760] tracking-[-0.02em] text-[#0f172a]">
                    {MOCK_USER.collab.description}
                  </div>
                  <p className="mt-2 text-[14px] leading-[1.6] text-[#64748b]">{MOCK_USER.collab.contact}</p>
                </div>
                <div className="mt-4 grid gap-3">
                  {MOCK_USER.collab.asks.map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-3 rounded-[20px] bg-[#f8fafc] px-4 py-3"
                    >
                      <div>
                        <div className="text-[14px] font-[720] text-[#0f172a]">{item}</div>
                        <div className="mt-1 text-[13px] text-[#64748b]">Bun punct de plecare pentru un mesaj relevant.</div>
                      </div>
                      <button className="rounded-full bg-white px-3 py-2 text-[12px] font-[800] uppercase tracking-[0.12em] text-[#2563eb] shadow-sm">
                        Ask
                      </button>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Trimite un mesaj" animationDelay="160ms">
                <div className="mb-4 rounded-[20px] bg-[#eef4ff] px-4 py-3">
                  <div className="text-[14px] font-[700] text-[#0f172a]">Cel mai bun trigger de conversație</div>
                  <div className="mt-1 text-[13px] leading-[1.55] text-[#64748b]">
                    Răspunde la seria despre social products sau întreabă despre ultimul proiect fixat din profil.
                  </div>
                </div>
                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder={`Scrie-i lui ${MOCK_USER.name}...`}
                  className="min-h-[110px] w-full resize-none rounded-[22px] border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-[15px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[13px] font-[600] text-[#64748b]">{messageStatus}</span>
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageDraft.trim()}
                    className="rounded-full bg-[linear-gradient(135deg,#2f7dff_0%,#1858f2_100%)] px-5 py-3 text-[14px] font-[740] text-white shadow-[0_12px_24px_rgba(37,99,235,0.20)] disabled:opacity-40"
                  >
                    Trimite
                  </button>
                </div>
              </SectionCard>
            </>
          )}

          {deferredActiveTab === "fotografii" && (
            <SectionCard title="Media" animationDelay="40ms">
              <div className="mb-4 rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#1d3557_100%)] px-4 py-4 text-white shadow-[0_16px_34px_rgba(15,23,42,0.16)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-white/65">
                      <ImageIcon className="h-4 w-4" strokeWidth={2.1} />
                      Media spotlight
                    </div>
                    <div className="mt-2 text-[19px] font-[760] tracking-[-0.035em] text-white">
                      O galerie gândită ca o carte de vizită vizuală
                    </div>
                  </div>
                  <div className="rounded-full bg-white/10 p-3 backdrop-blur-md">
                    <MoveUpRight className="h-5 w-5 text-white" strokeWidth={2.2} />
                  </div>
                </div>
                <p className="mt-2 text-[14px] leading-[1.6] text-white/72">
                  Primele imagini sunt prioritizate pentru identitate, claritate și memorabilitate.
                </p>
              </div>
              <div className="mb-4 flex items-center justify-between gap-3 rounded-[22px] bg-[#f8fafc] px-4 py-3 text-left">
                <div>
                  <div className="text-[14px] font-[700] text-[#0f172a]">Galerie curatoriată</div>
                  <div className="mt-1 text-[13px] text-[#64748b]">Selecție de imagini care construiesc identitatea profilului.</div>
                </div>
                <div className="rounded-full bg-white p-2 text-[#64748b] shadow-sm">
                  <Globe className="h-4 w-4" strokeWidth={2.1} />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <MiniFeatureCard
                  icon={<Camera className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />}
                  title="Visual identity"
                  description="Selecție de imagini cu compoziție curată și ton consistent."
                />
                <MiniFeatureCard
                  icon={<ImageIcon className="h-4 w-4 text-[#7c3aed]" strokeWidth={2.1} />}
                  title="Curated moments"
                  description="Media organizată mai degrabă editorial decât cronologic."
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                {profilePhotos.map((photoUrl, idx) => (
                  <button
                    key={photoUrl}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`group relative overflow-hidden rounded-[24px] bg-[#dbe4f0] transition-[transform,box-shadow,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,23,42,0.14)] active:scale-[0.985] ${
                      idx === 0
                        ? "col-span-2 row-span-2 aspect-square"
                        : idx === 3
                          ? "col-span-2 aspect-[2/1]"
                          : "aspect-square"
                    }`}
                  >
                    {!loadedPhotos[photoUrl] ? <ShimmerBlock className="absolute inset-0" /> : null}
                    <Image
                      src={photoUrl}
                      alt={`Fotografie ${idx + 1}`}
                      fill
                      sizes={
                        idx === 0
                          ? "(max-width: 640px) 66vw, 360px"
                          : idx === 3
                            ? "(max-width: 640px) 66vw, 360px"
                            : "(max-width: 640px) 33vw, 180px"
                      }
                      className={`object-cover transition duration-500 group-hover:scale-[1.04] ${loadedPhotos[photoUrl] ? "opacity-100" : "opacity-0"}`}
                      onLoad={() =>
                        setLoadedPhotos((current) => ({
                          ...current,
                          [photoUrl]: true,
                        }))
                      }
                    />
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 rounded-full bg-white/88 px-2.5 py-1 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#0f172a]">
                      {idx === 0 ? "Cover pick" : idx === 3 ? "Wide frame" : `Shot ${idx + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </SectionCard>
          )}

          {deferredActiveTab === "video" &&
            <>
              <SectionCard title="Video" animationDelay="40ms">
                <div className="mb-4 grid gap-3">
                  <div className="rounded-[22px] bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] px-4 py-4">
                    <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#64748b]">
                      <PlayCircle className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />
                      Video showcase
                    </div>
                    <div className="mt-2 text-[18px] font-[760] tracking-[-0.035em] text-[#0f172a]">
                      Reels și clipuri cu retenție bună
                    </div>
                    <p className="mt-2 text-[14px] leading-[1.6] text-[#64748b]">
                      Conținut video scurt, construit pentru context rapid și engagement clar.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <FeaturedMetricLight label="Avg watch" value="34s" />
                    <FeaturedMetricLight label="Replay" value="18%" />
                    <FeaturedMetricLight label="Shares" value="High" />
                  </div>
                </div>
              </SectionCard>

              {profileVideos.map((videoPost) => (
                <section key={videoPost.id} className="overflow-hidden rounded-[30px] bg-white shadow-[0_18px_42px_rgba(15,23,42,0.09)] profile-reveal transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_52px_rgba(15,23,42,0.12)]" style={{ animationDelay: "100ms" }}>
                  <div className="border-b border-[#edf2f7] px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#7c8aa5]">
                          <PlayCircle className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.3} />
                          Featured reel
                        </div>
                        <div className="mt-1 text-[15px] font-[700] tracking-[-0.02em] text-[#0f172a]">
                          Clip scurt pregătit pentru retenție și distribuire
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveVideoIndex(profileVideos.findIndex((item) => item.id === videoPost.id))}
                        className="rounded-full bg-[#eef4ff] px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#2563eb]"
                      >
                        Open reel
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveVideoIndex(profileVideos.findIndex((item) => item.id === videoPost.id))}
                    className="mx-4 mt-4 flex w-[calc(100%-2rem)] items-center justify-between rounded-[24px] bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_100%)] px-4 py-4 text-left text-white shadow-[0_18px_36px_rgba(15,23,42,0.18)]"
                  >
                    <div>
                      <div className="text-[12px] font-[700] uppercase tracking-[0.14em] text-white/60">Reels viewer</div>
                      <div className="mt-1 text-[15px] font-[760] tracking-[-0.025em]">Vezi clipul în experiență fullscreen</div>
                    </div>
                    <div className="rounded-full bg-white/10 p-3 backdrop-blur-md">
                      <PlayCircle className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                  </button>
                  <FeedPost post={videoPost} />
                </section>
              ))}
            </>}
        </div>
      </div>

      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <ProfileStatsSheet kind={statsSheet} onClose={() => setStatsSheet(null)} />
      <HighlightViewer
        key={`highlight-${activeHighlight?.id ?? "closed"}`}
        highlights={MOCK_USER.highlights}
        activeHighlight={activeHighlight}
        onClose={() => setActiveHighlightIndex(null)}
        onSelect={(index) => setActiveHighlightIndex(index)}
        onPrevious={() =>
          setActiveHighlightIndex((current) =>
            current === null ? null : (current - 1 + MOCK_USER.highlights.length) % MOCK_USER.highlights.length
          )
        }
        onNext={() =>
          setActiveHighlightIndex((current) =>
            current === null ? null : (current + 1) % MOCK_USER.highlights.length
          )
        }
      />
      <ProfileMediaViewer
        photos={profilePhotos}
        activeIndex={activePhotoIndex}
        onClose={() => setActivePhotoIndex(null)}
        onPrevious={() =>
          setActivePhotoIndex((current) =>
            current === null ? null : (current - 1 + profilePhotos.length) % profilePhotos.length
          )
        }
        onNext={() =>
          setActivePhotoIndex((current) =>
            current === null ? null : (current + 1) % profilePhotos.length
          )
        }
        onSelect={(index) => setActivePhotoIndex(index)}
      />
      <ProfileReelViewer
        key={`reel-${activeVideoIndex ?? "closed"}`}
        videos={profileVideos}
        activeIndex={activeVideoIndex}
        onClose={() => setActiveVideoIndex(null)}
        onPrevious={() =>
          setActiveVideoIndex((current) =>
            current === null ? null : (current - 1 + profileVideos.length) % profileVideos.length
          )
        }
        onNext={() =>
          setActiveVideoIndex((current) =>
            current === null ? null : (current + 1) % profileVideos.length
          )
        }
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
        @keyframes profile-reveal {
          0% {
            opacity: 0;
            transform: translateY(18px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes profile-tab-enter {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.992);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .profile-reveal {
          animation: profile-reveal 520ms cubic-bezier(0.2, 0.9, 0.2, 1) both;
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

function StatCard({ value, label, onClick }: { value: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[22px] bg-[#f8fafc] px-3 py-3 text-left transition-transform active:scale-[0.98]"
    >
      <div className="text-[24px] font-[780] tracking-[-0.05em] text-[#0f172a]">{value}</div>
      <div className="mt-1 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#94a3b8]">{label}</div>
    </button>
  );
}

function PrimaryActionButton({
  icon,
  label,
  onClick,
  primary,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[50px] items-center justify-center gap-2 rounded-full px-4 text-[14px] font-[730] transition-transform active:scale-[0.98] ${
        primary
          ? "bg-[linear-gradient(135deg,#2f7dff_0%,#1858f2_100%)] text-white shadow-[0_12px_24px_rgba(37,99,235,0.20)]"
          : "bg-[#eef3f8] text-[#0f172a]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function IconActionButton({
  icon,
  onClick,
  label,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-[#eef3f8] text-[#334155] transition-transform active:scale-[0.98]"
    >
      {icon}
    </button>
  );
}

function SectionCard({
  title,
  children,
  animationDelay,
}: {
  title: string;
  children: React.ReactNode;
  animationDelay?: string;
}) {
  return (
    <section
      className="rounded-[28px] bg-white p-4 shadow-[0_16px_38px_rgba(15,23,42,0.08)] profile-reveal"
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="mb-4 text-[19px] font-[760] tracking-[-0.04em] text-[#0f172a]">{title}</div>
      {children}
    </section>
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
        ? { title: "Following", rows: ["Creator Economy Romania", "TechStart Labs", "Comunitatea Reels"] }
        : kind === "likes"
          ? { title: "Likes", rows: ["2.4M aprecieri totale", "Top post: 84K likes", "Engagement puternic in ultima luna"] }
          : { title: "Posts", rows: ["Postari publice: 56", "Reels: 8", "Story-uri active: 2"] };

  return (
    <div className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[32px] bg-white px-4 pb-6 pt-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300" />
        <div className="text-[19px] font-[760] tracking-[-0.04em] text-[#0f172a]">{content.title}</div>
        <div className="mt-4 space-y-2">
          {content.rows.map((row) => (
            <div key={row} className="rounded-[22px] bg-[#f8fafc] px-4 py-3 text-[15px] font-[620] text-[#334155]">
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileMediaViewer({
  photos,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
  onSelect,
}: {
  photos: string[];
  activeIndex: number | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const activePhoto = activeIndex !== null ? photos[activeIndex] : null;
  const resolvedActiveIndex = activeIndex ?? 0;

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        onPrevious();
      }
      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onNext, onPrevious]);

  if (activePhoto === null) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[92] bg-[#02040a]/96 backdrop-blur-xl" onClick={onClose}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_34%)]" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 py-4">
        <div className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[800] uppercase tracking-[0.14em] text-white/78 backdrop-blur-md">
          Fullscreen gallery
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm"
          aria-label="Închide galeria"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative flex h-full w-full items-center justify-center px-4 pb-28 pt-20" onClick={(event) => event.stopPropagation()}>
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Fotografia anterioară"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="relative h-full w-full max-w-[520px] overflow-hidden rounded-[32px] bg-white/6 shadow-[0_28px_80px_rgba(0,0,0,0.34)] ring-1 ring-white/10">
          {!viewerLoaded ? <ShimmerBlock className="absolute inset-0" /> : null}
          <Image
            key={activePhoto}
            src={activePhoto}
            alt={`Fotografie ${resolvedActiveIndex + 1}`}
            fill
            sizes="(max-width: 640px) 100vw, 520px"
            className={`object-contain transition duration-500 ${viewerLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setViewerLoaded(true)}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(2,6,23,0.72)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 px-4 pb-4">
            <div>
              <div className="text-[12px] font-[800] uppercase tracking-[0.14em] text-white/60">Media spotlight</div>
              <div className="mt-1 text-[17px] font-[760] tracking-[-0.03em] text-white">
                Cadru {resolvedActiveIndex + 1} din {photos.length}
              </div>
            </div>
            <div className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white/78 backdrop-blur-md">
              Swipe or tap
            </div>
          </div>
          <button onClick={onPrevious} className="absolute inset-y-0 left-0 w-1/3" aria-label="Fotografia anterioară" />
          <button onClick={onNext} className="absolute inset-y-0 right-0 w-1/3" aria-label="Fotografia următoare" />
        </div>

        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Fotografia următoare"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#08101d]/82 px-4 py-4 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {photos.map((photo, index) => (
            <button
              key={photo}
              onClick={() => onSelect(index)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden rounded-[18px] ring-1 transition-all ${
                index === resolvedActiveIndex ? "scale-[1.02] ring-white/70" : "opacity-70 ring-white/10"
              }`}
            >
              <Image src={photo} alt={`Preview ${index + 1}`} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileReelViewer({
  videos,
  activeIndex,
  onClose,
  onPrevious,
  onNext,
}: {
  videos: Post[];
  activeIndex: number | null;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const activeVideo = activeIndex !== null ? videos[activeIndex] : null;
  const nextVideo = activeIndex !== null ? videos[(activeIndex + 1) % videos.length] : null;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoProgress, setVideoProgress] = useState(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [feedbackScale, setFeedbackScale] = useState(1);

  const triggerFeedback = () => {
    setFeedbackScale(0.985);
    window.setTimeout(() => setFeedbackScale(1), 140);
  };

  const handlePrevious = () => {
    triggerFeedback();
    onPrevious();
  };

  const handleNext = () => {
    triggerFeedback();
    onNext();
  };

  useEffect(() => {
    if (activeIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowUp") {
        onPrevious();
      }
      if (event.key === "ArrowDown") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, onClose, onNext, onPrevious]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const updateProgress = () => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) {
        setVideoProgress(0);
        return;
      }

      setVideoProgress(Math.min(1, video.currentTime / duration));
    };

    const handleEnded = () => {
      onNext();
    };

    updateProgress();
    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", updateProgress);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", updateProgress);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeVideo?.id, onNext]);

  if (!activeVideo || !activeVideo.videoUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[94] bg-black/95 backdrop-blur-md" onClick={onClose}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(37,99,235,0.18),transparent_38%)]" />
      <div className="absolute inset-x-0 top-0 z-10 px-4 py-4">
        <div className="mb-4 flex gap-1.5">
          {videos.map((video, index) => (
            <div key={video.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/16">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-150 ease-linear"
                style={{
                  width:
                    index < (activeIndex ?? -1)
                      ? "100%"
                      : index === activeIndex
                        ? `${videoProgress * 100}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[800] uppercase tracking-[0.14em] text-white/78 backdrop-blur-md">
            Reels viewer
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm"
            aria-label="Închide reel"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative flex h-full w-full items-center justify-center px-4 py-20" onClick={(event) => event.stopPropagation()}>
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Reel anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="relative w-full max-w-[430px] overflow-hidden rounded-[34px] bg-[#020617] shadow-[0_28px_80px_rgba(0,0,0,0.42)] ring-1 ring-white/10 transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scale(${feedbackScale})` }}
        >
          <div
            className="relative aspect-[0.62/1] w-full bg-black"
            onTouchStart={(event) => setTouchStartY(event.touches[0]?.clientY ?? null)}
            onTouchEnd={(event) => {
              if (touchStartY === null) {
                return;
              }

              const delta = (event.changedTouches[0]?.clientY ?? touchStartY) - touchStartY;
              setTouchStartY(null);

              if (delta > 50) {
                handlePrevious();
                return;
              }

              if (delta < -50) {
                handleNext();
              }
            }}
          >
            <video
              ref={videoRef}
              key={activeVideo.id}
              src={activeVideo.videoUrl}
              className="h-full w-full object-cover"
              autoPlay
              muted={false}
              playsInline
              controls
              preload="auto"
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.10)_0%,rgba(2,6,23,0.02)_34%,rgba(2,6,23,0.72)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-16">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-[800] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  Featured reel
                </span>
                <span className="rounded-full bg-white/14 px-3 py-1.5 text-[11px] font-[800] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {activeVideo.time}
                </span>
              </div>
              <div className="mt-3 text-[24px] font-[780] tracking-[-0.045em] text-white">{activeVideo.authorName}</div>
              <p className="mt-2 text-[15px] leading-[1.65] text-white/80">{activeVideo.caption}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/12 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {formatCompactCount(activeVideo.likes ?? 0)} likes
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {formatCompactCount(activeVideo.comments)} comments
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {formatCompactCount(activeVideo.shares)} shares
                </span>
              </div>
              <div className="mt-3 text-[12px] font-[700] uppercase tracking-[0.14em] text-white/58">
                Swipe up for next reel
              </div>
            </div>
            <button onClick={handlePrevious} className="absolute inset-x-0 top-0 h-1/3" aria-label="Reel anterior" />
            <button onClick={handleNext} className="absolute inset-x-0 bottom-0 h-1/3" aria-label="Reel următor" />
          </div>

          <div className="border-t border-white/10 bg-[#050b16] px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] font-[700] text-white">Short-form video, fullscreen</div>
                <div className="mt-1 text-[13px] leading-[1.55] text-white/60">
                  Navighează vertical între clipuri, cu preload pregătit pentru următorul item.
                </div>
              </div>
              <button className="rounded-full bg-white px-4 py-2 text-[13px] font-[760] text-[#0f172a] transition-transform active:scale-[0.98]">
                Reply
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Reel următor"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {nextVideo?.videoUrl ? (
        <video key={`preload-${nextVideo.id}`} src={nextVideo.videoUrl} preload="auto" className="hidden" muted playsInline />
      ) : null}
    </div>
  );
}

function HighlightViewer({
  highlights,
  activeHighlight,
  onClose,
  onSelect,
  onPrevious,
  onNext,
}: {
  highlights: Array<{
    id: string;
    title: string;
    image: string;
    status: string;
    preview: string;
    isPinned?: boolean;
    isFavorite?: boolean;
  }>;
  activeHighlight:
    | {
        id: string;
        title: string;
        image: string;
        status: string;
        preview: string;
        isPinned?: boolean;
        isFavorite?: boolean;
      }
    | null;
  onClose: () => void;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [feedbackScale, setFeedbackScale] = useState(1);
  const activeIndex = activeHighlight ? highlights.findIndex((item) => item.id === activeHighlight.id) : -1;
  const nextHighlight = activeIndex >= 0 ? highlights[(activeIndex + 1) % highlights.length] : null;

  const triggerFeedback = () => {
    setFeedbackScale(0.985);
    window.setTimeout(() => setFeedbackScale(1), 120);
  };

  const handlePrevious = () => {
    triggerFeedback();
    onPrevious();
  };

  const handleNext = () => {
    triggerFeedback();
    onNext();
  };

  useEffect(() => {
    if (!activeHighlight) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
      if (event.key === "ArrowLeft") {
        onPrevious();
      }
      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeHighlight, onClose, onNext, onPrevious]);

  useEffect(() => {
    if (!activeHighlight) {
      return;
    }

    const durationMs = 4200;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const nextProgress = Math.min(1, (now - startedAt) / durationMs);
      setProgress(nextProgress);

      if (nextProgress >= 1) {
        onNext();
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [activeHighlight, onNext]);

  useEffect(() => {
    if (!nextHighlight) {
      return;
    }

    const preloadImage = new window.Image();
    preloadImage.src = nextHighlight.image;
  }, [nextHighlight]);

  if (!activeHighlight) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[93] bg-[#05070c]/92 backdrop-blur-xl" onClick={onClose}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,120,255,0.18),transparent_35%)]" />
      <div className="absolute inset-x-0 top-0 z-10 px-4 py-4">
        <div className="mb-4 flex gap-1.5">
          {highlights.map((highlight, index) => (
            <div key={highlight.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/16">
              <div
                className="h-full rounded-full bg-white transition-[width] duration-150 ease-linear"
                style={{
                  width:
                    index < activeIndex
                      ? "100%"
                      : index === activeIndex
                        ? `${progress * 100}%`
                        : "0%",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
          <span className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.14em] text-white/75 backdrop-blur-md">
            Highlight viewer
          </span>
          <span className="rounded-full bg-white/10 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.14em] text-white/75 backdrop-blur-md">
            {activeHighlight.status}
          </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white backdrop-blur-md"
            aria-label="Închide highlight"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        className="relative flex h-full w-full items-center justify-center px-4 pb-8 pt-24"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Highlight anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div
          className="relative w-full max-w-[420px] overflow-hidden rounded-[34px] bg-white/8 shadow-[0_28px_80px_rgba(0,0,0,0.34)] ring-1 ring-white/10 backdrop-blur-md transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `scale(${feedbackScale})` }}
        >
          <div
            className="relative aspect-[0.78/1] w-full overflow-hidden bg-[#0f172a]"
            onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
            onTouchEnd={(event) => {
              if (touchStartX === null) {
                return;
              }

              const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
              setTouchStartX(null);

              if (delta > 45) {
                handlePrevious();
                return;
              }

              if (delta < -45) {
                handleNext();
              }
            }}
          >
            {!viewerLoaded ? <ShimmerBlock className="absolute inset-0" /> : null}
            <Image
              src={activeHighlight.image}
              alt={activeHighlight.title}
              fill
              sizes="(max-width: 640px) 92vw, 420px"
              className={`object-cover transition duration-500 ${viewerLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setViewerLoaded(true)}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.18)_40%,rgba(0,0,0,0.68)_100%)]" />
            <div className="absolute left-4 top-4 flex items-center gap-2">
              {activeHighlight.isPinned ? (
                <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#0f172a]">
                  Pinned
                </span>
              ) : null}
              {activeHighlight.isFavorite ? (
                <span className="flex items-center gap-1 rounded-full bg-white/14 px-2.5 py-1 text-[11px] font-[800] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  <Star className="h-3.5 w-3.5 fill-current text-[#f59e0b]" strokeWidth={1.8} />
                  Favorite
                </span>
              ) : null}
            </div>
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-14">
              <div className="text-[26px] font-[780] tracking-[-0.05em] text-white">{activeHighlight.title}</div>
              <p className="mt-2 text-[15px] leading-[1.65] text-white/78">{activeHighlight.preview}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-white/12 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  24 new views
                </span>
                <span className="rounded-full bg-white/12 px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  8 replies
                </span>
              </div>
            </div>
            <button
              onClick={handlePrevious}
              className="absolute inset-y-0 left-0 w-1/3"
              aria-label="Highlight anterior"
            />
            <button
              onClick={handleNext}
              className="absolute inset-y-0 right-0 w-1/3"
              aria-label="Highlight următor"
            />
          </div>

          <div className="border-t border-white/10 bg-[#0b1020]/88 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[14px] font-[700] text-white">Entry point pentru conversație</div>
                <div className="mt-1 text-[13px] leading-[1.55] text-white/65">
                  Highlight-ul acesta funcționează ca punct rapid de context pentru profil.
                </div>
              </div>
              <button className="rounded-full bg-white px-4 py-2 text-[13px] font-[760] text-[#0f172a] transition-transform active:scale-[0.98]">
                Reply
              </button>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
              {highlights.map((highlight, index) => (
                <button
                  key={highlight.id}
                  onClick={() => onSelect(index)}
                  className={`flex min-w-[104px] items-center gap-2 rounded-[18px] px-3 py-2 text-left text-[12px] font-[700] uppercase tracking-[0.08em] ${
                    activeHighlight.id === highlight.id ? "bg-white text-[#0f172a]" : "bg-white/10 text-white/72"
                  }`}
                >
                  <div className="relative h-9 w-9 overflow-hidden rounded-xl bg-white/10">
                    <Image src={highlight.image} alt={highlight.title} fill sizes="36px" className="object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate">{highlight.title}</div>
                    <div className={`mt-0.5 truncate text-[10px] font-[700] tracking-[0.1em] ${activeHighlight.id === highlight.id ? "text-[#64748b]" : "text-white/55"}`}>
                      {highlight.status}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-md transition-transform active:scale-[0.96]"
          aria-label="Highlight următor"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function ShimmerBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-[linear-gradient(110deg,rgba(226,232,240,0.9)_8%,rgba(248,250,252,1)_18%,rgba(226,232,240,0.9)_33%)] bg-[length:200%_100%] ${className}`}
      style={{ animation: "profile-shimmer 1.6s linear infinite" }}
    />
  );
}

function SocialProofRow({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[14px] font-[700] text-[#0f172a]">{title}</div>
        <div className="rounded-full bg-white px-3 py-1.5 text-[12px] font-[800] uppercase tracking-[0.12em] text-[#2563eb] shadow-sm">
          {value}
        </div>
      </div>
      <p className="mt-2 text-[13px] leading-[1.55] text-[#64748b]">{description}</p>
    </div>
  );
}

function FeaturedMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white/10 px-3 py-3 backdrop-blur-md">
      <div className="text-[17px] font-[780] tracking-[-0.03em] text-white">{value}</div>
      <div className="mt-1 text-[11px] font-[700] uppercase tracking-[0.12em] text-white/65">{label}</div>
    </div>
  );
}

function FeaturedMetricLight({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] bg-white px-3 py-3 shadow-[0_10px_22px_rgba(15,23,42,0.06)]">
      <div className="text-[17px] font-[780] tracking-[-0.03em] text-[#0f172a]">{value}</div>
      <div className="mt-1 text-[11px] font-[700] uppercase tracking-[0.12em] text-[#94a3b8]">{label}</div>
    </div>
  );
}

function formatCompactCount(value: number) {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1).replace(".0", "")}M`;
  }

  if (value >= 1000) {
    return `${(value / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return `${value}`;
}

function ProfilePostCard({
  post,
  variant,
  title,
  animationDelay,
}: {
  post: Post;
  variant: "featured" | "recent";
  title: string;
  animationDelay?: string;
}) {
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyDraft, setReplyDraft] = useState("");
  const insight = PROFILE_POST_INSIGHTS[post.id] ?? {
    badge: "New reply activity" as const,
    summary: "Postarea are activitate nouă și merită împinsă spre comentarii.",
    topComment: "Interesant. Aș vrea să aflu mai mult context aici.",
    topCommentAuthor: "Un follower",
    replyCta: "Adaugă comentariu",
  };

  return (
    <section
      className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_48px_rgba(15,23,42,0.10)] profile-reveal transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(15,23,42,0.13)] active:scale-[0.992]"
      style={animationDelay ? { animationDelay } : undefined}
    >
      <div className="border-b border-[#edf2f7] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.16em] text-[#7c8aa5]">
              {variant === "featured" ? (
                <>
                  <Pin className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.3} />
                  Featured post
                </>
              ) : (
                <>
                  <Radio className="h-3.5 w-3.5 text-[#2f7dff]" strokeWidth={2.3} />
                  Recent post
                </>
              )}
            </div>
            <div className="mt-1 text-[15px] font-[700] tracking-[-0.02em] text-[#0f172a]">{title}</div>
          </div>
          <div className="rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#64748b]">
            {post.time}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="rounded-full bg-[#eef4ff] px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#2563eb]">
            {insight.badge}
          </button>
          <button className="rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[700] uppercase tracking-[0.12em] text-[#64748b]">
            Shareable
          </button>
        </div>
      </div>
      <div className="border-b border-[#edf2f7] bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-[700] uppercase tracking-[0.14em] text-[#7c8aa5]">
              {insight.badge}
            </div>
            <p className="mt-1 text-[14px] leading-[1.55] text-[#64748b]">{insight.summary}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[750] text-[#0f172a] shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <MessageCircle className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />
                {formatCompactCount(post.comments)} replies active
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[750] text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <Sparkles className="h-4 w-4 text-[#7c3aed]" strokeWidth={2.1} />
                {formatCompactCount(post.shares)} shares
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f8fafc] px-3 py-2 text-[12px] font-[750] text-[#475569] shadow-[0_8px_20px_rgba(15,23,42,0.05)]">
                <HeartHandshake className="h-4 w-4 text-[#ef4444]" strokeWidth={2.1} />
                {formatCompactCount(post.likes ?? 0)} likes
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsReplyOpen((current) => !current)}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[linear-gradient(135deg,#2f7dff_0%,#1858f2_100%)] px-4 py-2.5 text-[12px] font-[800] uppercase tracking-[0.12em] text-white shadow-[0_12px_22px_rgba(37,99,235,0.22)] transition-transform active:scale-[0.98]"
          >
            <MessageSquareText className="h-4 w-4" strokeWidth={2.1} />
            {insight.replyCta}
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-[24px] border border-[#e4ecf5] bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] shadow-[0_14px_28px_rgba(15,23,42,0.05)]">
          <div className="flex items-center justify-between gap-3 border-b border-[#edf2f7] px-4 py-3">
            <div className="flex items-center gap-2 text-[12px] font-[700] uppercase tracking-[0.14em] text-[#7c8aa5]">
              <MessageSquareText className="h-4 w-4 text-[#2563eb]" strokeWidth={2.1} />
              Top comment
            </div>
            <button
              onClick={() => setIsReplyOpen(true)}
              className="rounded-full bg-white px-3 py-1.5 text-[11px] font-[800] uppercase tracking-[0.12em] text-[#2563eb] shadow-[0_8px_18px_rgba(37,99,235,0.10)] transition-transform active:scale-[0.98]"
            >
              Reply direct
            </button>
          </div>
          <div className="px-4 py-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#dbeafe_0%,#eff6ff_100%)] text-[14px] font-[800] uppercase tracking-[0.04em] text-[#2563eb]">
                {insight.topCommentAuthor
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-[14px] font-[760] text-[#0f172a]">{insight.topCommentAuthor}</div>
                  <span className="rounded-full bg-[#eef4ff] px-2 py-1 text-[10px] font-[800] uppercase tracking-[0.12em] text-[#2563eb]">
                    Top reply
                  </span>
                </div>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{insight.topComment}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] font-[700] text-[#64748b]">
                  <span className="rounded-full bg-[#f8fafc] px-3 py-1.5">Liked by 18</span>
                  <span className="rounded-full bg-[#f8fafc] px-3 py-1.5">Recent activity</span>
                  <button
                    onClick={() => setIsReplyOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full bg-transparent px-1 py-1 text-[#2563eb]"
                  >
                    Continue thread
                    <MoveUpRight className="h-3.5 w-3.5" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isReplyOpen ? (
          <div className="mt-4 rounded-[22px] bg-[#eef4ff] px-4 py-4">
            <div className="text-[13px] font-[700] uppercase tracking-[0.14em] text-[#2563eb]">Quick reply</div>
            <textarea
              value={replyDraft}
              onChange={(event) => setReplyDraft(event.target.value)}
              placeholder="Scrie un comentariu care pornește conversația..."
              className="mt-3 min-h-[92px] w-full resize-none rounded-[18px] border border-[#dbe7fb] bg-white px-4 py-3 text-[14px] text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="text-[13px] font-[600] text-[#64748b]">Comentariile bune cresc vizibilitatea în profil.</span>
              <button
                onClick={() => {
                  setReplyDraft("");
                  setIsReplyOpen(false);
                }}
                disabled={!replyDraft.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-4 py-2.5 text-[13px] font-[760] text-white transition-transform active:scale-[0.98] disabled:opacity-40"
              >
                <Send className="h-4 w-4" strokeWidth={2.1} />
                Trimite
              </button>
            </div>
          </div>
        ) : null}
      </div>
      <FeedPost post={post} />
    </section>
  );
}

function TabButton({
  id,
  current,
  set,
  label,
  icon,
}: {
  id: string;
  current: string;
  set: (value: string) => void;
  label: string;
  icon?: React.ReactNode;
}) {
  const isActive = current === id;

  return (
    <button
      onClick={() => {
        startTransition(() => {
          set(id);
        });
      }}
      className={`flex items-center justify-center gap-1.5 rounded-[18px] px-3 py-3 text-[13px] font-[720] tracking-[-0.02em] transition-all ${
        isActive ? "bg-[#0f172a] text-white shadow-[0_12px_22px_rgba(15,23,42,0.16)]" : "text-[#64748b]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function InsightCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
      <div className="flex items-center gap-2 text-[14px] font-[700] text-[#0f172a]">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-[14px] leading-[1.6] text-[#64748b]">{description}</p>
    </div>
  );
}

function SmartInfoCard({
  title,
  eyebrow,
  items,
  accent,
}: {
  title: string;
  eyebrow: string;
  items: string[];
  accent: "blue" | "violet";
}) {
  const accentClass =
    accent === "blue"
      ? "bg-[linear-gradient(135deg,#eff6ff_0%,#f8fafc_100%)] text-[#2563eb]"
      : "bg-[linear-gradient(135deg,#f5f3ff_0%,#f8fafc_100%)] text-[#7c3aed]";

  return (
    <div className="rounded-[24px] bg-[#f8fafc] p-4">
      <div className={`inline-flex rounded-full px-3 py-1.5 text-[11px] font-[800] uppercase tracking-[0.14em] ${accentClass}`}>
        {eyebrow}
      </div>
      <div className="mt-3 text-[17px] font-[760] tracking-[-0.03em] text-[#0f172a]">{title}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white px-3 py-2 text-[13px] font-[680] tracking-[-0.015em] text-[#334155] shadow-[0_8px_20px_rgba(15,23,42,0.05)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function MiniFeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[22px] bg-[#f8fafc] px-4 py-4">
      <div className="flex items-center gap-2 text-[14px] font-[700] text-[#0f172a]">
        {icon}
        {title}
      </div>
      <p className="mt-2 text-[13px] leading-[1.55] text-[#64748b]">{description}</p>
    </div>
  );
}

function InfoRow({
  icon,
  text,
  highlight,
  isLink,
}: {
  icon: React.ReactElement<{ className?: string }>;
  text: string;
  highlight?: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-[15px] text-[#334155]">
      <div className="rounded-full bg-[#f1f5f9] p-2 text-[#94a3b8]">
        {React.cloneElement(icon, { className: "h-5 w-5 stroke-[1.8]" })}
      </div>
      <span>
        {text}
        {highlight ? (
          <span className={`font-[700] ${isLink ? "cursor-pointer text-[#2563eb] hover:underline" : ""}`}>{highlight}</span>
        ) : null}
      </span>
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
