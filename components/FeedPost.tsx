"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  MoreHorizontal, X,
  Camera, Smile, Send, Sparkles, Bookmark, Link2, Flag, ImagePlus
} from 'lucide-react';
import DezbatereModal from './DezbatereModal';
import AiAnalysisModal from './AiAnalysisModal';

const HOME_REELS_SOUND_KEY = 'home-reels-sound-enabled';
const HOME_REELS_SOUND_EVENT = 'home-reels-sound-changed';

export interface Post {
  id: string;
  type?: 'post' | 'reel';
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  time: string;
  location?: string;
  caption: string;
  hasMoreText?: boolean;
  hashtags?: string;
  tags?: Array<{ id: string; label: string }>;
  isFakeNews?: boolean;
  likes: number;
  likesText?: string;
  comments: number;
  shares: number;
  imageUrl?: string;
  videoUrl?: string;
}

interface FeedPostProps {
  post: Post;
}

export default function FeedPost({ post }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoveAnimating, setIsLoveAnimating] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [commentCount, setCommentCount] = useState<number>(post.comments);
  const [shareCount, setShareCount] = useState<number>(post.shares);
  const [commentText, setCommentText] = useState('');
  const [commentAttachmentName, setCommentAttachmentName] = useState('');
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [homeReelsSoundEnabled, setHomeReelsSoundEnabled] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [isPostMenuOpen, setIsPostMenuOpen] = useState(false);
  const [isShareSheetOpen, setIsShareSheetOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isFullTextExpanded, setIsFullTextExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isCommentComposerOpen, setIsCommentComposerOpen] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentAttachmentInputRef = useRef<HTMLInputElement>(null);
  
  // Modals state
  const [isDezbatereOpen, setIsDezbatereOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const syncSoundPreference = () => {
      setHomeReelsSoundEnabled(window.localStorage.getItem(HOME_REELS_SOUND_KEY) === 'true');
    };

    syncSoundPreference();
    window.addEventListener(HOME_REELS_SOUND_EVENT, syncSoundPreference);

    return () => {
      window.removeEventListener(HOME_REELS_SOUND_EVENT, syncSoundPreference);
    };
  }, []);

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setToastMessage('');
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [toastMessage]);

  useEffect(() => {
    if (!post.videoUrl) {
      return;
    }

    const element = articleRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoActive(entry.isIntersecting && entry.intersectionRatio >= 0.6);
      },
      {
        threshold: [0.25, 0.6, 0.85],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [post.videoUrl]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !post.videoUrl) {
      return;
    }

    if (isVideoActive) {
      video.muted = !homeReelsSoundEnabled;
      void video.play().catch(() => {
        // Ignore autoplay interruption in preview mode.
      });
      return;
    }

    video.pause();
  }, [homeReelsSoundEnabled, isVideoActive, post.videoUrl]);

  const handleEnableHomeReelSound = () => {
    setHomeReelsSoundEnabled(true);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HOME_REELS_SOUND_KEY, 'true');
      window.dispatchEvent(new Event(HOME_REELS_SOUND_EVENT));
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = false;
    void video.play().catch(() => {
      // Ignore playback interruption after explicit user gesture.
    });
  };

  const handleDisableHomeReelSound = () => {
    setHomeReelsSoundEnabled(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(HOME_REELS_SOUND_KEY, 'false');
      window.dispatchEvent(new Event(HOME_REELS_SOUND_EVENT));
    }

    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = true;
  };

  const handleLike = () => {
    setIsLoveAnimating(true);
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    // Tracking analytics mock
    if (!isLiked) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'POST_LIKE', postId: post.id, timestamp: new Date().toISOString() })
      }).catch(() => {});
    }
  };

  useEffect(() => {
    if (!isLoveAnimating) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsLoveAnimating(false);
    }, 280);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isLoveAnimating]);

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const focusCommentComposer = () => {
    setIsCommentComposerOpen(true);
  };

  useEffect(() => {
    if (!isCommentComposerOpen) {
      return;
    }

    const timeout = window.setTimeout(() => {
      commentInputRef.current?.focus();
      commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 20);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isCommentComposerOpen]);

  const buildPostShareUrl = () => {
    if (typeof window === 'undefined') {
      return `/posts/${post.id}`;
    }

    return `${window.location.origin}/posts/${post.id}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = buildPostShareUrl();

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      }
      setShareCount((prev) => prev + 1);
      setIsShareSheetOpen(false);
      setIsPostMenuOpen(false);
      showToast('Linkul postării a fost copiat.');
    } catch {
      showToast('Copierea linkului nu este disponibilă pe acest dispozitiv.');
    }
  };

  const handleQuickShare = async (destination: 'feed' | 'messenger') => {
    setShareCount((prev) => prev + 1);
    setIsShareSheetOpen(false);
    showToast(
      destination === 'feed'
        ? 'Postarea a fost distribuită în feed-ul tău.'
        : 'Postarea este pregătită pentru trimitere în mesaje.'
    );
  };

  const handleHidePost = () => {
    setIsHidden(true);
    setIsPostMenuOpen(false);
  };

  const handleRestorePost = () => {
    setIsHidden(false);
  };

  const handleSavePost = () => {
    setIsSaved(true);
    setIsPostMenuOpen(false);
    showToast('Postarea a fost salvată.');
  };

  const handleReportPost = () => {
    setIsPostMenuOpen(false);
    showToast('Mulțumim. Postarea a fost trimisă pentru revizuire.');
  };

  const handleCommentAttachmentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setCommentAttachmentName(file.name);
    focusCommentComposer();
    showToast('Imaginea a fost atașată comentariului.');
    event.target.value = '';
  };

  const handleQuickReaction = (emoji: string) => {
    setCommentText((prev) => `${prev}${emoji}`);
    focusCommentComposer();
  };

  const submitComment = () => {
    if (!commentText.trim() && !commentAttachmentName) return;

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'POST_COMMENT',
        postId: post.id,
        text: commentText,
        attachmentName: commentAttachmentName || undefined,
        timestamp: new Date().toISOString()
      })
    }).catch(() => {});

    setCommentCount((prev) => prev + 1);
    setCommentText('');
    setCommentAttachmentName('');
    showToast('Comentariul a fost adăugat.');
  };

  const collapsedCaption =
    post.hasMoreText && !isFullTextExpanded && post.caption.length > 180
      ? `${post.caption.slice(0, 180).trimEnd()}...`
      : post.caption;
  const hasMedia = Boolean(post.imageUrl || post.videoUrl);
  const postMomentumLabel = getPostMomentumLabel(likeCount, commentCount, shareCount);

  if (isHidden) {
    return (
      <article className="mx-3 mt-3 rounded-2xl bg-white px-4 py-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[15px] font-semibold text-[#050505]">Ai ascuns această postare.</div>
            <div className="mt-1 text-[14px] text-[#65676b]">Nu o vei mai vedea în feed până când alegi să o restaurezi.</div>
          </div>
          <button onClick={handleRestorePost} className="text-[14px] font-semibold text-[#1877F2] hover:underline">
            Anulează
          </button>
        </div>
      </article>
    );
  }

  return (
    <>
      <article ref={articleRef} className="w-full bg-white relative">
        
        {/* HEADER */}
        <div className="flex items-start justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <img 
              src={post.authorAvatar} 
              className="w-10 h-10 rounded-full object-cover border border-black/5"
              alt={post.authorName}
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1 leading-tight">
                <span className="text-[15px] font-semibold text-[#1c1e21] tracking-[-0.01em]">{post.authorName}</span>
                {post.isVerified && (
                  <VerifiedBadge />
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[13px] text-[#65676b] leading-none">
                <span className="hover:underline cursor-pointer">{post.time}</span>
                <span>·</span>
                <EarthStatusIcon />
                <span>{postMomentumLabel}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <button
              onClick={() => setIsPostMenuOpen(true)}
              className="p-2 text-[#65676b] hover:bg-gray-100 rounded-full transition-colors -m-2"
              aria-label="Deschide meniul postării"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={handleHidePost}
              className="p-2 text-[#65676b] hover:bg-gray-100 rounded-full transition-colors -m-2"
              aria-label="Ascunde postarea"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="px-4 pb-3">
          <p className="text-[15px] text-[#1a1d21] leading-[1.48] whitespace-pre-wrap">
            {collapsedCaption}
            {post.hasMoreText && (
              <button
                onClick={() => setIsFullTextExpanded((value) => !value)}
                className="pl-1 text-[15px] font-semibold text-[#65676b] hover:underline"
              >
                {isFullTextExpanded ? 'Vezi mai puțin' : 'Vezi mai mult'}
              </button>
            )}
          </p>
        </div>

        {/* MEDIA */}
        {post.videoUrl ? (
          <div className="w-full bg-black">
            <div className="relative h-[min(78vh,720px)] w-full overflow-hidden bg-black">
            <video
              ref={videoRef}
              src={post.videoUrl}
              className="h-full w-full object-cover object-center"
              controls={showVideoControls}
              muted={!homeReelsSoundEnabled}
              autoPlay
              loop
              playsInline
              preload="metadata"
              onClick={() => setShowVideoControls((value) => !value)}
            />
              <button
                onClick={homeReelsSoundEnabled ? handleDisableHomeReelSound : handleEnableHomeReelSound}
                className="absolute right-3 top-3 rounded-full bg-black/55 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm"
              >
                {homeReelsSoundEnabled ? 'Sunet activ' : 'Activează sunetul'}
              </button>
            </div>
          </div>
        ) : post.imageUrl ? (
          <div className="w-full bg-gray-100">
            <button
              onClick={() => setIsImageViewerOpen(true)}
              className="block w-full cursor-zoom-in"
              aria-label="Deschide imaginea"
            >
              <img 
                src={post.imageUrl} 
                alt="Post image"
                className="w-full h-auto object-cover"
              />
            </button>
          </div>
        ) : null}

        <div className={`px-4 ${hasMedia ? 'py-3' : 'pt-1 pb-3'}`}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-5 overflow-x-auto no-scrollbar text-[#65676b]">
              <InlineStatButton
                icon={<InstagramLoveIcon active={isLiked} animate={isLoveAnimating} />}
                value={likeCount}
                label="Ador"
                onClick={handleLike}
                isActive={isLiked}
              />
              <InlineStatButton
                icon={<FacebookCommentIcon />}
                value={commentCount}
                label="Comentează"
                onClick={focusCommentComposer}
              />
              <InlineStatButton
                icon={<FacebookShareIcon />}
                value={shareCount}
                label="Distribuie"
                onClick={() => setIsShareSheetOpen(true)}
              />
              <InlineStatButton
                icon={<DebateSearchIcon />}
                value={Math.max(1, Math.floor(commentCount / 3))}
                label="Dezbatere"
                onClick={() => setIsDezbatereOpen(true)}
                hideValue
              />
              <InlineStatButton
                icon={<Sparkles className="h-[22px] w-[22px] text-[#65676b]" strokeWidth={1.9} />}
                value={Math.max(1, Math.floor(likeCount / 8))}
                label="Analiză AI"
                onClick={() => setIsAiOpen(true)}
                hideValue
              />
            </div>

            <button
              onClick={handleSavePost}
              className="flex shrink-0 items-center text-[#65676b]"
              aria-label="Salvează postarea"
            >
              <Bookmark className={`h-[22px] w-[22px] ${isSaved ? 'fill-current text-[#050505]' : 'text-[#65676b]'}`} strokeWidth={1.9} />
            </button>
          </div>
        </div>

        {/* COMMENT INPUT */}
        {isCommentComposerOpen ? (
          <div className="px-4 py-2 flex items-start gap-2">
            <img 
              src="https://i.pravatar.cc/150?u=current_user" 
              className="w-8 h-8 rounded-full object-cover border border-black/5 mt-1"
              alt="You"
            />
            <div className="flex-1 min-h-[40px] bg-[#F0F2F5] rounded-2xl flex items-center px-3 gap-2">
              <input 
                ref={commentInputRef}
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Scrie un comentariu..."
                className="flex-1 bg-transparent text-[#050505] text-[15px] placeholder-[#65676b] outline-none"
              />
              {commentAttachmentName ? (
                <span className="rounded-full bg-white px-2 py-1 text-[12px] font-semibold text-[#1877F2]">
                  {commentAttachmentName}
                </span>
              ) : null}
              <div className="flex items-center gap-2 text-[#65676b]">
                {!commentText.trim() ? (
                  <>
                    <button onClick={() => handleQuickReaction('😊')} className="rounded-full p-1 hover:bg-white" aria-label="Adaugă emoji">
                      <Smile className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => commentAttachmentInputRef.current?.click()}
                      className="rounded-full p-1 hover:bg-white"
                      aria-label="Atașează o imagine"
                    >
                      <Camera className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button onClick={submitComment} className="text-[#1877F2] p-1">
                    <Send className="w-5 h-5 fill-current" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
        <input
          ref={commentAttachmentInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCommentAttachmentSelect}
        />

      </article>

      {/* Modals */}
      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={post.id} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={post.id} />
      <ActionSheet
        isOpen={isPostMenuOpen}
        title="Opțiuni pentru postare"
        onClose={() => setIsPostMenuOpen(false)}
        actions={[
          { icon: <Bookmark className="h-5 w-5" />, label: 'Salvează postarea', description: 'O găsești rapid mai târziu.', onClick: handleSavePost },
          { icon: <Link2 className="h-5 w-5" />, label: 'Copiază linkul', description: 'Trimite postarea mai departe.', onClick: handleCopyLink },
          { icon: <Flag className="h-5 w-5" />, label: 'Raportează postarea', description: 'Semnalează conținut nepotrivit.', onClick: handleReportPost },
        ]}
      />
      <ActionSheet
        isOpen={isShareSheetOpen}
        title="Distribuie"
        onClose={() => setIsShareSheetOpen(false)}
        actions={[
          { icon: <FacebookShareIcon className="h-5 w-5" />, label: 'Distribuie acum', description: 'Publică imediat în feed-ul tău.', onClick: () => void handleQuickShare('feed') },
          { icon: <Send className="h-5 w-5" />, label: 'Trimite în mesaje', description: 'Pregătește postarea pentru conversații.', onClick: () => void handleQuickShare('messenger') },
          { icon: <ImagePlus className="h-5 w-5" />, label: 'Copiază linkul', description: 'Îl poți lipi oriunde ai nevoie.', onClick: () => void handleCopyLink() },
        ]}
      />
      <ImageViewer
        isOpen={isImageViewerOpen}
        imageUrl={post.imageUrl}
        authorName={post.authorName}
        authorAvatar={post.authorAvatar}
        time={post.time}
        onClose={() => setIsImageViewerOpen(false)}
      />
      {toastMessage ? (
        <div className="fixed inset-x-0 bottom-24 z-[95] flex justify-center px-4">
          <div className="rounded-full bg-[#1C1E21] px-4 py-2 text-[13px] font-semibold text-white shadow-xl">
            {toastMessage}
          </div>
        </div>
      ) : null}
      <style jsx global>{`
        @keyframes instagram-heart-pop {
          0% {
            transform: translateY(0) scale(1);
          }
          35% {
            transform: translateY(-4px) scale(1.18);
          }
          100% {
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
}

function getPostMomentumLabel(likes: number, comments: number, shares: number) {
  const score = likes + comments * 3 + shares * 5;

  if (score >= 220) {
    return 'Postare virală';
  }

  if (score >= 90) {
    return 'Postare în ascensiune';
  }

  return 'Postare recentă';
}

function InlineStatButton({
  icon,
  value,
  label,
  onClick,
  isActive,
  hideValue,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  hideValue?: boolean;
}) {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center gap-1 whitespace-nowrap transition-colors ${isActive ? 'text-[#ff4d67]' : 'text-[#65676b]'}`}
      aria-label={label}
    >
      {icon}
      {hideValue ? null : <span className="text-[16px] font-normal tracking-tight">{value}</span>}
    </button>
  );
}

function EarthStatusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[13px] w-[13px]" fill="none" aria-hidden="true">
      <path
        d="M12 2.8c5.08 0 9.2 4.12 9.2 9.2 0 5.08-4.12 9.2-9.2 9.2-5.08 0-9.2-4.12-9.2-9.2 0-5.08 4.12-9.2 9.2-9.2Z"
        stroke="#2F9BF2"
        strokeWidth="1.15"
      />
      <path
        d="M12 2.8c2.12 0 3.83 4.12 3.83 9.2s-1.71 9.2-3.83 9.2-3.83-4.12-3.83-9.2S9.88 2.8 12 2.8Z"
        stroke="#2F9BF2"
        strokeWidth="1.1"
      />
      <path
        d="M12 2.8c3.55 0 6.43 4.12 6.43 9.2S15.55 21.2 12 21.2 5.57 17.08 5.57 12 8.45 2.8 12 2.8Z"
        stroke="#2F9BF2"
        strokeWidth="1.1"
      />
      <path d="M2.8 12h18.4" stroke="#2F9BF2" strokeWidth="1.1" />
      <path d="M4.3 7.35c2.22 1.08 4.9 1.65 7.7 1.65 2.8 0 5.48-.57 7.7-1.65" stroke="#2F9BF2" strokeWidth="1.1" />
      <path d="M4.3 16.65C6.52 15.57 9.2 15 12 15c2.8 0 5.48.57 7.7 1.65" stroke="#2F9BF2" strokeWidth="1.1" />
    </svg>
  );
}

function InstagramLoveIcon({ active, animate }: { active?: boolean; animate?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-[24px] w-[24px] ${active ? 'text-[#cf2338]' : 'text-[#262626]'}`}
      fill="none"
      aria-hidden="true"
      style={{
        animation: animate ? 'instagram-heart-pop 280ms cubic-bezier(0.2, 0.9, 0.2, 1)' : undefined,
        transformOrigin: 'center',
      }}
    >
      <path
        d="M12 18.45c-.64 0-1.2-.23-1.74-.73L6.8 14.48c-1.52-1.42-2.3-2.87-2.3-4.73 0-2.3 1.67-3.95 3.9-3.95 1.55 0 2.77.78 3.6 2.1.83-1.32 2.05-2.1 3.6-2.1 2.23 0 3.9 1.65 3.9 3.95 0 1.86-.78 3.31-2.3 4.73l-3.46 3.24c-.54.5-1.1.73-1.74.73Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? 'currentColor' : 'none'}
      />
    </svg>
  );
}

function FacebookCommentIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px] text-[#65676b]" fill="none" aria-hidden="true">
      <path
        d="M20 11.2c0 4-3.6 7.2-8 7.2-1 0-2-.2-2.9-.5L5 20l1.1-3.5A6.8 6.8 0 0 1 4 11.2C4 7.2 7.6 4 12 4s8 3.2 8 7.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FacebookShareIcon({ className = 'h-[24px] w-[24px]' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`${className} text-[#65676b]`} fill="none" aria-hidden="true">
      <path
        d="M4.9 6.7H19.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.2 6.9 10.55 12.15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.8 7 13.2 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.55 12.15 13.2 19"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.55 12.15 18.2 7.45"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DebateSearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="none" aria-hidden="true">
      <path
        d="M4.6 13.2a7.4 7.4 0 0 1 14.8 0"
        stroke="#ff3b75"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="8.1" cy="10.1" r="1.55" fill="#7b5be8" />
      <circle cx="12" cy="11.15" r="1.45" fill="#20c9b5" />
      <circle cx="15.9" cy="10.1" r="1.55" fill="#ffd400" />
      <path
        d="M5.95 19.1c.18-2.1 1.2-4.25 3.35-4.25 1.9 0 2.88 1.4 2.88 3.24v1.01H5.95Z"
        fill="#7b5be8"
      />
      <path
        d="M9.8 19.1c.07-1.78 1.02-3.3 2.2-3.3s2.13 1.52 2.2 3.3H9.8Z"
        fill="#20c9b5"
      />
      <path
        d="M11.82 19.1c.18-2.02 1.2-4.02 3.2-4.02 1.76 0 2.67 1.27 2.93 3.08l-1.08 0c-.6.6-1.55.94-2.8.94h-2.25Z"
        fill="#ffd400"
      />
      <path
        d="M8.7 15.5 6.1 19.1"
        stroke="#7b5be8"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <div className="w-[14px] h-[14px] bg-[#1877F2] rounded-full flex items-center justify-center -ml-0.5 mt-0.5">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function ActionSheet({
  isOpen,
  title,
  actions,
  onClose,
}: {
  isOpen: boolean;
  title: string;
  actions: Array<{ icon: React.ReactNode; label: string; description: string; onClick: () => void | Promise<void> }>;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[92] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-3 shadow-[0_-12px_40px_rgba(0,0,0,0.16)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
        <div className="mb-3 text-[17px] font-bold text-[#050505]">{title}</div>
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => {
                void action.onClick();
              }}
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left hover:bg-[#F0F2F5]"
            >
              <div className="rounded-full bg-[#F0F2F5] p-3 text-[#050505]">{action.icon}</div>
              <div>
                <div className="text-[15px] font-semibold text-[#050505]">{action.label}</div>
                <div className="text-[13px] text-[#65676b]">{action.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ImageViewer({
  isOpen,
  imageUrl,
  authorName,
  authorAvatar,
  time,
  onClose,
}: {
  isOpen: boolean;
  imageUrl?: string;
  authorName: string;
  authorAvatar: string;
  time: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] bg-black/95 text-white">
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent px-4 py-4">
        <div className="flex items-center gap-3">
          <img src={authorAvatar} alt={authorName} className="h-10 w-10 rounded-full object-cover" />
          <div>
            <div className="text-sm font-bold">{authorName}</div>
            <div className="text-xs text-white/65">{time}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm hover:bg-white/15"
          aria-label="Închide imaginea"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <button onClick={onClose} className="absolute inset-0 cursor-zoom-out" aria-label="Închide imaginea" />

      <div className="relative flex h-full w-full items-center justify-center p-4 pt-20 pb-24">
        <img src={imageUrl} alt="Post image expanded" className="max-h-full max-w-full object-contain shadow-[0_24px_80px_rgba(0,0,0,0.45)]" />
      </div>
    </div>
  );
}
