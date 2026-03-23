"use client";

import React, { useState } from 'react';
import { 
  UserPlus, MessageCircle, Scale, Sparkles, MapPin, Calendar, Link as LinkIcon, Briefcase, X
} from 'lucide-react';
import FeedPost, { Post } from './FeedPost';
import DezbatereModal from './DezbatereModal';
import AiAnalysisModal from './AiAnalysisModal';

const MOCK_USER = {
  id: 'u123',
  name: 'Alexandru Marin',
  isVerified: true,
  avatar: 'https://i.pravatar.cc/150?u=alex',
  coverImage: 'https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?q=80&w=800&auto=format&fit=crop',
  bio: 'Antreprenor & pasionat de tehnologie. Cred în libertatea de exprimare și piețe libere. 🌐',
  location: 'București, România',
  joinDate: 'Membru din sept. 2024',
  website: 'alexmarin.ro',
  work: 'Fondator la TechStart',
  followers: 1240,
  following: 342,
  postsCount: 56,
  posts: [
    {
      id: 'p1',
      authorName: 'Alexandru Marin',
      authorAvatar: 'https://i.pravatar.cc/150?u=alex',
      isVerified: true,
      time: '2h',
      caption: 'Inteligența artificială nu va înlocui oamenii, ci oamenii care folosesc inteligența artificială îi vor înlocui pe cei care nu o folosesc. Trebuie să ne adaptăm rapid.',
      hasMoreText: false,
      likes: 245,
      likesText: '245',
      comments: 42,
      shares: 12,
      imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'p2',
      authorName: 'Alexandru Marin',
      authorAvatar: 'https://i.pravatar.cc/150?u=alex',
      isVerified: true,
      time: '1 zi',
      caption: 'Am participat ieri la un eveniment excelent despre viitorul e-commerce-ului.',
      hasMoreText: true,
      likes: 89,
      likesText: '89',
      comments: 14,
      shares: 3,
    }
  ] as Post[]
};

export default function ProfileView() {
  const [activeTab, setActiveTab] = useState('postari');
  const [isFollowed, setIsFollowed] = useState(false);
  const [isDezbatereOpen, setIsDezbatereOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [messageDraft, setMessageDraft] = useState('');
  const [messageStatus, setMessageStatus] = useState('');
  const [statsSheet, setStatsSheet] = useState<null | 'followers' | 'following' | 'posts'>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);

  const profilePhotos = Array.from({ length: 9 }).map((_, idx) => `https://images.unsplash.com/photo-15507${idx}1827-4bd374c?q=80&w=800&auto=format&fit=crop`);

  const profileVideos: Post[] = [
    {
      id: 'v1',
      type: 'reel',
      authorName: MOCK_USER.name,
      authorAvatar: MOCK_USER.avatar,
      isVerified: true,
      time: '3 zile',
      caption: 'Un scurt tur din culisele ultimului eveniment la care am participat.',
      hasMoreText: false,
      likes: 118,
      likesText: '118',
      comments: 16,
      shares: 5,
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
    },
  ];

  const handleFollow = () => {
    setIsFollowed(!isFollowed);
    // Mock track event
    if (!isFollowed) {
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'USER_FOLLOW', userId: MOCK_USER.id, timestamp: new Date().toISOString() })
      }).catch(() => {});
    }
  };

  const handleSendMessage = () => {
    const nextMessage = messageDraft.trim();

    if (!nextMessage) {
      return;
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'USER_MESSAGE', userId: MOCK_USER.id, text: nextMessage, timestamp: new Date().toISOString() })
    }).catch(() => {});

    setMessageStatus('Mesaj trimis.');
    setMessageDraft('');
    setActiveTab('despre');
  };

  return (
    <div className="w-full bg-[#c9ccd1] min-h-screen">
      <div className="bg-white pb-3">
        {/* Cover Section */}
        <div className="relative w-full h-[220px] bg-gray-200">
          <img 
            src={MOCK_USER.coverImage} 
            alt="Cover" 
            className="w-full h-full object-cover rounded-b-lg"
          />
          {/* Avatar Overlay */}
          <div className="absolute -bottom-[60px] left-1/2 -translate-x-1/2 flex items-center justify-center">
            <div className={`w-[160px] h-[160px] rounded-full p-[4px] bg-white ${MOCK_USER.isVerified ? 'border-[#1877F2] border-2 ring-4 ring-white' : ''}`}>
              <img 
                src={MOCK_USER.avatar} 
                alt={MOCK_USER.name} 
                className="w-full h-full object-cover rounded-full border border-gray-100"
              />
              {MOCK_USER.isVerified && (
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm">
                  <VerifiedBadge />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spacing for avatar */}
        <div className="h-[65px]"></div>

        {/* Profile Info */}
        <div className="px-4 flex flex-col items-center pb-2 text-center">
          <h1 className="flex items-center gap-1.5 text-[29px] font-[700] tracking-[-0.045em] text-[#050505] leading-tight">
            {MOCK_USER.name}
          </h1>
          <p className="mt-2 mb-3 max-w-[90%] whitespace-pre-wrap text-[15px] font-[460] tracking-[-0.015em] text-[#1b1f24] leading-[1.55]">
            {MOCK_USER.bio}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[14px] text-[#65676b] font-medium">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {MOCK_USER.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {MOCK_USER.joinDate}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-3 flex items-center justify-center gap-6 border-t border-b border-gray-100 mt-2 text-center">
          <button onClick={() => setStatsSheet('followers')} className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.followers}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Urmăritori</span>
          </button>
          <button onClick={() => setStatsSheet('following')} className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.following}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Urmărește</span>
          </button>
          <button onClick={() => setStatsSheet('posts')} className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.postsCount}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Postări</span>
          </button>
        </div>

        {/* Action Buttons Row */}
        <div className="px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={handleFollow}
            className={`flex min-w-[110px] flex-1 items-center justify-center gap-1.5 rounded-2xl px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] transition-all shadow-sm
              ${isFollowed 
                ? 'bg-[#E9EDF2] text-[#050505] hover:bg-[#DDE3EA]' 
                : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
              }`}
          >
            <UserPlus className={`w-4 h-4 ${isFollowed ? 'text-gray-900' : 'text-white'}`} strokeWidth={2.5} />
            {isFollowed ? 'Urmărești' : 'Urmărește'}
          </button>

          <button
            onClick={() => {
              setActiveTab('despre');
              setMessageStatus('');
            }}
            className="flex min-w-[90px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505] transition-all hover:bg-[#DDE3EA] shadow-sm"
          >
            <MessageCircle className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
            Mesaj
          </button>

          <button 
            onClick={() => setIsDezbatereOpen(true)}
            className="flex min-w-[100px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505] transition-all hover:bg-[#DDE3EA] shadow-sm"
          >
            <Scale className="w-4 h-4 text-[#1877F2]" strokeWidth={2.5} />
            Dezbatere
          </button>

          <button 
            onClick={() => setIsAiOpen(true)}
            className="flex min-w-[90px] flex-1 items-center justify-center gap-1.5 rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505] transition-all hover:bg-[#DDE3EA] shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#A855F7]" strokeWidth={2.5} />
            Analiză AI
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-gray-200 sticky top-0 bg-white z-20 px-2 overflow-x-auto no-scrollbar">
          <TabButton id="postari" current={activeTab} set={setActiveTab} label="Postări" />
          <TabButton id="despre" current={activeTab} set={setActiveTab} label="Despre" />
          <TabButton id="fotografii" current={activeTab} set={setActiveTab} label="Fotografii" />
          <TabButton id="video" current={activeTab} set={setActiveTab} label="Video" />
        </div>
      </div>

      <div className="w-full h-2 bg-[#c9ccd1]" />

      {/* TABS CONTENT */}
      <div className="bg-[#c9ccd1] flex flex-col gap-2 relative">
        {activeTab === 'postari' && (
          MOCK_USER.posts.map((post) => (
            <div className="bg-white" key={post.id}>
              <FeedPost post={post} />
              <div className="w-full h-2 bg-[#c9ccd1]" />
            </div>
          ))
        )}

        {activeTab === 'despre' && (
          <div className="bg-white p-4">
            <h2 className="mb-4 text-[19px] font-[680] tracking-[-0.035em] text-[#050505]">Informații</h2>
            <div className="flex flex-col gap-4">
              <InfoRow icon={<Briefcase />} text={`Lucrează la `} highlight={MOCK_USER.work} />
              <InfoRow icon={<MapPin />} text={`Locuiește în `} highlight={MOCK_USER.location} />
              <InfoRow icon={<LinkIcon />} text={``} highlight={MOCK_USER.website} isLink />
              <InfoRow icon={<Calendar />} text={MOCK_USER.joinDate} />
            </div>
            <div className="mt-5 rounded-xl border border-gray-200 bg-[#F7F8FA] p-4">
              <h3 className="text-[15px] font-[660] tracking-[-0.025em] text-[#050505]">Trimite un mesaj rapid</h3>
              <textarea
                value={messageDraft}
                onChange={(event) => setMessageDraft(event.target.value)}
                placeholder={`Scrie-i lui ${MOCK_USER.name}...`}
                className="mt-3 min-h-[96px] w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-3 text-[14px] text-[#050505] outline-none"
              />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="text-[13px] font-medium text-[#65676b]">{messageStatus}</span>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageDraft.trim()}
                  className="rounded-2xl bg-[#1877F2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-white disabled:bg-[#b9d4fb]"
                >
                  Trimite
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fotografii' && (
          <div className="bg-white p-2">
            <div className="grid grid-cols-3 gap-1">
              {profilePhotos.map((photoUrl, idx) => (
                <button
                  key={photoUrl}
                  onClick={() => setActivePhoto(photoUrl)}
                  className="aspect-square bg-gray-200 relative cursor-pointer hover:opacity-90 overflow-hidden"
                >
                  <img src={photoUrl} alt={`Fotografie ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          profileVideos.map((videoPost) => (
            <div className="bg-white" key={videoPost.id}>
              <FeedPost post={videoPost} />
              <div className="w-full h-2 bg-[#c9ccd1]" />
            </div>
          ))
        )}
      </div>

      {/* Modals for profile specific AI / Debate */}
      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <ProfileStatsSheet kind={statsSheet} onClose={() => setStatsSheet(null)} />
      <ProfilePhotoViewer imageUrl={activePhoto} onClose={() => setActivePhoto(null)} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function ProfileStatsSheet({
  kind,
  onClose,
}: {
  kind: null | 'followers' | 'following' | 'posts';
  onClose: () => void;
}) {
  if (!kind) {
    return null;
  }

  const content =
    kind === 'followers'
      ? {
          title: 'Urmăritori',
          rows: ['Ana Preda', 'Darius Enache', 'Ioana Pavel'],
        }
      : kind === 'following'
        ? {
            title: 'Urmărește',
            rows: ['Creator Economy România', 'TechStart Labs', 'Comunitatea Reels'],
          }
        : {
            title: 'Postări',
            rows: ['Postări publice: 56', 'Reel-uri: 8', 'Story-uri active: 2'],
          };

  return (
    <div className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
        <div className="text-[19px] font-[680] tracking-[-0.035em] text-[#050505]">{content.title}</div>
        <div className="mt-4 space-y-2">
          {content.rows.map((row) => (
            <div key={row} className="rounded-2xl bg-[#F7F8FA] px-4 py-3 text-[15px] font-[620] tracking-[-0.02em] text-[#050505]">
              {row}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePhotoViewer({ imageUrl, onClose }: { imageUrl: string | null; onClose: () => void }) {
  if (!imageUrl) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[92] bg-black/95" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur-sm"
        aria-label="Închide fotografia"
      >
        <X className="h-6 w-6" />
      </button>
      <div className="flex h-full w-full items-center justify-center p-4">
        <img src={imageUrl} alt="Fotografie profil" className="max-h-full max-w-full object-contain" />
      </div>
    </div>
  );
}

function TabButton({
  id,
  current,
  set,
  label,
}: {
  id: string;
  current: string;
  set: (value: string) => void;
  label: string;
}) {
  const isActive = current === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`relative min-w-max px-4 py-3 text-[15px] font-[640] tracking-[-0.02em] transition-colors
        ${isActive ? 'text-[#1877F2]' : 'text-[#65676b] hover:bg-gray-50 rounded-md'}
      `}
    >
      {label}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1877F2] rounded-t-sm" />
      )}
    </button>
  );
}

function InfoRow({
  icon,
  text,
  highlight,
  isLink,
}: {
  icon: React.ReactElement<{ className?: string }>;
  text: string;
  highlight?: string;
  isLink?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 text-[15px] text-[#050505]">
      <div className="text-[#8c939d]">
        {React.cloneElement(icon, { className: 'w-6 h-6 stroke-[1.5]' })}
      </div>
      <span>
        {text}
        {highlight && (
          <span className={`font-semibold ${isLink ? 'text-[#1877F2] hover:underline cursor-pointer' : ''}`}>
            {highlight}
          </span>
        )}
      </span>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <div className="w-[20px] h-[20px] bg-[#1877F2] rounded-full flex items-center justify-center">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}
