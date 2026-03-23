"use client";

import React, { useState, useRef } from 'react';
import { X, ImagePlus, Globe2, Users, ChevronDown, Loader2, MapPin, Hash } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (post: {
    id: string;
    authorName: string;
    authorAvatar: string;
    isVerified: boolean;
    time: string;
    caption: string;
    hasMoreText: boolean;
    likes: number;
    likesText: string;
    comments: number;
    shares: number;
    imageUrl: string;
  }) => void;
}

export default function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<'public' | 'friends'>('public');
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const canPost = text.trim().length > 0 || imageFile !== null;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!canPost || isPosting) return;
    setIsPosting(true);
    setError('');

    try {
      let imageUrl = '';

      if (imageFile) {
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('file', imageFile);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: uploadFormData,
          });

          const uploadData = await readJsonSafely(uploadResponse);

          if (!uploadResponse.ok) {
            console.error('[CreatePost] Image upload failed', uploadData);
            throw new Error(getApiErrorMessage(uploadData, 'Imaginea nu a putut fi încărcată.'));
          }

          imageUrl = getUploadUrl(uploadData);
        } catch (uploadError) {
          console.error('[CreatePost] Server upload failed', uploadError);
          throw new Error(getUploadErrorMessage(uploadError));
        }
      }

      console.log('[CreatePost] Creating Firestore post', {
        hasText: Boolean(text.trim()),
        hasImage: Boolean(imageUrl),
      });

      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'current_user',
          userName: 'Alexandru Marin',
          userAvatar: 'https://i.pravatar.cc/150?u=current_user',
          isVerified: false,
          text: text.trim(),
          imageUrl,
        }),
      });

      const data = await readJsonSafely(res);

      if (!res.ok) {
        console.error('[CreatePost] Post creation failed', data);
        throw new Error(getApiErrorMessage(data, 'Postarea nu a putut fi creată.'));
      }

      onPostCreated(data.post);

      // Reset state
      setText('');
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (err: unknown) {
      console.error('[CreatePost] Post creation error', err);
      if (err instanceof TypeError) {
        setError('Cererea nu a putut fi trimisă. Verifică serverul și încearcă din nou.');
        return;
      }

      setError(err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.');
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col">
      
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <button onClick={onClose} className="p-1 -ml-1" disabled={isPosting}>
          <X className="w-6 h-6 text-[#65676b]" />
        </button>
        <h2 className="text-[17px] font-bold text-[#050505]">Creează o postare</h2>
        <button 
          onClick={handlePost}
          disabled={!canPost || isPosting}
          className={`px-4 py-1.5 rounded-md text-[15px] font-bold transition-colors
            ${canPost && !isPosting
              ? 'bg-[#1877F2] text-white hover:bg-[#166FE5] active:bg-[#1565C0]' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
        >
          {isPosting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Postează'}
        </button>
      </div>

      {/* USER INFO */}
      <div className="flex items-center gap-3 px-4 py-3">
        <img 
          src="https://i.pravatar.cc/150?u=current_user" 
          className="w-10 h-10 rounded-full border border-gray-200 object-cover"
          alt="You"
        />
        <div className="flex flex-col">
          <span className="font-semibold text-[15px] text-[#050505]">Alexandru Marin</span>
          <button 
            onClick={() => setVisibility(v => v === 'public' ? 'friends' : 'public')}
            className="flex items-center gap-1 mt-0.5 px-2 py-0.5 bg-gray-100 rounded-md text-[12px] font-semibold text-[#65676b] w-max hover:bg-gray-200 transition-colors"
          >
            {visibility === 'public' ? (
              <><Globe2 className="w-3 h-3" /> Public</>
            ) : (
              <><Users className="w-3 h-3" /> Prieteni</>
            )}
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* TEXT INPUT */}
      <div className="flex-1 px-4 overflow-y-auto">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Scrie ceva..."
          autoFocus
          className="w-full min-h-[120px] text-[22px] text-[#050505] placeholder-[#65676b] outline-none resize-none font-normal leading-relaxed"
        />

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="relative mt-2 mb-4 rounded-lg overflow-hidden border border-gray-200">
            <img src={imagePreview} alt="Preview" className="w-full max-h-[300px] object-contain bg-gray-50" />
            <button 
              onClick={removeImage}
              disabled={isPosting}
              className="absolute top-2 right-2 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        )}

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-[14px] font-medium">
            {error}
          </div>
        )}
      </div>

      {/* BOTTOM TOOLBAR */}
      <div className="border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-semibold text-[#050505]">Adaugă la postare</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isPosting}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ImagePlus className="w-6 h-6 text-[#45BD62]" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" disabled={isPosting}>
              <Hash className="w-6 h-6 text-[#1877F2]" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors" disabled={isPosting}>
              <MapPin className="w-6 h-6 text-[#F5533D]" />
            </button>
          </div>
        </div>
        <input 
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />
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

  throw new Error('Serverul nu a returnat URL-ul imaginii încărcate.');
}

function getUploadErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Imaginea nu a putut fi încărcată.';
}
