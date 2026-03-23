"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { Lock, Plus, Search, Users, X } from 'lucide-react';

interface GroupItem {
  id: string;
  name: string;
  description: string;
  members: number;
  isPrivate: boolean;
  coverUrl: string;
}

const INITIAL_GROUPS: GroupItem[] = [
  {
    id: 'g1',
    name: 'Social Media România',
    description: 'Strategii, trenduri și studii de caz pentru creatorii locali.',
    members: 12800,
    isPrivate: false,
    coverUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'g2',
    name: 'Fondatori & Startup Cafe',
    description: 'Discuții despre produs, growth și fundraising.',
    members: 5400,
    isPrivate: true,
    coverUrl: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'g3',
    name: 'Pasionați de fotografie mobilă',
    description: 'Tips, editare și provocări săptămânale pentru telefon.',
    members: 9100,
    isPrivate: false,
    coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function GroupsView() {
  const [query, setQuery] = useState('');
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const [draftDescription, setDraftDescription] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadGroups() {
      try {
        const response = await fetch('/api/groups', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load groups');
        }

        if (!cancelled) {
          setGroups(Array.isArray(data.groups) ? data.groups : INITIAL_GROUPS);
        }
      } catch {
        if (!cancelled) {
          setGroups(INITIAL_GROUPS);
        }
      }
    }

    loadGroups();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleGroups = useMemo(
    () =>
      groups.filter((group) =>
        `${group.name} ${group.description}`.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [groups, query]
  );
  const activeGroup = useMemo(
    () => groups.find((group) => group.id === activeGroupId) ?? null,
    [activeGroupId, groups]
  );

  const toggleMembership = async (groupId: string, joined: boolean) => {
    setJoinedIds((current) => (joined ? current.filter((value) => value !== groupId) : [...current, groupId]));
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId ? { ...group, members: group.members + (joined ? -1 : 1) } : group
      )
    );

    try {
      await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: joined ? 'leave' : 'join', groupId, userId: 'current_user' }),
      });
    } catch {
      // Keep optimistic UI if network fails.
    }
  };

  const createGroup = async () => {
    if (!draftName.trim() || !draftDescription.trim()) {
      return;
    }

    try {
      const response = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: draftName,
          description: draftDescription,
          isPrivate: false,
          userId: 'current_user',
        }),
      });
      const data = await response.json();

      if (response.ok && data.group) {
        setGroups((current) => [data.group, ...current]);
        setJoinedIds((current) => [data.group.id, ...current]);
        setActiveGroupId(data.group.id);
      }
    } catch {
      const fallbackGroup = {
        id: `group-local-${Date.now()}`,
        name: draftName,
        description: draftDescription,
        members: 1,
        isPrivate: false,
        coverUrl: INITIAL_GROUPS[0]?.coverUrl ?? '',
      };

      setGroups((current) => [
        fallbackGroup,
        ...current,
      ]);
      setJoinedIds((current) => [fallbackGroup.id, ...current]);
      setActiveGroupId(fallbackGroup.id);
    }

    setDraftName('');
    setDraftDescription('');
    setIsCreateOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white px-4 pb-4 pt-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[28px] font-bold tracking-tight text-[#050505]">Grupuri</div>
            <div className="text-[14px] text-[#65676b]">Comunități și conversații tematice, ca pe Facebook.</div>
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
            placeholder="Caută grupuri"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#65676b]"
          />
        </div>
      </div>

      <div className="space-y-3 p-3">
        {visibleGroups.map((group) => {
          const joined = joinedIds.includes(group.id);

          return (
            <article key={group.id} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="aspect-[16/7] w-full overflow-hidden bg-[#D9DDE3]">
                <img src={group.coverUrl} alt={group.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="text-[18px] font-bold text-[#050505]">{group.name}</div>
                <div className="mt-2 text-[14px] text-[#65676b]">{group.description}</div>
                <div className="mt-3 flex items-center gap-3 text-[13px] font-semibold text-[#65676b]">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {group.members.toLocaleString('ro-RO')} membri
                  </span>
                  <span className="flex items-center gap-1">
                    {group.isPrivate ? <Lock className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    {group.isPrivate ? 'Privat' : 'Public'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleMembership(group.id, joined)}
                    className={`rounded-xl px-4 py-3 text-[15px] font-semibold ${
                      joined ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#1877F2] text-white'
                    }`}
                  >
                    {joined ? 'Membru' : 'Alătură-te'}
                  </button>
                  <button
                    onClick={() => setActiveGroupId(group.id)}
                    className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]"
                  >
                    Vezi grupul
                  </button>
                </div>
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
            <div className="text-[18px] font-bold text-[#050505]">Creează grup</div>
            <div className="mt-3 space-y-3">
              <input
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none"
                placeholder="Nume grup"
              />
              <textarea
                value={draftDescription}
                onChange={(event) => setDraftDescription(event.target.value)}
                className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none"
                placeholder="Descriere"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setIsCreateOpen(false)} className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]">
                Renunță
              </button>
              <button onClick={createGroup} className="rounded-xl bg-[#1877F2] px-4 py-3 text-[15px] font-semibold text-white">
                Creează
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeGroup ? (
        <div className="fixed inset-0 z-[92] bg-black/40 backdrop-blur-sm" onClick={() => setActiveGroupId(null)}>
          <div
            className="absolute inset-0 overflow-y-auto bg-[#F0F2F5]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-white shadow-sm">
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-[#D9DDE3]">
                <img src={activeGroup.coverUrl} alt={activeGroup.name} className="h-full w-full object-cover" />
                <button
                  onClick={() => setActiveGroupId(null)}
                  className="absolute right-4 top-4 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm"
                  aria-label="Închide grupul"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="px-4 py-4">
                <div className="text-[24px] font-bold text-[#050505]">{activeGroup.name}</div>
                <div className="mt-2 text-[15px] text-[#65676b]">{activeGroup.description}</div>
                <div className="mt-3 flex items-center gap-3 text-[13px] font-semibold text-[#65676b]">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {activeGroup.members.toLocaleString('ro-RO')} membri
                  </span>
                  <span className="flex items-center gap-1">
                    {activeGroup.isPrivate ? <Lock className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                    {activeGroup.isPrivate ? 'Privat' : 'Public'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleMembership(activeGroup.id, joinedIds.includes(activeGroup.id))}
                    className={`rounded-xl px-4 py-3 text-[15px] font-semibold ${
                      joinedIds.includes(activeGroup.id) ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#1877F2] text-white'
                    }`}
                  >
                    {joinedIds.includes(activeGroup.id) ? 'Membru' : 'Alătură-te'}
                  </button>
                  <button className="rounded-xl bg-[#E4E6EB] px-4 py-3 text-[15px] font-semibold text-[#050505]">
                    Invită
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-3 p-3">
              <section className="rounded-[24px] bg-white p-4 shadow-sm">
                <div className="text-[17px] font-bold text-[#050505]">Despre acest grup</div>
                <p className="mt-2 text-[14px] leading-6 text-[#65676b]">
                  {activeGroup.description} Aici găsești postări, discuții și recomandări similare cu experiența unui grup Facebook.
                </p>
              </section>

              <section className="rounded-[24px] bg-white p-4 shadow-sm">
                <div className="text-[17px] font-bold text-[#050505]">Discuții recente</div>
                <div className="mt-3 space-y-3">
                  <div className="rounded-2xl bg-[#F7F8FA] p-4">
                    <div className="text-[15px] font-semibold text-[#050505]">Cum folosiți Reel-urile pentru reach local?</div>
                    <div className="mt-1 text-[13px] text-[#65676b]">12 comentarii noi astăzi</div>
                  </div>
                  <div className="rounded-2xl bg-[#F7F8FA] p-4">
                    <div className="text-[15px] font-semibold text-[#050505]">Ce tactici de moderare funcționează în comunități mari?</div>
                    <div className="mt-1 text-[13px] text-[#65676b]">8 comentarii noi</div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
