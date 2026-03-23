"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Globe2, Volume2, VolumeX, X } from 'lucide-react';

import type { StoryRecord } from '@/lib/stories';

interface StoryViewerProps {
  stories: StoryRecord[];
  startIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const IMAGE_DURATION_MS = 5000;

export default function StoryViewer({ stories, startIndex, isOpen, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(startIndex);
      setProgress(0);
    }
  }, [isOpen, startIndex]);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.mediaType === 'video';

  useEffect(() => {
    if (!isOpen || !currentStory) {
      return;
    }

    setProgress(0);

    if (isVideo) {
      return;
    }

    const startedAt = Date.now();
    const interval = setInterval(() => {
      const ratio = Math.min((Date.now() - startedAt) / IMAGE_DURATION_MS, 1);
      setProgress(ratio);

      if (ratio >= 1) {
        clearInterval(interval);
        advanceStory();
      }
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, currentStory, isOpen, isVideo]);

  const progressBars = useMemo(
    () =>
      stories.map((story, index) => {
        if (index < currentIndex) {
          return 1;
        }

        if (index === currentIndex) {
          return progress;
        }

        return 0;
      }),
    [currentIndex, progress, stories]
  );

  if (!isOpen || !currentStory) {
    return null;
  }

  function advanceStory() {
    if (currentIndex >= stories.length - 1) {
      onClose();
      return;
    }

    setCurrentIndex((index) => index + 1);
  }

  function goBackStory() {
    setCurrentIndex((index) => (index <= 0 ? 0 : index - 1));
  }

  return (
    <div className="fixed inset-0 z-[80] bg-black">
      <div className="mx-auto flex h-full max-w-[600px] flex-col">
        <div className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-[600px] flex-col gap-3 px-4 pt-4">
          <div className="flex gap-1">
            {progressBars.map((value, index) => (
              <div key={`${stories[index]?.id}-${index}`} className="h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white transition-[width] duration-100" style={{ width: `${value * 100}%` }} />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <img src={currentStory.userAvatar} alt={currentStory.userName} className="h-10 w-10 rounded-full border border-white/20 object-cover" />
              <div>
                <div className="text-sm font-bold">{currentStory.userName}</div>
                <div className="mt-0.5 flex items-center gap-1 text-xs text-white/75">
                  <span>{currentStory.timeLabel}</span>
                  <span>·</span>
                  <Globe2 className="h-3 w-3" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isVideo ? (
                <button onClick={() => setSoundEnabled((value) => !value)} className="rounded-full bg-black/35 p-2 text-white">
                  {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </button>
              ) : null}
              <button onClick={onClose} className="rounded-full bg-black/35 p-2 text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <button onClick={goBackStory} className="absolute left-0 top-0 z-10 h-full w-1/3" aria-label="Story anterior" />
          <button onClick={advanceStory} className="absolute right-0 top-0 z-10 h-full w-1/3" aria-label="Story următor" />

          {isVideo ? (
            <video
              ref={videoRef}
              key={currentStory.id}
              src={currentStory.mediaUrl}
              className="h-full w-full object-cover"
              autoPlay
              playsInline
              muted={!soundEnabled}
              onEnded={advanceStory}
              controls={false}
            />
          ) : (
            <img src={currentStory.mediaUrl} alt={currentStory.userName} className="h-full w-full object-cover" />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/45" />
          {currentStory.caption ? (
            <div className="absolute inset-x-0 bottom-0 p-5 text-white">
              <div className="rounded-[24px] bg-black/35 px-4 py-4 text-base font-semibold leading-relaxed backdrop-blur-sm">
                {currentStory.caption}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
