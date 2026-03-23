"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  MoreHorizontal, X, Globe2, ThumbsUp, MessageCircle, Share, 
  MessageSquare, Camera, Smile, Send, Scale, Sparkles, Bookmark, Link2, Flag, ImagePlus
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
  const [toastMessage, setToastMessage] = useState('');
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

  const showToast = (message: string) => {
    setToastMessage(message);
  };

  const focusCommentComposer = () => {
    commentInputRef.current?.focus();
    commentInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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
      <article ref={articleRef} className="w-full bg-white relative pb-1">
        
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
                <span className="font-bold text-[15px] text-[#050505] tracking-tight">{post.authorName}</span>
                {post.isVerified && (
                  <VerifiedBadge />
                )}
              </div>
              <div className="flex items-center gap-1 mt-0.5 text-[13px] text-[#65676b] leading-none">
                <span className="hover:underline cursor-pointer">{post.time}</span>
                <span>·</span>
                <Globe2 className="w-3 h-3 fill-current" />
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
          <p className="text-[15px] text-[#050505] leading-[1.35] whitespace-pre-wrap">
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

        {/* STATS ROW */}
        <div className="px-4 py-2.5 flex items-center justify-between text-[#65676b] text-[13px] sm:text-[14px]">
          <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
            <div className="flex items-center">
              <div className="w-[18px] h-[18px] bg-[#1877F2] rounded-full flex items-center justify-center p-[3px]">
                <ThumbsUp className="w-full h-full text-white fill-white" />
              </div>
            </div>
            <span>{post.likesText || formatNum(likeCount)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={focusCommentComposer}
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <MessageCircle className="w-[18px] h-[18px] text-[#65676b]" strokeWidth={2} />
              <span>{commentCount}</span>
            </button>
            <button
              onClick={() => setIsShareSheetOpen(true)}
              className="flex items-center gap-1.5 hover:underline cursor-pointer"
            >
              <Share className="w-[18px] h-[18px] text-[#65676b]" strokeWidth={2} />
              <span>{shareCount}</span>
            </button>
          </div>
        </div>

        <div className="px-3 border-t border-gray-300 mx-3"></div>

        {/* ACTION BUTTONS */}
        {/* Equal width flex items, font-semibold text-[#65676b] */}
        <div className="px-2 py-1 flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          
          <ActionBtn 
            icon={<ThumbsUp className={`w-5 h-5 ${isLiked ? 'text-[#1877F2] fill-current' : ''}`} />} 
            label="Îmi place" 
            isActive={isLiked}
            onClick={handleLike} 
          />
          <ActionBtn 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="Comentează" 
            onClick={focusCommentComposer}
          />
          <ActionBtn 
            icon={<Share className="w-5 h-5" />} 
            label="Distribuie" 
            onClick={() => setIsShareSheetOpen(true)}
          />
          <ActionBtn 
            icon={<Scale className="w-5 h-5" />} 
            label="Dezbatere" 
            onClick={() => setIsDezbatereOpen(true)}
          />
          <ActionBtn 
            icon={<Sparkles className="w-5 h-5" />} 
            label="Analiză AI" 
            onClick={() => setIsAiOpen(true)}
          />
          
        </div>

        <div className="px-3 border-t border-gray-300 mx-3 mb-2"></div>

        {/* COMMENT INPUT */}
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
          { icon: <Share className="h-5 w-5" />, label: 'Distribuie acum', description: 'Publică imediat în feed-ul tău.', onClick: () => void handleQuickShare('feed') },
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
    </>
  );
}

function ActionBtn({ icon, label, onClick, isActive }: { icon: React.ReactNode, label: string, onClick?: () => void, isActive?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-1.5 px-0.5 rounded-md hover:bg-[#F0F2F5] transition-colors whitespace-nowrap min-w-max ${isActive ? 'text-[#1877F2]' : 'text-[#65676b]'}`}
    >
      {icon}
      <span className="text-[12px] sm:text-[13px] font-semibold tracking-wide">{label}</span>
    </button>
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

function formatNum(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'mii';
  }
  return num.toString();
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
