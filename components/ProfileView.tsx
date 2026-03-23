"use client";

import React, { useState } from 'react';
import { 
  UserPlus, MessageCircle, Scale, Sparkles, MapPin, Calendar, Link as LinkIcon, Briefcase
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
          <h1 className="text-[28px] font-bold text-[#050505] leading-tight flex items-center gap-1.5">
            {MOCK_USER.name}
          </h1>
          <p className="text-[15px] text-[#050505] mt-2 mb-3 max-w-[90%] font-medium whitespace-pre-wrap">
            {MOCK_USER.bio}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[14px] text-[#65676b] font-medium">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {MOCK_USER.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {MOCK_USER.joinDate}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-4 py-3 flex items-center justify-center gap-6 border-t border-b border-gray-100 mt-2 text-center">
          <div className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.followers}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Urmăritori</span>
          </div>
          <div className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.following}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Urmărește</span>
          </div>
          <div className="flex flex-col cursor-pointer hover:opacity-80">
            <span className="text-[16px] font-bold text-[#050505]">{MOCK_USER.postsCount}</span>
            <span className="text-[13px] text-[#65676b] font-medium">Postări</span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="px-4 py-3 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={handleFollow}
            className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold text-[14px] transition-colors shadow-sm
              ${isFollowed 
                ? 'bg-gray-200 text-[#050505] hover:bg-gray-300' 
                : 'bg-[#1877F2] text-white hover:bg-[#166FE5]'
              }`}
          >
            <UserPlus className={`w-4 h-4 ${isFollowed ? 'text-gray-900' : 'text-white'}`} strokeWidth={2.5} />
            {isFollowed ? 'Urmărești' : 'Urmărește'}
          </button>

          <button className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 bg-gray-200 text-[#050505] rounded-lg font-semibold text-[14px] hover:bg-gray-300 transition-colors shadow-sm">
            <MessageCircle className="w-4 h-4 text-gray-900" strokeWidth={2.5} />
            Mesaj
          </button>

          <button 
            onClick={() => setIsDezbatereOpen(true)}
            className="flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 bg-gray-200 text-[#050505] rounded-lg font-semibold text-[14px] hover:bg-gray-300 transition-colors shadow-sm"
          >
            <Scale className="w-4 h-4 text-[#1877F2]" strokeWidth={2.5} />
            Dezbatere
          </button>

          <button 
            onClick={() => setIsAiOpen(true)}
            className="flex-1 min-w-[90px] flex items-center justify-center gap-1.5 py-2 bg-gray-200 text-[#050505] rounded-lg font-semibold text-[14px] hover:bg-gray-300 transition-colors shadow-sm"
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
            <h2 className="text-[17px] font-bold text-[#050505] mb-4">Informații</h2>
            <div className="flex flex-col gap-4">
              <InfoRow icon={<Briefcase />} text={`Lucrează la `} highlight={MOCK_USER.work} />
              <InfoRow icon={<MapPin />} text={`Locuiește în `} highlight={MOCK_USER.location} />
              <InfoRow icon={<LinkIcon />} text={``} highlight={MOCK_USER.website} isLink />
              <InfoRow icon={<Calendar />} text={MOCK_USER.joinDate} />
            </div>
          </div>
        )}

        {activeTab === 'fotografii' && (
          <div className="bg-white p-2">
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div key={idx} className="aspect-square bg-gray-200 relative cursor-pointer hover:opacity-90 overflow-hidden">
                  <img src={`https://images.unsplash.com/photo-15507${idx}1827-4bd374c?q=80&w=300&auto=format&fit=crop`} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'video' && (
          <div className="bg-white p-4 text-center text-gray-500 font-medium">
            Nu există videoclipuri încă.
          </div>
        )}
      </div>

      {/* Modals for profile specific AI / Debate */}
      <DezbatereModal isOpen={isDezbatereOpen} onClose={() => setIsDezbatereOpen(false)} postId={`profile_${MOCK_USER.id}`} />
      <AiAnalysisModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} postId={`profile_${MOCK_USER.id}`} />

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

function TabButton({ id, current, set, label }: any) {
  const isActive = current === id;
  return (
    <button 
      onClick={() => set(id)}
      className={`px-4 py-3 min-w-max font-semibold text-[15px] transition-colors relative
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

function InfoRow({ icon, text, highlight, isLink }: any) {
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
