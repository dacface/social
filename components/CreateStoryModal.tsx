"use client";

import React, { useRef, useState } from 'react';
import { Globe2, ImagePlus, Loader2, Plus, Type, Video, X } from 'lucide-react';

import type { StoryRecord } from '@/lib/stories';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStoryCreated: (story: StoryRecord) => void;
}

export default function CreateStoryModal({ isOpen, onClose, onStoryCreated }: CreateStoryModalProps) {
  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const canSubmit = Boolean(selectedFile) && !isSubmitting;

  const resetState = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setCaption('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setMediaType('image');
    setError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const nextMediaType = file.type.startsWith('video/') ? 'video' : 'image';

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      setError('Alege o imagine sau un video pentru Story.');
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMediaType(nextMediaType);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedFile || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const uploadData = await readJsonSafely(uploadResponse);

      if (!uploadResponse.ok) {
        throw new Error(getApiErrorMessage(uploadData, 'Media story-ului nu a putut fi încărcată.'));
      }

      const res = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current_user',
          userName: 'Alexandru Marin',
          userAvatar: 'https://i.pravatar.cc/150?u=current_user',
          mediaUrl: getMediaUrl(uploadData),
          mediaType,
          caption: caption.trim(),
        }),
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        throw new Error(getApiErrorMessage(data, 'Story-ul nu a putut fi publicat.'));
      }

      onStoryCreated(data.story);
      resetState();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    resetState();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/80 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-[600px] flex-col bg-[#14161d] text-white">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <button onClick={handleClose} className="rounded-full p-1 hover:bg-white/10">
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-[17px] font-bold">Creează un Story</h2>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`rounded-full px-4 py-2 text-sm font-bold ${canSubmit ? 'bg-[#1877F2]' : 'bg-white/10 text-white/40'}`}
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Publică'}
          </button>
        </div>

        <div className="grid flex-1 gap-4 overflow-y-auto px-4 py-4 md:grid-cols-[1fr_230px]">
          <div className="rounded-[28px] border border-white/10 bg-[#1d212b] p-4">
            <div className="mb-4 flex items-center gap-3">
              <img src="https://i.pravatar.cc/150?u=current_user" className="h-11 w-11 rounded-full border border-white/10 object-cover" alt="You" />
              <div>
                <div className="text-sm font-semibold">Alexandru Marin</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-white/60">
                  <Globe2 className="h-3 w-3" />
                  <span>Public</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-white/5 px-4 py-4 text-sm font-semibold text-white/90 hover:bg-white/10"
            >
              {mediaType === 'video' ? <Video className="h-5 w-5 text-[#62d0ff]" /> : <ImagePlus className="h-5 w-5 text-[#62d0ff]" />}
              <span>{selectedFile ? 'Schimbă media Story' : 'Alege foto sau video'}</span>
            </button>

            <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />

            <div className="mt-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              <Type className="h-4 w-4" />
              <span>Text peste Story</span>
            </div>
            <textarea
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              placeholder="Spune ceva..."
              className="mt-3 min-h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-base text-white outline-none placeholder:text-white/35"
            />

            {error ? <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">{error}</div> : null}
          </div>

          <div className="rounded-[30px] border border-white/10 bg-[#090b10] p-3">
            <div className="mb-3 flex items-center gap-2 px-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              <Plus className="h-4 w-4" />
              <span>Previzualizare</span>
            </div>
            <div className="overflow-hidden rounded-[26px] bg-black">
              {previewUrl ? (
                mediaType === 'video' ? (
                  <video src={previewUrl} className="aspect-[9/16] w-full object-cover" playsInline controls muted loop />
                ) : (
                  <div className="relative aspect-[9/16] w-full">
                    <img src={previewUrl} alt="Story preview" className="h-full w-full object-cover" />
                    {caption ? <div className="absolute inset-x-3 bottom-4 rounded-2xl bg-black/35 px-3 py-3 text-sm font-semibold leading-relaxed text-white backdrop-blur-sm">{caption}</div> : null}
                  </div>
                )
              ) : (
                <div className="flex aspect-[9/16] items-center justify-center bg-[radial-gradient(circle_at_top,#304566,transparent_55%),linear-gradient(180deg,#19202c,#090b10)] px-6 text-center text-sm font-semibold text-white/70">
                  Story-ul tău va apărea aici exact ca o carte verticală de Facebook.
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

function getMediaUrl(payload: unknown) {
  if (payload && typeof payload === 'object' && 'url' in payload && typeof payload.url === 'string') {
    return payload.url;
  }

  throw new Error('Serverul nu a returnat URL-ul Story-ului încărcat.');
}
