"use client";

import React, { useState } from 'react';
import { 
  Search, SlidersHorizontal, Home, Compass, Plus, Bell, User, Clock, Activity, ShieldCheck, ChevronDown
} from 'lucide-react';
import FeedPost, { Post } from '@/components/FeedPost';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    authorName: 'Ana Popescu',
    authorAvatar: 'https://i.pravatar.cc/150?u=a042581f4e29026',
    isVerified: true,
    location: 'București, România',
    time: '5m',
    caption: 'Trebuie să mergem la vot pentru a schimba viitorul!',
    hashtags: '#Politica #Alegeri #Democratie',
    tags: [
      { label: 'Politic', type: 'politic' },
      { label: 'Alegeri 2025', type: 'calendar' },
      { label: 'Discuție activă', type: 'active' }
    ],
    isFakeNews: true,
    likes: 12400,
    comments: 256,
    shares: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1541872596495-25b8431945ae?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    authorName: 'Economia AZ',
    authorAvatar: 'https://i.pravatar.cc/150?u=b244',
    isVerified: true,
    location: 'București, România',
    time: '2h',
    caption: 'Inflația a scăzut la 4% în această lună, dar prețurile abia dacă se resimt.',
    hashtags: '#Economie #Romania #Bani',
    tags: [
      { label: 'Economie', type: 'politic' },
      { label: 'Actualitate', type: 'active' }
    ],
    isFakeNews: false,
    likes: 5320,
    comments: 890,
    shares: 442,
    imageUrl: 'https://images.unsplash.com/photo-1518605368461-1ee7e53f18e9?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '3',
    authorName: 'Matei V.',
    authorAvatar: 'https://i.pravatar.cc/150?u=c944',
    isVerified: false,
    location: 'Cluj-Napoca',
    time: '5h',
    caption: 'Noul stadion este absolut impresionant. Voi ce părere aveti de investiție?',
    hashtags: '#Sport #Cluj',
    tags: [
      { label: 'Sport', type: 'politic' }
    ],
    isFakeNews: false,
    likes: 890,
    comments: 142,
    shares: 55,
    imageUrl: 'https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=800&auto=format&fit=crop'
  }
];

export default function MobileFeed() {
  const [activeTab, setActiveTab] = useState('Pentru Tine');
  const [activeNav, setActiveNav] = useState('home');

  const tabs = ['Pentru Tine', 'Politic', 'Economie', 'Social', 'Artă', 'Sport'];

  const displayedPosts = activeTab === 'Pentru Tine' 
    ? MOCK_POSTS 
    : MOCK_POSTS.filter(p => p.tags.some(t => t.label.toLowerCase() === activeTab.toLowerCase()) || p.hashtags.toLowerCase().includes(activeTab.toLowerCase()));

  if (activeNav !== 'home') {
    return (
      <main className="w-full h-[100dvh] bg-black text-white flex flex-col items-center justify-center max-w-[430px] mx-auto sm:border-x sm:border-gray-800 relative">
        <h1 className="text-2xl font-bold mb-2">Pagină în construcție</h1>
        <p className="text-gray-400">Secțiunea {activeNav} nu este disponibilă încă.</p>
        <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />
      </main>
    );
  }

  return (
    <main className="relative w-full h-[100dvh] bg-black text-white font-sans max-w-[430px] mx-auto sm:border-x sm:border-gray-800 flex flex-col">
      
      {/* STATIC TOP HEADERS (Fixed over scrolling feed) */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-auto pt-2">

        {/* Top Tabs Nav */}
        <div className="flex items-center justify-between px-4 mt-2">
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-[22px]">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-[6px] whitespace-nowrap text-[16px] transition-colors
                  ${activeTab === tab 
                    ? 'text-white font-bold drop-shadow-md' 
                    : 'text-white/60 font-medium hover:text-white drop-shadow-md'
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white rounded-t-sm" />
                )}
              </button>
            ))}
          </div>
          <button className="ml-2 pb-[6px]">
            <Search className="w-[22px] h-[22px] text-white stroke-[2.5] drop-shadow-md" />
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex items-center px-4 mt-3 gap-2">
          <button className="flex items-center gap-1 px-[14px] py-[6px] bg-[#1A1C23]/60 backdrop-blur-md rounded-full text-[13px] font-medium border border-white/5 shadow-sm text-white/90">
            <Clock className="w-3.5 h-3.5" />
            <span>Cronologic</span>
            <ChevronDown className="w-3.5 h-3.5 text-white/60 ml-0.5" />
          </button>
          
          <button className="flex items-center gap-1 px-[14px] py-[6px] bg-blue-500/20 backdrop-blur-md rounded-full text-[13px] font-medium border border-blue-500/30 shadow-sm text-blue-100">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-white">Algoritmic</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-400/80 ml-0.5" />
          </button>
          
          <button className="flex items-center gap-1 px-[14px] py-[6px] bg-[#1A1C23]/60 backdrop-blur-md rounded-full text-[13px] font-medium border border-white/5 shadow-sm text-white/90">
            <ShieldCheck className="w-[15px] h-[15px]" />
            <span>Verificat</span>
          </button>

          <div className="flex-1" />
          <button className="p-1 -mr-1">
            <SlidersHorizontal className="w-[18px] h-[18px] text-white drop-shadow-md" />
          </button>
        </div>
      </div>

      {/* --- SCROLLABLE FEED --- */}
      <div className="flex-1 overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
        {displayedPosts.length > 0 ? (
          displayedPosts.map((post) => (
            <FeedPost key={post.id} post={post} isActive={true} />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-400">Nu am găsit rezultate pentru "{activeTab}"</p>
          </div>
        )}
      </div>

      {/* --- FIXED BOTTOM NAVIGATION --- */}
      <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}

function BottomNav({ activeNav, setActiveNav }: { activeNav: string, setActiveNav: (s: string) => void }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-[85px] bg-[#0A0A0A] border-t border-[#1C1C1E] z-30 px-[26px] pt-3 pb-6 pointer-events-auto flex items-start justify-between">
      <button onClick={() => setActiveNav('home')} className="flex flex-col items-center gap-1 w-[46px]">
        <Home className={`w-[26px] h-[26px] ${activeNav === 'home' ? 'text-white fill-white' : 'text-[#8E8E93]'}`} />
        <span className={`text-[10px] font-bold tracking-wide ${activeNav === 'home' ? 'text-white' : 'text-[#8E8E93]'}`}>Acasă</span>
      </button>

      <button onClick={() => setActiveNav('explore')} className="flex flex-col items-center gap-1 w-[46px]">
        <Compass className={`w-[26px] h-[26px] ${activeNav === 'explore' ? 'text-white' : 'text-[#8E8E93]'}`} />
        <span className={`text-[10px] font-medium tracking-wide ${activeNav === 'explore' ? 'text-white' : 'text-[#8E8E93]'}`}>Explorează</span>
      </button>

      {/* Central Plus Button */}
      <button onClick={() => setActiveNav('create')} className="relative -top-2 w-[54px] h-[38px] bg-gradient-to-tr from-[#3B82F6] via-[#6366F1] to-[#A855F7] rounded-[16px] flex items-center justify-center shadow-[0_4px_18px_rgba(139,92,246,0.6)] active:scale-95 transition-transform">
        <Plus className="w-7 h-7 text-white stroke-[3.5]" />
      </button>

      <button onClick={() => setActiveNav('notifications')} className="flex flex-col items-center gap-1 w-[46px] relative">
        <div className="relative">
          <Bell className={`w-[26px] h-[26px] ${activeNav === 'notifications' ? 'text-white' : 'text-[#8E8E93]'}`} />
          <div className="absolute -top-[1px] right-[1px] w-[15px] h-[15px] bg-[#FF3B30] rounded-full border-2 border-[#0A0A0A] flex items-center justify-center translate-x-1">
            <span className="text-[9px] font-bold text-white leading-none">3</span>
          </div>
        </div>
        <span className={`text-[10px] font-medium tracking-wide ${activeNav === 'notifications' ? 'text-white' : 'text-[#8E8E93]'}`}>Notificări</span>
      </button>

      <button onClick={() => setActiveNav('profile')} className="flex flex-col items-center gap-1 w-[46px]">
        <User className={`w-[26px] h-[26px] ${activeNav === 'profile' ? 'text-white' : 'text-[#8E8E93]'}`} />
        <span className={`text-[10px] font-medium tracking-wide ${activeNav === 'profile' ? 'text-white' : 'text-[#8E8E93]'}`}>Profil</span>
      </button>
    </div>
  );
}
