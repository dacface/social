"use client";

import React, { useRef, useState } from 'react';
import { Clapperboard, Globe2, Loader2, Sparkles, Video, X } from 'lucide-react';

import type { Post } from '@/components/FeedPost';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReelCreated: (reel: Post) => void;
}

export default function CreateReelModal({ isOpen, onClose, onReelCreated }: CreateReelModalProps) {
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const canPublish = Boolean(videoFile) && !isPublishing;

  const handleVideoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('video/')) {
      setError('Selectează un fișier video pentru Reel.');
      return;
    }

    setError('');
    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const resetState = () => {
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setCaption('');
    setVideoFile(null);
    setVideoPreview(null);
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    if (isPublishing) {
      return;
    }

    resetState();
    onClose();
  };

  const handlePublish = async () => {
    if (!videoFile || isPublishing) {
      return;
    }

    setIsPublishing(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', videoFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const uploadData = await readJsonSafely(uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error(getApiErrorMessage(uploadData, 'Clipul nu a putut fi încărcat.'));
      }

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'reel',
          userId: 'current_user',
          userName: 'Alexandru Marin',
          userAvatar: 'https://i.pravatar.cc/150?u=current_user',
          isVerified: false,
          text: caption.trim(),
          videoUrl: getUploadUrl(uploadData),
        }),
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, 'Reel-ul nu a putut fi publicat.'));
      }

      onReelCreated(data.post);
      resetState();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[600px] flex-col bg-[#111318] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button onClick={handleClose} disabled={isPublishing} className="rounded-full p-1 hover:bg-white/10">
            <X className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2">
            <Clapperboard className="h-5 w-5 text-[#ff4d67]" />
            <h2 className="text-[17px] font-bold">Creează un Reel</h2>
          </div>
          <button
            onClick={handlePublish}
            disabled={!canPublish}
            className={`rounded-full px-4 py-2 text-sm font-bold ${
              canPublish ? 'bg-[#ff4d67] text-white' : 'bg-white/10 text-white/40'
            }`}
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publică'}
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto px-4 py-4 md:grid-cols-[1fr_230px]">
          <div className="rounded-[28px] border border-white/10 bg-[#1b1f27] p-4">
            <div className="mb-4 flex items-center gap-3">
              <img
                src="https://i.pravatar.cc/150?u=current_user"
                className="h-11 w-11 rounded-full border border-white/10 object-cover"
                alt="You"
              />
              <div>
                <div className="text-sm font-semibold">Alexandru Marin</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
                  <Globe2 className="h-3 w-3" />
                  <span>Public</span>
                </div>
              </div>
            </div>

            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Descrie Reel-ul tău..."
              className="min-h-[110px] w-full resize-none bg-transparent text-[18px] leading-relaxed text-white outline-none placeholder:text-white/35"
            />

            {error ? (
              <div className="mt-4 rounded-2xl border border-[#ff4d67]/30 bg-[#ff4d67]/10 px-4 py-3 text-sm text-[#ffd6dd]">
                {error}
              </div>
            ) : null}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isPublishing}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              <Video className="h-5 w-5 text-[#62d0ff]" />
              <span>{videoFile ? 'Schimbă clipul' : 'Alege clipul video'}</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={handleVideoSelect}
            />
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#090b10] p-3">
            <div className="mb-3 flex items-center justify-between px-2">
              <span className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">Previzualizare</span>
              <Sparkles className="h-4 w-4 text-[#ffd166]" />
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
              {videoPreview ? (
                <video
                  src={videoPreview}
                  className="aspect-[9/16] w-full object-cover"
                  controls
                  muted
                  loop
                  playsInline
                />
              ) : (
                <div className="flex aspect-[9/16] w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,#303742,transparent_55%),linear-gradient(180deg,#171b22,#090b10)] px-5 text-center">
                  <Clapperboard className="h-10 w-10 text-white/65" />
                  <p className="text-sm font-semibold text-white/85">Reel vertical, fullscreen, pregătit de scroll</p>
                  <p className="text-xs text-white/50">Adaugă un video ca să vezi compoziția finală în stil Facebook.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

async function readJsonSafely(response: Response) {
  const contentType = response.headers.get('content-type') ?? '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  const text = await response.text();
  return text ? { error: text } : {};
}

function getApiErrorMessage(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string') {
    return payload.error;
  }

  return fallback;
}

function getUploadUrl(payload: unknown) {
  if (payload && typeof payload === 'object' && 'url' in payload && typeof payload.url === 'string') {
    return payload.url;
  }

  throw new Error('Serverul nu a returnat URL-ul clipului încărcat.');
}
