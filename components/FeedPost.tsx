"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  MoreHorizontal, X, Globe2, ThumbsUp, MessageCircle, Share, 
  MessageSquare, Camera, Smile, Send, Scale, Sparkles
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
  tags?: any[];
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
  const [commentText, setCommentText] = useState('');
  const [showVideoControls, setShowVideoControls] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [homeReelsSoundEnabled, setHomeReelsSoundEnabled] = useState(false);
  const articleRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
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

  const submitComment = () => {
    if (!commentText.trim()) return;
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'POST_COMMENT', postId: post.id, text: commentText, timestamp: new Date().toISOString() })
    }).catch(() => {});
    setCommentText('');
  };

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
            <button className="p-2 text-[#65676b] hover:bg-gray-100 rounded-full transition-colors -m-2">
              <MoreHorizontal className="w-5 h-5" />
            </button>
            <button className="p-2 text-[#65676b] hover:bg-gray-100 rounded-full transition-colors -m-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TEXT CONTENT */}
        <div className="px-4 pb-3">
          <p className="text-[15px] text-[#050505] leading-[1.35] whitespace-pre-wrap">
            {post.caption}
            {post.hasMoreText && (
              <span className="text-[#65676b] font-semibold cursor-pointer text-[15px] pl-1 hover:underline">
                Vezi mai mult
              </span>
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
            <img 
              src={post.imageUrl} 
              alt="Post image"
              className="w-full h-auto object-cover"
            />
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
            <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <MessageCircle className="w-[18px] h-[18px] text-[#65676b]" strokeWidth={2} />
              <span>{post.comments}</span>
            </div>
            <div className="flex items-center gap-1.5 hover:underline cursor-pointer">
              <Share className="w-[18px] h-[18px] text-[#65676b]" strokeWidth={2} />
              <span>{post.shares}</span>
            </div>
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
          />
          <ActionBtn 
            icon={<Share className="w-5 h-5" />} 
            label="Distribuie" 
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
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              placeholder="Scrie un comentariu..."
              className="flex-1 bg-transparent text-[#050505] text-[15px] placeholder-[#65676b] outline-none"
            />
            <div className="flex items-center gap-2 text-[#65676b]">
              {!commentText.trim() ? (
                <>
                  <Smile className="w-5 h-5" />
                  <Camera className="w-5 h-5" />
                </>
              ) : (
                <button onClick={submitComment} className="text-[#1877F2] p-1">
                  <Send className="w-5 h-5 fill-current" />
                </button>
              )}
            </div>
          </div>
        </div>

      </article>

      {/* Modals */}
      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={post.id} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={post.id} />
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
