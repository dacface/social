"use client";

import React, { useState, useEffect } from 'react';
import { 
  Menu, Plus, Search, MessageCircle, ImageIcon,
  Home, PlaySquare, Users, Bell, UserCircle2
} from 'lucide-react';
import FeedPost, { Post } from '@/components/FeedPost';
import ProfileView from '@/components/ProfileView';
import CreatePostModal from '@/components/CreatePostModal';
import CreateReelModal from '@/components/CreateReelModal';
import ReelsView from '@/components/ReelsView';
import CreateStoryModal from '@/components/CreateStoryModal';
import StoriesBar from '@/components/StoriesBar';
import StoryViewer from '@/components/StoryViewer';
import type { StoryRecord } from '@/lib/stories';



export default function Feed() {
  const [activeNav, setActiveNav] = useState('home');
  const [posts, setPosts] = useState<Post[]>([]);
  const [reels, setReels] = useState<Post[]>([]);
  const [stories, setStories] = useState<StoryRecord[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateReelModal, setShowCreateReelModal] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingReels, setLoadingReels] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [reelsError, setReelsError] = useState('');

  const handlePostCreated = (newPost: Post) => {
    setFeedError('');
    setPosts(prev => [newPost, ...prev]);
  };

  const handleReelCreated = (newReel: Post) => {
    setReelsError('');
    setReels(prev => [newReel, ...prev]);
    setActiveNav('reels');
  };

  const handleStoryCreated = (newStory: StoryRecord) => {
    setStories((prev) => [newStory, ...prev]);
    setActiveStoryIndex(0);
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

  useEffect(() => {
    async function fetchReels() {
      try {
        setLoadingReels(true);
        setReelsError('');
        const res = await fetch('/api/reels?limit=8', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          console.error('[Reels] Failed to load reels', data);
          throw new Error(data.error || 'Reels-urile nu au putut fi încărcate.');
        }

        setReels(Array.isArray(data.reels) ? data.reels : []);
      } catch (err) {
        console.error('[Reels] Failed to fetch reels from Firestore', err);
        setReelsError('Reels-urile nu au putut fi încărcate. Încearcă din nou.');
      } finally {
        setLoadingReels(false);
      }
    }

    fetchReels();
  }, []);

  useEffect(() => {
    async function fetchStories() {
      try {
        setLoadingStories(true);
        const res = await fetch('/api/stories?limit=12', { cache: 'no-store' });
        const data = await res.json();

        if (!res.ok) {
          console.error('[Stories] Failed to load stories', data);
          throw new Error(data.error || 'Story-urile nu au putut fi încărcate.');
        }

        setStories(Array.isArray(data.stories) ? data.stories : []);
      } catch (err) {
        console.error('[Stories] Failed to fetch stories from Firestore', err);
      } finally {
        setLoadingStories(false);
      }
    }

    fetchStories();
  }, []);

  const openPrimaryComposer = () => {
    if (activeNav === 'reels') {
      setShowCreateReelModal(true);
      return;
    }

    setShowCreateModal(true);
  };

  return (
    <main className={`w-full min-h-screen font-sans pb-[70px] sm:pb-0 ${activeNav === 'reels' ? 'bg-black' : 'bg-[#c9ccd1]'}`}>
      <div className={`${activeNav === 'reels' ? 'bg-black' : 'bg-white'} max-w-[600px] mx-auto min-h-screen shadow-sm relative`}>
        
        {activeNav === 'profile' ? (
          <ProfileView />
        ) : activeNav === 'reels' ? (
          <ReelsView reels={reels} loading={loadingReels} error={reelsError} onCreateReel={() => setShowCreateReelModal(true)} />
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
                  <IconButton icon={<Plus className="w-[22px] h-[22px]" />} onClick={openPrimaryComposer} />
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
            <StoriesBar
              stories={stories}
              loading={loadingStories}
              onCreateStory={() => setShowCreateStoryModal(true)}
              onOpenStory={(index) => setActiveStoryIndex(index)}
            />

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
        <CreateReelModal
          isOpen={showCreateReelModal}
          onClose={() => setShowCreateReelModal(false)}
          onReelCreated={handleReelCreated}
        />
        <CreateStoryModal
          isOpen={showCreateStoryModal}
          onClose={() => setShowCreateStoryModal(false)}
          onStoryCreated={handleStoryCreated}
        />
        <StoryViewer
          stories={stories}
          startIndex={activeStoryIndex ?? 0}
          isOpen={activeStoryIndex !== null}
          onClose={() => setActiveStoryIndex(null)}
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

function IconButton({ icon, badge, onClick }: { icon: React.ReactNode, badge?: string, onClick?: () => void }) {
  return (
    <button onClick={onClick} className="relative w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors text-black">
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
