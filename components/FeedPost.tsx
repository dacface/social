"use client";

import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquareMore, 
  Share2, 
  Scale, 
  Sparkles, 
  CheckCircle2, 
  Newspaper, 
  CalendarDays, 
  SendHorizontal,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';

export interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  isVerified: boolean;
  location: string;
  time: string;
  caption: string;
  hashtags: string;
  tags: { label: string; type: 'politic' | 'calendar' | 'active' }[];
  isFakeNews: boolean;
  likes: number;
  comments: number;
  shares: number;
  imageUrl: string;
}

interface FeedPostProps {
  post: Post;
  isActive: boolean;
}

export default function FeedPost({ post, isActive }: FeedPostProps) {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.likes);
  const [commentText, setCommentText] = useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleCommentClick = () => {
    inputRef.current?.focus();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Share Post',
          url: window.location.href,
        });
      } catch (err) {}
    } else {
      alert('Funcționalitatea de share va fi disponibilă nativ în aplicația finală.');
    }
  };

  const formatNum = (num: number) => {
    if (num >= 1000) {
      if (num === 12400) return '12.4K';
      if (num === 1200) return '1.2K';
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="relative w-full h-[100dvh] snap-start flex-shrink-0 bg-black overflow-hidden">
      {/* Background Media */}
      <div className="absolute inset-0 z-0 bg-[#0F111A]">
        <img 
          src={post.imageUrl} 
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* --- FLOATING OVERLAYS --- */}
      <div className="absolute inset-x-0 top-[90px] bottom-[85px] z-20 pointer-events-none flex flex-col justify-between pb-2">
        
        {/* Top left Fals Badge */}
        <div className="px-4 mt-2 relative pointer-events-auto">
          {post.isFakeNews && (
            <button className="flex items-center gap-1.5 pl-2.5 pr-3.5 py-[7px] bg-black/60 backdrop-blur-md rounded-full border border-red-500/30 w-max shadow-md">
              <div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[12px] font-bold text-red-500 tracking-wider">FALS</span>
              <span className="text-[13px] font-medium text-white/90 ml-1">Manipulare detectată</span>
              <ChevronRight className="w-4 h-4 text-white/70 ml-0.5" />
            </button>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex-1 flex justify-between items-end pointer-events-auto mb-1 overflow-visible">
          
          {/* Post Context (Left) */}
          <div className="flex-1 px-4 flex flex-col justify-end pb-1">
            {/* Avatar & Info */}
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={post.authorAvatar} 
                className="w-12 h-12 rounded-full border-[1.5px] border-white/20 object-cover shadow-lg"
                alt={post.authorName}
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[17px] text-white drop-shadow-md">{post.authorName}</span>
                  {post.isVerified && (
                    <BadgeCheck className="w-[18px] h-[18px] text-blue-500 fill-white drop-shadow-sm" />
                  )}
                </div>
                <span className="text-[13px] text-white/70 drop-shadow-sm font-medium -mt-0.5">
                  {post.location} • {post.time}
                </span>
              </div>
            </div>

            <p className="text-[15.5px] font-bold tracking-tight text-white leading-tight drop-shadow-md mb-0.5 max-w-[95%]">
              {post.caption}
            </p>
            <p className="text-[15px] font-semibold text-blue-400 drop-shadow-md mb-4 max-w-[90%]">
              {post.hashtags}
            </p>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-[8px] py-[4px] bg-[#1C2033]/70 backdrop-blur-md rounded-md border border-white/5 shadow-sm">
                  {tag.type === 'politic' && <Newspaper className="w-[12px] h-[12px] text-[#8A9CBC]" />}
                  {tag.type === 'calendar' && <CalendarDays className="w-[12px] h-[12px] text-white/90" />}
                  {tag.type === 'active' && <div className="w-[6px] h-[6px] rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />}
                  <span className="text-[10px] uppercase font-bold text-white/90 drop-shadow-sm tracking-wide">{tag.label}</span>
                </div>
              ))}
            </div>

            {/* Persistent Comment Input */}
            <div className="flex items-center gap-3 w-[95%] bg-black/40 backdrop-blur-xl rounded-full px-1.5 py-1.5 border border-white/15 shadow-lg relative">
              <img 
                 src="https://i.pravatar.cc/150?u=current_user" 
                 className="w-8 h-8 rounded-full object-cover ml-0.5 border border-white/10"
                 alt="You"
              />
              <input 
                ref={inputRef}
                type="text" 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Adaugă un comentariu..." 
                className="flex-1 bg-transparent text-[13.5px] font-medium text-white placeholder-white/70 outline-none pb-0.5"
              />
              <button className="pr-3 pl-2 opacity-70 hover:opacity-100 transition-opacity">
                <SendHorizontal className="w-[20px] h-[20px] text-white/80" />
              </button>
            </div>
          </div>

          {/* Action Bar (Right) */}
          <div className="w-[70px] flex flex-col items-center justify-end gap-[18px] pb-1 pr-1">
            
            <span className="text-[11px] font-medium text-white/80 mb-0 drop-shadow-md tracking-wider">1 112</span>

            <div className="relative mb-2 mt-1">
              <img src="https://i.pravatar.cc/150?u=right_avatar" alt="" className="w-11 h-11 rounded-full border-[1.5px] border-white/40 object-cover shadow-md" />
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1.5px] shadow-sm">
                <CheckCircle2 className="w-[14px] h-[14px] text-[#34C759] fill-[#34C759]" />
              </div>
            </div>

            <button onClick={handleLike} className="flex flex-col items-center gap-1.5 group">
              <Heart className={`w-[32px] h-[32px] drop-shadow-lg group-active:scale-95 transition-transform ${isLiked ? 'text-red-500 fill-red-500' : 'text-white fill-white'}`} />
              <span className="text-[12px] font-semibold text-white drop-shadow-md tracking-wide">{formatNum(likeCount)}</span>
            </button>

            <button onClick={handleCommentClick} className="flex flex-col items-center gap-1.5 group">
              <MessageSquareMore className="w-[30px] h-[30px] text-white drop-shadow-lg group-active:scale-95 transition-transform stroke-[1.5]" />
              <span className="text-[12px] font-semibold text-white drop-shadow-md tracking-wide">{formatNum(post.comments)}</span>
            </button>

            <button onClick={handleShare} className="flex flex-col items-center gap-1.5 group">
              <Share2 className="w-[30px] h-[30px] text-white drop-shadow-lg group-active:scale-95 transition-transform stroke-[1.5]" />
              <span className="text-[12px] font-semibold text-white drop-shadow-md tracking-wide">{formatNum(post.shares)}</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 group mt-1">
              <Scale className="w-[28px] h-[28px] text-white drop-shadow-lg stroke-[1.5]" />
              <span className="text-[11px] font-medium text-white/90 drop-shadow-md mt-0.5 tracking-wide">Dezbatere</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 group mt-3 relative mb-2">
              <div className="absolute inset-0 top-[-8px] bg-[#A855F7]/50 rounded-full blur-xl pointer-events-none scale-[1.7]" />
              <div className="relative p-3 bg-gradient-to-br from-[#A855F7] via-[#8B5CF6] to-[#3B82F6] rounded-full group-active:scale-95 transition-transform z-10 shadow-[0_0_15px_rgba(168,85,247,0.7)] border border-white/10 m-[1px]">
                <Sparkles className="w-5 h-5 text-white stroke-[2]" />
              </div>
              <span className="text-[11px] font-medium text-white drop-shadow-md z-10 w-max mt-0.5 tracking-wide">Explică AI</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
