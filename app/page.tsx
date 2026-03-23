"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, Plus, Search, MessageCircle, ImageIcon,
  Home, PlaySquare, Users, Bell, UserCircle2
} from 'lucide-react';
import FeedPost, { Post } from '@/components/FeedPost';
import ProfileView from '@/components/ProfileView';
import CreatePostModal from '@/components/CreatePostModal';

const MOCK_STORIES = [
  { id: 1, name: "Aiana Maria Rada", avatar: "https://i.pravatar.cc/150?u=1", image: "https://images.unsplash.com/photo-1541872596495-25b8431945ae?q=80&w=400&auto=format&fit=crop" },
  { id: 2, name: "Alexandra Rus", avatar: "https://i.pravatar.cc/150?u=2", image: "https://images.unsplash.com/photo-1518605368461-1ee7e53f18e9?q=80&w=400&auto=format&fit=crop" },
  { id: 3, name: "Diana Manta", avatar: "https://i.pravatar.cc/150?u=3", image: "https://images.unsplash.com/photo-1555529733-0e670560f7e1?q=80&w=400&auto=format&fit=crop" },
  { id: 4, name: "Nadia Ghannou...", avatar: "https://i.pravatar.cc/150?u=4", image: "https://images.unsplash.com/photo-1500622944204-b135684e99fd?q=80&w=400&auto=format&fit=crop" },
];



export default function Feed() {
  const [activeNav, setActiveNav] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [feedError, setFeedError] = useState('');

  const handlePostCreated = (newPost: Post) => {
    setFeedError('');
    setPosts(prev => [newPost, ...prev]);
  };

  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoadingPosts(true);
        setFeedError('');
        const res = await fetch('/api/feed?limit=20', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          console.error('[Feed] Failed to load feed', data);
          throw new Error(data.error || 'Feed-ul nu a putut fi încărcat.');
        }

        setPosts(Array.isArray(data.posts) ? data.posts : []);
      } catch (err) {
        console.error('[Feed] Failed to fetch posts from Firestore', err);
        setFeedError('Feed-ul nu a putut fi încărcat. Încearcă din nou.');
      } finally {
        setLoadingPosts(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <main className="w-full min-h-screen bg-[#c9ccd1] font-sans pb-[70px] sm:pb-0">
      <div className="bg-white max-w-[600px] mx-auto min-h-screen shadow-sm relative">
        
        {activeNav === 'profile' ? (
          <ProfileView />
        ) : (
          <>
            {/* Top Navigation */}
            <div className="sticky top-0 z-40 bg-white">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                {/* Left elements */}
                <div className="flex items-center gap-3">
                  <button className="text-gray-900 group">
                    <Menu className="w-[26px] h-[26px] group-hover:bg-gray-100 rounded-sm" />
                  </button>
                  <h1 className="text-[26px] font-bold text-[#1877F2] tracking-tighter ml-1 drop-shadow-sm font-['Inter',sans-serif]">dacface</h1>
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                  <IconButton icon={<Plus className="w-[22px] h-[22px]" />} />
                  <IconButton icon={<Search className="w-[22px] h-[22px]" />} />
                  <IconButton icon={<MessageCircle className="w-[22px] h-[22px] fill-current" />} badge="2" />
                </div>
              </div>
            </div>

            {/* Post Creator */}
            <div className="px-4 py-3 bg-white flex items-center gap-3">
              <img 
                src="https://i.pravatar.cc/150?u=current_user" 
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                alt="You"
              />
              <button 
                onClick={() => setShowCreateModal(true)}
                className="flex-1 text-left px-4 py-2 bg-white border border-gray-300 rounded-full text-[15px] font-normal text-gray-900 hover:bg-gray-50 transition-colors"
              >
                La ce te gândești?
              </button>
              <button onClick={() => setShowCreateModal(true)} className="p-1">
                <ImageIcon className="w-6 h-6 text-gray-500 fill-gray-500/20" />
              </button>
            </div>

            {/* Thick Separator */}
            <div className="w-full h-2 bg-[#c9ccd1]" />

            {/* Stories Section */}
            <div className="bg-white pt-3 pb-4">
              <div className="flex overflow-x-auto gap-2 px-4 no-scrollbar">
                {MOCK_STORIES.map((story) => (
                  <div 
                    key={story.id} 
                    className="relative flex-none w-[100px] h-[170px] rounded-xl overflow-hidden shadow-sm border border-black/10 group cursor-pointer"
                  >
                    <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
                    
                    {/* Story Avatar */}
                    <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-[#1877F2] overflow-hidden bg-white">
                      <img src={story.avatar} alt={story.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Story Name */}
                    <span className="absolute bottom-2 left-2 right-2 text-white text-[13px] font-semibold leading-tight drop-shadow-md">
                      {story.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Thick Separator */}
            <div className="w-full h-2 bg-[#c9ccd1]" />

            {/* FEED LOOP */}
            <div className="flex flex-col">
              {loadingPosts ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-3 border-gray-300 border-t-[#1877F2] rounded-full animate-spin" />
                </div>
              ) : feedError ? (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white">
                  <p className="text-[16px] font-semibold text-[#65676b] text-center">{feedError}</p>
                </div>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <React.Fragment key={post.id}>
                    <FeedPost post={post} />
                    <div className="w-full h-2 bg-[#c9ccd1]" />
                  </React.Fragment>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 px-4 bg-white">
                  <p className="text-[16px] font-semibold text-[#65676b] text-center">Nu există postări încă.</p>
                  <p className="text-[14px] text-[#65676b] mt-1 text-center">Creează prima ta postare!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* BOTTOM NAV BAR */}
        <BottomNav activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* CREATE POST MODAL */}
        <CreatePostModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
          onPostCreated={handlePostCreated} 
        />

      </div>

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

function IconButton({ icon, badge }: { icon: React.ReactNode, badge?: string }) {
  return (
    <button className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-black">
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-600 border-[2px] border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none z-10">
          {badge}
        </span>
      )}
    </button>
  );
}

function BottomNav({ activeNav, setActiveNav }: { activeNav: string, setActiveNav: (s: string) => void }) {
  return (
    <div className="fixed sm:static bottom-0 left-0 right-0 h-[60px] bg-white border-t border-gray-200 z-50 px-1 flex items-center justify-around pb-safe">
      <NavButton id="home" icon={Home} label="Acasă" activeNav={activeNav} setActiveNav={setActiveNav} isBlue={true} />
      <NavButton id="reels" icon={PlaySquare} label="Reels" activeNav={activeNav} setActiveNav={setActiveNav} />
      <NavButton id="friends" icon={Users} label="Prieteni" activeNav={activeNav} setActiveNav={setActiveNav} />
      <NavButton id="notifications" icon={Bell} label="Notificări" activeNav={activeNav} setActiveNav={setActiveNav} badge="1" />
      <NavButton id="profile" icon={UserCircle2} label="Profil" activeNav={activeNav} setActiveNav={setActiveNav} />
    </div>
  );
}

interface NavButtonProps {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  activeNav: string;
  setActiveNav: (value: string) => void;
  badge?: string;
  isBlue?: boolean;
}

function NavButton({ id, icon: Icon, label, activeNav, setActiveNav, badge, isBlue }: NavButtonProps) {
  const isActive = activeNav === id;
  const colorClass = (isActive || isBlue && id === 'home' && isActive) ? 'text-[#1877F2]' : 'text-[#65676b]';
  const fillClass = isActive ? 'fill-current' : '';

  return (
    <button 
      onClick={() => setActiveNav(id)} 
      className="flex flex-col items-center justify-center w-[64px] h-full relative"
    >
      <div className="relative mb-1">
        <Icon className={`w-7 h-7 ${colorClass} ${fillClass}`} strokeWidth={isActive ? 2.5 : 2} />
        {badge && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E41E3F] rounded-full border-2 border-white flex items-center justify-center px-1">
            <span className="text-[10px] font-bold text-white leading-none">{badge}</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-medium tracking-wide ${colorClass}`}>
        {label}
      </span>
    </button>
  );
}
