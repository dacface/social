"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  Menu, Plus, Search,
  Home, PlaySquare, Users, Bell, UserCircle2, X
} from 'lucide-react';
import FeedPost, { Post } from '@/components/FeedPost';
import ProfileView from '@/components/ProfileView';
import CreatePostModal from '@/components/CreatePostModal';
import CreateReelModal from '@/components/CreateReelModal';
import ReelsView from '@/components/ReelsView';
import CreateStoryModal from '@/components/CreateStoryModal';
import StoriesBar from '@/components/StoriesBar';
import StoryViewer from '@/components/StoryViewer';
import MarketplaceView from '@/components/MarketplaceView';
import EventsView from '@/components/EventsView';
import SavedView from '@/components/SavedView';
import GroupsView from '@/components/GroupsView';
import PagesView from '@/components/PagesView';
import MessagesView from '@/components/MessagesView';
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
  const [activeUtilityPanel, setActiveUtilityPanel] = useState<null | 'menu' | 'search' | 'messages'>(null);
  const [activeShortcutView, setActiveShortcutView] = useState<null | 'saved' | 'marketplace' | 'events' | 'groups' | 'pages' | 'messages'>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingReels, setLoadingReels] = useState(true);
  const [loadingStories, setLoadingStories] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [reelsError, setReelsError] = useState('');
  const [utilityToast, setUtilityToast] = useState('');
  const [isChromeHidden, setIsChromeHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollDeltaRef = useRef(0);
  const lastDirectionRef = useRef<1 | -1 | 0>(0);
  const rafRef = useRef<number | null>(null);
  const isChromeHiddenRef = useRef(false);

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

  useEffect(() => {
    if (!utilityToast) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setUtilityToast('');
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [utilityToast]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldAutoHideChrome =
      activeNav === 'home' &&
      activeShortcutView === null &&
      activeUtilityPanel === null &&
      activeStoryIndex === null;

    if (!shouldAutoHideChrome) {
      setIsChromeHidden(false);
      isChromeHiddenRef.current = false;
      return;
    }

    lastScrollYRef.current = window.scrollY;
    scrollDeltaRef.current = 0;
    lastDirectionRef.current = 0;

    const updateChromeVisibility = () => {
      rafRef.current = null;

      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollYRef.current;
      lastScrollYRef.current = currentScrollY;

      if (currentScrollY <= 24) {
        scrollDeltaRef.current = 0;
        lastDirectionRef.current = 0;
        if (isChromeHiddenRef.current) {
          isChromeHiddenRef.current = false;
          setIsChromeHidden(false);
        }
        return;
      }

      if (Math.abs(delta) < 2) {
        return;
      }

      const direction: 1 | -1 = delta > 0 ? 1 : -1;

      if (lastDirectionRef.current !== direction) {
        scrollDeltaRef.current = delta;
        lastDirectionRef.current = direction;
      } else {
        scrollDeltaRef.current += delta;
      }

      if (!isChromeHiddenRef.current && scrollDeltaRef.current >= 30) {
        isChromeHiddenRef.current = true;
        scrollDeltaRef.current = 0;
        setIsChromeHidden(true);
        return;
      }

      if (isChromeHiddenRef.current && scrollDeltaRef.current <= -18) {
        isChromeHiddenRef.current = false;
        scrollDeltaRef.current = 0;
        setIsChromeHidden(false);
      }
    };

    const handleScroll = () => {
      if (rafRef.current !== null) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(updateChromeVisibility);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [activeNav, activeShortcutView, activeUtilityPanel, activeStoryIndex]);

  const handleMenuAction = (action: 'saved' | 'stories' | 'marketplace' | 'events') => {
    if (action === 'stories') {
      setActiveUtilityPanel(null);
      setShowCreateStoryModal(true);
      return;
    }

    if (action === 'saved') {
      setActiveUtilityPanel(null);
      setActiveShortcutView('saved');
      return;
    }

    setActiveUtilityPanel(null);
    setActiveShortcutView(action);
  };

  return (
    <main className={`w-full min-h-screen font-sans pb-[70px] sm:pb-0 ${activeNav === 'reels' ? 'bg-black' : 'bg-[#c9ccd1]'}`}>
      <div className={`${activeNav === 'reels' ? 'bg-black' : 'bg-white'} max-w-[600px] mx-auto min-h-screen shadow-sm relative`}>
        
        {activeShortcutView === 'saved' ? (
          <SavedView />
        ) : activeShortcutView === 'marketplace' ? (
          <MarketplaceView />
        ) : activeShortcutView === 'events' ? (
          <EventsView />
        ) : activeShortcutView === 'groups' ? (
          <GroupsView />
        ) : activeShortcutView === 'pages' ? (
          <PagesView />
        ) : activeShortcutView === 'messages' ? (
          <MessagesView />
        ) : activeNav === 'profile' ? (
          <ProfileView />
        ) : activeNav === 'reels' ? (
          <ReelsView reels={reels} loading={loadingReels} error={reelsError} onCreateReel={() => setShowCreateReelModal(true)} />
        ) : activeNav === 'friends' ? (
          <FriendsView />
        ) : activeNav === 'notifications' ? (
          <NotificationsView />
        ) : (
          <>
            {/* Top Navigation */}
            <div className="sticky top-0 z-40 h-[57px] bg-transparent">
              <div
                className={`absolute inset-x-0 top-0 bg-white transition-transform duration-300 ease-out ${
                  isChromeHidden ? 'pointer-events-none -translate-y-full' : 'translate-y-0'
                }`}
              >
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-2">
                {/* Left elements */}
                <div className="flex items-center gap-3">
                  <button onClick={() => setActiveUtilityPanel('menu')} className="text-gray-900 group">
                    <Menu className="w-[26px] h-[26px] group-hover:bg-gray-100 rounded-sm" />
                  </button>
                  <h1 className="ml-1 text-[26px] font-[680] tracking-[-0.05em] text-[#1877F2]">
                    dacface
                  </h1>
                </div>

                {/* Right icons */}
                <div className="flex items-center gap-2">
                  <IconButton icon={<Plus className="w-[22px] h-[22px]" />} onClick={openPrimaryComposer} />
                  <IconButton icon={<Search className="w-[22px] h-[22px]" />} onClick={() => setActiveUtilityPanel('search')} />
                  <IconButton
                    icon={<MessagesBubbleIcon />}
                    badge="2"
                    onClick={() => {
                      setActiveUtilityPanel(null);
                      setActiveShortcutView('messages');
                    }}
                  />
                </div>
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
              <button onClick={() => setShowCreateModal(true)} className="p-1" aria-label="Adaugă media">
                <CreateMediaIcon />
              </button>
            </div>

            {/* Thick Separator */}
            <div className="w-full h-[2px] bg-[#c9ccd1]" />

            {/* Stories Section */}
            <StoriesBar
              stories={stories}
              loading={loadingStories}
              onCreateStory={() => setShowCreateStoryModal(true)}
              onOpenStory={(index) => setActiveStoryIndex(index)}
            />

            {/* Thick Separator */}
            <div className="w-full h-[2px] bg-[#c9ccd1]" />

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
                    <div className="w-full h-[2px] bg-[#c9ccd1]" />
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
        <BottomNav
          activeNav={activeNav}
          setActiveNav={setActiveNav}
          onNavigate={() => setActiveShortcutView(null)}
          isHidden={isChromeHidden}
        />

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
        {activeStoryIndex !== null ? (
          <StoryViewer
            key={`story-viewer-${activeStoryIndex}`}
            stories={stories}
            startIndex={activeStoryIndex}
            isOpen={true}
            onClose={() => setActiveStoryIndex(null)}
          />
        ) : null}
        <UtilityPanel
          kind={activeUtilityPanel}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onMenuAction={handleMenuAction}
          onOpenProfile={() => {
            setActiveUtilityPanel(null);
            setActiveShortcutView(null);
            setActiveNav('profile');
          }}
          onOpenReels={() => {
            setActiveUtilityPanel(null);
            setActiveShortcutView(null);
            setActiveNav('reels');
          }}
          onOpenShortcutView={(view) => {
            setActiveUtilityPanel(null);
            setActiveShortcutView(view);
          }}
          onClose={() => setActiveUtilityPanel(null)}
        />
        {utilityToast ? (
          <div className="fixed inset-x-0 bottom-24 z-[90] flex justify-center px-4">
            <div className="rounded-full bg-[#1C1E21] px-4 py-2 text-[13px] font-semibold text-white shadow-xl">
              {utilityToast}
            </div>
          </div>
        ) : null}

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
    <button onClick={onClick} className="relative flex h-10 w-10 items-center justify-center rounded-full bg-[#F3F4F6] text-black transition-colors hover:bg-[#E8EBEF]">
      {icon}
      {badge && (
        <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-red-600 border-[2px] border-white text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none z-10">
          {badge}
        </span>
      )}
    </button>
  );
}

function CreateMediaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[24px] w-[24px]" fill="none" aria-hidden="true">
      <path
        d="M9 4.4h8.2c1.9 0 3 1.05 3 2.95v8.15"
        stroke="#3183F7"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="3.9" y="6.6" width="14.2" height="14.2" rx="3.2" fill="#3183F7" />
      <path
        d="M11 10.2v7"
        stroke="#FFFFFF"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M7.5 13.7h7"
        stroke="#FFFFFF"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessagesBubbleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[28px] w-[28px]" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9.35" fill="#3498F4" />
      <path
        d="M12 7.2c-3.68 0-6.63 2.47-6.63 5.58 0 1.38.6 2.66 1.7 3.64l-.58 2.28 2.3-1.15c.96.33 2.04.51 3.2.51 3.67 0 6.62-2.47 6.62-5.58S15.67 7.2 12 7.2Z"
        fill="#FFFFFF"
      />
      <circle cx="9.3" cy="12.7" r="0.98" fill="#3498F4" />
      <circle cx="12" cy="12.7" r="0.98" fill="#3498F4" />
      <circle cx="14.7" cy="12.7" r="0.98" fill="#3498F4" />
    </svg>
  );
}

function BottomNav({
  activeNav,
  setActiveNav,
  onNavigate,
  isHidden,
}: {
  activeNav: string;
  setActiveNav: (s: string) => void;
  onNavigate: () => void;
  isHidden?: boolean;
}) {
  return (
    <div
      className={`fixed sm:static bottom-0 left-0 right-0 z-50 flex h-[62px] items-center justify-around border-t border-[#E6E9EE] bg-white/96 px-1 pb-safe shadow-[0_-8px_24px_rgba(17,20,24,0.06)] backdrop-blur-md transition-transform duration-300 ease-out ${
        isHidden ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <NavButton id="home" icon={Home} label="Acasă" activeNav={activeNav} setActiveNav={setActiveNav} onNavigate={onNavigate} isBlue={true} />
      <NavButton id="reels" icon={PlaySquare} label="Reels" activeNav={activeNav} setActiveNav={setActiveNav} onNavigate={onNavigate} />
      <NavButton id="friends" icon={Users} label="Prieteni" activeNav={activeNav} setActiveNav={setActiveNav} onNavigate={onNavigate} />
      <NavButton id="notifications" icon={Bell} label="Notificări" activeNav={activeNav} setActiveNav={setActiveNav} onNavigate={onNavigate} badge="1" />
      <NavButton id="profile" icon={UserCircle2} label="Profil" activeNav={activeNav} setActiveNav={setActiveNav} onNavigate={onNavigate} />
    </div>
  );
}

function UtilityPanel({
  kind,
  searchQuery,
  onSearchChange,
  onMenuAction,
  onOpenProfile,
  onOpenReels,
  onOpenShortcutView,
  onClose,
}: {
  kind: null | 'menu' | 'search' | 'messages';
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onMenuAction: (action: 'saved' | 'stories' | 'marketplace' | 'events') => void;
  onOpenProfile: () => void;
  onOpenReels: () => void;
  onOpenShortcutView: (view: 'saved' | 'marketplace' | 'events' | 'groups' | 'pages' | 'messages') => void;
  onClose: () => void;
}) {
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [messageDraft, setMessageDraft] = useState('');

  if (!kind) {
    return null;
  }

  const messageThreads = [
    { id: 'thread-alexandra', name: 'Alexandra Rus', preview: 'Ți-a trimis un răspuns la discuția despre fact-checking.' },
    { id: 'thread-dacface', name: 'Echipa Dacface', preview: 'Funcția de mesagerie completă este în curs de extindere.' },
  ];

  const searchDestinations = [
    { id: 'search-profile', label: 'Profilul tău', description: 'Deschide profilul', onClick: onOpenProfile },
    { id: 'search-marketplace', label: 'Marketplace', description: 'Vezi anunțuri locale', onClick: () => onOpenShortcutView('marketplace') },
    { id: 'search-events', label: 'Evenimente', description: 'Descoperă evenimente', onClick: () => onOpenShortcutView('events') },
    { id: 'search-saved', label: 'Salvate', description: 'Colecțiile tale', onClick: () => onOpenShortcutView('saved') },
    { id: 'search-groups', label: 'Grupuri', description: 'Intră în comunități tematice', onClick: () => onOpenShortcutView('groups') },
    { id: 'search-pages', label: 'Pagini', description: 'Vezi pagini și branduri', onClick: () => onOpenShortcutView('pages') },
    { id: 'search-messages', label: 'Mesaje', description: 'Deschide inbox-ul complet', onClick: () => onOpenShortcutView('messages') },
    { id: 'search-reels', label: 'Reels', description: 'Deschide fluxul vertical', onClick: onOpenReels },
  ].filter((item) => {
    if (!searchQuery.trim()) {
      return true;
    }

    const haystack = `${item.label} ${item.description}`.toLowerCase();
    return haystack.includes(searchQuery.trim().toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-[85] bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="mx-auto mt-16 w-[min(92vw,560px)] rounded-[24px] bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
          <div className="text-[17px] font-bold text-[#050505]">
            {kind === 'menu' ? 'Meniu rapid' : kind === 'search' ? 'Căutare' : 'Mesaje'}
          </div>
          <button onClick={onClose} className="rounded-full bg-gray-100 p-2 text-[#050505]">
            <X className="h-5 w-5" />
          </button>
        </div>

        {kind === 'menu' ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {[
              { label: 'Salvate', action: 'saved' as const },
              { label: 'Story-uri', action: 'stories' as const },
              { label: 'Marketplace', action: 'marketplace' as const },
              { label: 'Evenimente', action: 'events' as const },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onMenuAction(item.action)}
                className="rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-5 text-left text-[15px] font-semibold text-[#050505] hover:bg-[#EEF1F5]"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => onOpenShortcutView('groups')}
              className="rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-5 text-left text-[15px] font-semibold text-[#050505] hover:bg-[#EEF1F5]"
            >
              Grupuri
            </button>
            <button
              onClick={() => onOpenShortcutView('pages')}
              className="rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-5 text-left text-[15px] font-semibold text-[#050505] hover:bg-[#EEF1F5]"
            >
              Pagini
            </button>
          </div>
        ) : null}

        {kind === 'search' ? (
          <div className="p-4">
            <input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Caută persoane, postări sau subiecte"
              className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] text-[#050505] outline-none"
            />
            <div className="mt-4 space-y-2">
              {searchDestinations.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-4 text-left hover:bg-[#EEF1F5]"
                >
                  <div className="text-[15px] font-semibold text-[#050505]">{item.label}</div>
                  <div className="mt-1 text-[13px] text-[#65676b]">{item.description}</div>
                </button>
              ))}
              {searchDestinations.length === 0 ? (
                <div className="rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-4 text-[14px] text-[#65676b]">
                  Nu am găsit nimic pentru căutarea asta.
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        {kind === 'messages' ? (
          <div className="p-4">
            <div className="space-y-3">
              {messageThreads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setMessageDraft('');
                  }}
                  className={`w-full rounded-2xl border p-4 text-left ${
                    activeThreadId === thread.id ? 'border-[#1877F2] bg-[#E7F3FF]' : 'border-gray-200 bg-[#F7F8FA]'
                  }`}
                >
                  <div className="text-[15px] font-semibold text-[#050505]">{thread.name}</div>
                  <div className="mt-1 text-[14px] text-[#65676b]">{thread.preview}</div>
                </button>
              ))}
            </div>

            {activeThreadId ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-[15px] font-semibold text-[#050505]">
                  Scrie către {messageThreads.find((thread) => thread.id === activeThreadId)?.name}
                </div>
                <textarea
                  value={messageDraft}
                  onChange={(event) => setMessageDraft(event.target.value)}
                  placeholder="Trimite un mesaj rapid"
                  className="mt-3 min-h-[120px] w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => {
                      setMessageDraft('');
                      onClose();
                    }}
                    disabled={!messageDraft.trim()}
                    className="rounded-xl bg-[#1877F2] px-4 py-2 text-[14px] font-semibold text-white disabled:bg-[#B9D4FB]"
                  >
                    Trimite
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FriendsView() {
  const [suggestions, setSuggestions] = useState([
    { id: 'friend-andrei', name: 'Andrei Popescu', meta: '12 prieteni comuni', avatar: 'https://i.pravatar.cc/150?u=friend-andrei' },
    { id: 'friend-mara', name: 'Mara Ionescu', meta: '8 prieteni comuni', avatar: 'https://i.pravatar.cc/150?u=friend-mara' },
  ]);

  const handleRemoveSuggestion = (id: string) => {
    setSuggestions((current) => current.filter((friend) => friend.id !== id));
  };

  const handleAcceptSuggestion = (id: string) => {
    setSuggestions((current) =>
      current.map((friend) =>
        friend.id === id ? { ...friend, meta: 'Cerere trimisă' } : friend
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 shadow-sm">
        <h2 className="text-[24px] font-bold text-[#050505]">Prieteni</h2>
        <p className="mt-1 text-[14px] text-[#65676b]">Sugestii și cereri, organizate ca în fluxul Facebook.</p>
      </div>

      <div className="space-y-3 p-3">
        {suggestions.map((friend) => (
          <div key={friend.id} className="rounded-[22px] bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <img src={friend.avatar} alt={friend.name} className="h-16 w-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-[16px] font-bold text-[#050505]">{friend.name}</div>
                <div className="mt-1 text-[14px] text-[#65676b]">{friend.meta}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAcceptSuggestion(friend.id)}
                className="rounded-xl bg-[#1877F2] px-4 py-3 text-[15px] font-semibold text-white"
              >
                {friend.meta === 'Cerere trimisă' ? 'Trimisă' : 'Adaugă'}
              </button>
              <button
                onClick={() => handleRemoveSuggestion(friend.id)}
                className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]"
              >
                Elimină
              </button>
            </div>
          </div>
        ))}
        {suggestions.length === 0 ? (
          <div className="rounded-[22px] bg-white p-6 text-center shadow-sm">
            <div className="text-[16px] font-semibold text-[#050505]">Ai epuizat sugestiile deocamdată.</div>
            <div className="mt-1 text-[14px] text-[#65676b]">Revino mai târziu pentru recomandări noi.</div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function NotificationsView() {
  const [notifications, setNotifications] = useState([
    { id: 'notif-1', message: 'Alexandra Rus a comentat la postarea ta despre fact-checking.', time: 'Chiar acum', read: false },
    { id: 'notif-2', message: 'Story-ul tău a fost văzut de 18 persoane în ultima oră.', time: 'Chiar acum', read: false },
    { id: 'notif-3', message: 'Un nou Reel din zona ta începe să prindă tracțiune.', time: 'Chiar acum', read: false },
  ]);

  const markAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-40 bg-white px-4 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[24px] font-bold text-[#050505]">Notificări</h2>
            <p className="mt-1 text-[14px] text-[#65676b]">Actualizări recente, într-un singur loc.</p>
          </div>
          <button
            onClick={markAllRead}
            className="rounded-full bg-[#E7F3FF] px-4 py-2 text-[14px] font-semibold text-[#1877F2]"
          >
            Marchează toate ca citite
          </button>
        </div>
      </div>

      <div className="space-y-3 p-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-[22px] p-4 shadow-sm ${notification.read ? 'bg-white' : 'bg-[#E7F3FF]'}`}
          >
            <div className="text-[15px] font-semibold text-[#050505]">{notification.message}</div>
            <div className="mt-2 text-[13px] text-[#65676b]">{notification.read ? 'Citită' : notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface NavButtonProps {
  id: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  activeNav: string;
  setActiveNav: (value: string) => void;
  onNavigate: () => void;
  badge?: string;
  isBlue?: boolean;
}

function NavButton({ id, icon: Icon, label, activeNav, setActiveNav, onNavigate, badge, isBlue }: NavButtonProps) {
  const isActive = activeNav === id;
  const colorClass = (isActive || isBlue && id === 'home' && isActive) ? 'text-[#1877F2]' : 'text-[#65676b]';
  const fillClass = isActive ? 'fill-current' : '';

  return (
    <button 
      onClick={() => {
        onNavigate();
        setActiveNav(id);
      }}
      className="relative flex h-full w-[68px] flex-col items-center justify-center"
    >
      <div className="relative mb-[3px]">
        <Icon className={`h-[27px] w-[27px] ${colorClass} ${fillClass}`} strokeWidth={isActive ? 2.35 : 1.9} />
        {badge && (
          <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#E41E3F] rounded-full border-2 border-white flex items-center justify-center px-1">
            <span className="text-[10px] font-bold text-white leading-none">{badge}</span>
          </div>
        )}
      </div>
      <span className={`text-[10px] font-[620] tracking-[-0.02em] ${colorClass}`}>
        {label}
      </span>
    </button>
  );
}
