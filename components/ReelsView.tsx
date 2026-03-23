"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Clapperboard, Heart, MessageCircle, Music2, Plus, Send, Sparkles, Volume2, VolumeX } from 'lucide-react';

import type { Post } from '@/components/FeedPost';

interface ReelsViewProps {
  reels: Post[];
  loading: boolean;
  error: string;
  onCreateReel: () => void;
}

export default function ReelsView({ reels, loading, error, onCreateReel }: ReelsViewProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setSoundEnabled(window.localStorage.getItem('reels-sound-enabled') === 'true');
  }, []);

  const handleEnableSound = () => {
    setSoundEnabled(true);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('reels-sound-enabled', 'true');
    }
  };

  const handleDisableSound = () => {
    setSoundEnabled(false);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('reels-sound-enabled', 'false');
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-[calc(100vh-60px)] items-center justify-center bg-[#0b0d12] text-white">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-[#ff4d67]" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-4 bg-[#0b0d12] px-6 text-center text-white">
        <Clapperboard className="h-10 w-10 text-[#ff4d67]" />
        <p className="text-lg font-semibold">{error}</p>
        <button onClick={onCreateReel} className="rounded-full bg-[#ff4d67] px-5 py-3 text-sm font-bold text-white">
          Creează primul Reel
        </button>
      </section>
    );
  }

  if (reels.length === 0) {
    return (
      <section className="flex min-h-[calc(100vh-60px)] flex-col items-center justify-center gap-4 bg-[#0b0d12] px-6 text-center text-white">
        <div className="rounded-full bg-white/10 p-4">
          <Sparkles className="h-8 w-8 text-[#ffd166]" />
        </div>
        <p className="text-xl font-bold">Nu există Reel-uri încă</p>
        <p className="max-w-[280px] text-sm text-white/60">Adaugă un clip vertical și pune în mișcare tab-ul de Reels exact unde utilizatorii se așteaptă să-l găsească.</p>
        <button onClick={onCreateReel} className="rounded-full bg-[#ff4d67] px-5 py-3 text-sm font-bold text-white">
          Creează Reel
        </button>
      </section>
    );
  }

  return (
    <section className="bg-[#07090d] px-3 py-3">
      <div className="mb-3 flex items-center justify-between rounded-[24px] border border-white/10 bg-white/5 px-4 py-3 text-white">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Reels</div>
          <div className="mt-1 text-sm text-white/80">
            Scroll vertical, clipuri fullscreen, acțiuni rapide.
            {!soundEnabled ? ' Atinge un Reel pentru sunet.' : ' Sunet activat când browserul permite autoplay audio.'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={soundEnabled ? handleDisableSound : handleEnableSound}
            className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            {soundEnabled ? 'Sunet on' : 'Sunet off'}
          </button>
          <button onClick={onCreateReel} className="flex items-center gap-2 rounded-full bg-[#ff4d67] px-4 py-2 text-sm font-bold text-white">
            <Plus className="h-4 w-4" />
            Creează
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {reels.map((reel) => (
          <ReelCard key={reel.id} reel={reel} soundEnabled={soundEnabled} onEnableSound={handleEnableSound} />
        ))}
      </div>
    </section>
  );
}

function ReelCard({
  reel,
  soundEnabled,
  onEnableSound,
}: {
  reel: Post;
  soundEnabled: boolean;
  onEnableSound: () => void;
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting && entry.intersectionRatio >= 0.7);
      },
      {
        threshold: [0.4, 0.7, 0.9],
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (isActive) {
      video.muted = !soundEnabled;
      void video.play().catch(() => {
        // Browser autoplay policies can still interrupt playback.
      });
      return;
    }

    video.pause();
  }, [isActive]);

  const handleEnableSound = () => {
    const video = videoRef.current;

    onEnableSound();

    if (!video) {
      return;
    }

    video.muted = false;
    void video.play().catch(() => {
      // Ignore playback interruption after explicit user gesture.
    });
  };

  const handleToggleSound = () => {
    const video = videoRef.current;

    if (!video) {
      onEnableSound();
      return;
    }

    if (video.muted) {
      handleEnableSound();
      return;
    }

    video.muted = true;
  };

  return (
    <article ref={cardRef} className="relative overflow-hidden rounded-[34px] border border-white/10 bg-black text-white shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div className="relative">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="aspect-[9/16] w-full bg-black object-cover"
          controls
          muted
          loop
          playsInline
          preload="metadata"
          autoPlay
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/85" />

        {!soundEnabled ? (
          <button
            onClick={handleEnableSound}
            className="absolute right-4 top-14 rounded-full bg-black/50 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm"
          >
            Activează sunetul
          </button>
        ) : null}

        <button
          onClick={handleToggleSound}
          className="absolute right-4 top-28 rounded-full bg-black/50 p-3 text-white backdrop-blur-sm"
          aria-label={soundEnabled ? 'Dezactivează sunetul' : 'Activează sunetul'}
        >
          {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
        </button>

        <div className="absolute left-0 right-0 top-0 flex items-center justify-between px-4 py-4">
          <div className="rounded-full bg-black/35 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
            Reel
          </div>
          <div className="rounded-full bg-black/35 px-3 py-1 text-xs font-medium text-white/85">{reel.time}</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-4 py-5">
          <div className="max-w-[75%]">
            <div className="mb-2 flex items-center gap-3">
              <img src={reel.authorAvatar} alt={reel.authorName} className="h-11 w-11 rounded-full border border-white/20 object-cover" />
              <div>
                <div className="text-sm font-bold">{reel.authorName}</div>
                <div className="text-xs text-white/65">Publicat acum în fluxul Reels</div>
              </div>
            </div>
            {reel.caption ? <p className="text-sm leading-relaxed text-white/90">{reel.caption}</p> : null}
            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/75">
              <Music2 className="h-3.5 w-3.5" />
              Clip original
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 pb-1">
            <ReelAction icon={<Heart className={`h-6 w-6 ${isLiked ? 'fill-current text-[#ff4d67]' : ''}`} />} label={isLiked ? reel.likes + 1 : reel.likes} onClick={() => setIsLiked((value) => !value)} />
            <ReelAction icon={<MessageCircle className="h-6 w-6" />} label={reel.comments} />
            <ReelAction icon={<Send className="h-6 w-6" />} label={reel.shares} />
          </div>
        </div>
      </div>
    </article>
  );
}

function ReelAction({ icon, label, onClick }: { icon: React.ReactNode; label: string | number; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1 text-white">
      <div className="rounded-full bg-black/40 p-3 backdrop-blur-sm">{icon}</div>
      <span className="text-[11px] font-semibold text-white/80">{label}</span>
    </button>
  );
}
