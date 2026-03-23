"use client";

import React from 'react';
import { Plus } from 'lucide-react';

import type { StoryRecord } from '@/lib/stories';

interface StoriesBarProps {
  stories: StoryRecord[];
  loading: boolean;
  onCreateStory: () => void;
  onOpenStory: (index: number) => void;
}

export default function StoriesBar({ stories, loading, onCreateStory, onOpenStory }: StoriesBarProps) {
  return (
    <div className="bg-white pt-3 pb-4">
      <div className="no-scrollbar flex overflow-x-auto gap-2 px-4">
        <button
          onClick={onCreateStory}
          className="relative flex h-[178px] w-[106px] flex-none flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#f0f2f5] shadow-sm"
        >
          <div className="relative h-[120px] overflow-hidden bg-[radial-gradient(circle_at_top,#7fb3ff,transparent_55%),linear-gradient(180deg,#cfe2ff,#90baff)]">
            <img src="https://i.pravatar.cc/150?u=current_user" alt="You" className="h-full w-full object-cover opacity-95" />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="flex flex-1 items-center justify-center bg-white px-3">
            <div className="absolute top-[104px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[#1877F2] text-white shadow-lg">
              <Plus className="h-5 w-5" />
            </div>
            <span className="pt-6 text-center text-[13px] font-bold leading-tight text-[#050505]">Creează story</span>
          </div>
        </button>

        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-[178px] w-[106px] flex-none animate-pulse rounded-2xl bg-[#e9edf3]" />
            ))
          : stories.map((story, index) => (
              <button
                key={story.id}
                onClick={() => onOpenStory(index)}
                className="relative h-[178px] w-[106px] flex-none overflow-hidden rounded-2xl border border-black/10 shadow-sm"
              >
                {story.mediaType === 'video' ? (
                  <video src={story.mediaUrl} className="h-full w-full object-cover" muted playsInline />
                ) : (
                  <img src={story.mediaUrl} alt={story.userName} className="h-full w-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/65" />
                <div className="absolute left-3 top-3 h-10 w-10 overflow-hidden rounded-full border-4 border-[#1877F2] bg-white">
                  <img src={story.userAvatar} alt={story.userName} className="h-full w-full object-cover" />
                </div>
                <div className="absolute bottom-2 left-2 right-2 text-left">
                  <div className="line-clamp-2 text-[13px] font-semibold leading-tight text-white drop-shadow-md">{story.userName}</div>
                </div>
              </button>
            ))}
      </div>
    </div>
  );
}
