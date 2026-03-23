"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, Plus, Search, ThumbsUp } from 'lucide-react';

interface PageItem {
  id: string;
  name: string;
  category: string;
  followers: number;
  avatarUrl: string;
  isVerified: boolean;
}

const INITIAL_PAGES: PageItem[] = [
  {
    id: 'p1',
    name: 'TechStart România',
    category: 'Companie media',
    followers: 45200,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-techstart',
    isVerified: true,
  },
  {
    id: 'p2',
    name: 'Nordia Homes',
    category: 'Brand imobiliar',
    followers: 12600,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-nordia',
    isVerified: false,
  },
  {
    id: 'p3',
    name: 'Bucharest Street Food',
    category: 'Comunitate locală',
    followers: 8800,
    avatarUrl: 'https://i.pravatar.cc/200?u=page-food',
    isVerified: true,
  },
];

export default function PagesView() {
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState<PageItem[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftCategory, setDraftCategory] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadPages() {
      try {
        const response = await fetch('/api/pages', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load pages');
        }

        if (!cancelled) {
          setPages(Array.isArray(data.pages) ? data.pages : INITIAL_PAGES);
        }
      } catch {
        if (!cancelled) {
          setPages(INITIAL_PAGES);
        }
      }
    }

    loadPages();

    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePages = useMemo(
    () => pages.filter((page) => `${page.name} ${page.category}`.toLowerCase().includes(query.trim().toLowerCase())),
    [pages, query]
  );

  const togglePageLike = async (pageId: string, liked: boolean) => {
    setLikedIds((current) => (liked ? current.filter((value) => value !== pageId) : [...current, pageId]));
    setPages((current) =>
      current.map((page) => (page.id === pageId ? { ...page, followers: page.followers + (liked ? -1 : 1) } : page))
    );

    try {
      await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: liked ? 'unlike' : 'like', pageId, userId: 'current_user' }),
      });
    } catch {
      // Keep optimistic UI if the request fails.
    }
  };

  const createPage = async () => {
    if (!draftName.trim() || !draftCategory.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: draftName, category: draftCategory, userId: 'current_user' }),
      });
      const data = await response.json();

      if (response.ok && data.page) {
        setPages((current) => [data.page, ...current]);
      }
    } catch {
      setPages((current) => [
        {
          id: `page-local-${Date.now()}`,
          name: draftName,
          category: draftCategory,
          followers: 0,
          avatarUrl: `https://i.pravatar.cc/200?u=${Date.now()}`,
          isVerified: false,
        },
        ...current,
      ]);
    }

    setDraftName('');
    setDraftCategory('');
    setIsCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white px-4 pb-4 pt-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[28px] font-bold tracking-tight text-[#050505]">Pagini</div>
            <div className="text-[14px] text-[#65676b]">Branduri, organizații și creatori, într-un loc dedicat.</div>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-[14px] font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            Creează
          </button>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F0F2F5] px-4 py-3">
          <Search className="h-5 w-5 text-[#65676b]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Caută pagini"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#65676b]"
          />
        </div>
      </div>

      <div className="space-y-3 p-3">
        {visiblePages.map((page) => {
          const liked = likedIds.includes(page.id);

          return (
            <article key={page.id} className="rounded-[24px] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={page.avatarUrl} alt={page.name} className="h-16 w-16 rounded-2xl object-cover" />
                <div className="flex-1">
                  <div className="flex items-center gap-1 text-[17px] font-bold text-[#050505]">
                    <span>{page.name}</span>
                    {page.isVerified ? <BadgeCheck className="h-4 w-4 text-[#1877F2]" /> : null}
                  </div>
                  <div className="mt-1 text-[14px] text-[#65676b]">{page.category}</div>
                  <div className="mt-1 text-[13px] font-semibold text-[#65676b]">{page.followers.toLocaleString('ro-RO')} urmăritori</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  onClick={() => togglePageLike(page.id, liked)}
                  className={`rounded-xl px-4 py-3 text-[15px] font-semibold ${
                    liked ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#1877F2] text-white'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ThumbsUp className="h-4 w-4" />
                    {liked ? 'Îți place' : 'Apreciază'}
                  </span>
                </button>
                <button className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]">
                  Vezi pagina
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="text-[18px] font-bold text-[#050505]">Creează pagină</div>
            <div className="mt-3 space-y-3">
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none"
                placeholder="Nume pagină"
              />
              <input
                value={draftCategory}
                onChange={(event) => setDraftCategory(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none"
                placeholder="Categorie"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setIsCreateOpen(false)} className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]">
                Renunță
              </button>
              <button onClick={createPage} className="rounded-xl bg-[#1877F2] px-4 py-3 text-[15px] font-semibold text-white">
                Creează
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
