"use client";

import React, { useState } from 'react';
import { Bookmark, CalendarDays, LayoutGrid, ShoppingBag } from 'lucide-react';

const SAVED_COLLECTIONS = [
  {
    id: 's1',
    title: 'Postări pentru mai târziu',
    subtitle: '12 elemente salvate',
    icon: Bookmark,
    accent: 'bg-[#E7F3FF] text-[#1877F2]',
  },
  {
    id: 's2',
    title: 'Anunțuri Marketplace',
    subtitle: '4 elemente salvate',
    icon: ShoppingBag,
    accent: 'bg-[#FCE8E6] text-[#E41E3F]',
  },
  {
    id: 's3',
    title: 'Evenimente interesante',
    subtitle: '3 elemente salvate',
    icon: CalendarDays,
    accent: 'bg-[#E8F5E9] text-[#2E7D32]',
  },
];

export default function SavedView() {
  const [activeCollectionId, setActiveCollectionId] = useState('s1');

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white px-4 pb-4 pt-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[28px] font-bold tracking-tight text-[#050505]">Salvate</div>
            <div className="text-[14px] text-[#65676b]">Colecțiile tale, organizate și ușor de reluat.</div>
          </div>
          <div className="rounded-full bg-[#F0F2F5] p-3 text-[#050505]">
            <LayoutGrid className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="space-y-3 p-3">
        {SAVED_COLLECTIONS.map((collection) => {
          const Icon = collection.icon;
          const isActive = activeCollectionId === collection.id;

          return (
            <button
              key={collection.id}
              onClick={() => setActiveCollectionId(collection.id)}
              className={`flex w-full items-center gap-4 rounded-[24px] bg-white p-4 text-left shadow-sm transition-transform ${
                isActive ? 'scale-[1.01]' : ''
              }`}
            >
              <div className={`rounded-2xl p-3 ${collection.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-[16px] font-bold text-[#050505]">{collection.title}</div>
                <div className="mt-1 text-[14px] text-[#65676b]">{collection.subtitle}</div>
              </div>
            </button>
          );
        })}

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <div className="text-[17px] font-bold text-[#050505]">În această colecție</div>
          <div className="mt-4 space-y-3">
            {activeCollectionId === 's1' ? (
              <>
                <SavedCard title="Analiză despre cum cresc Reel-urile locale" meta="Salvat din feed · ieri" />
                <SavedCard title="Postare despre tactici de moderare a comunităților" meta="Salvat din grupuri · acum 2 zile" />
              </>
            ) : null}

            {activeCollectionId === 's2' ? (
              <>
                <SavedCard title="iPhone 15 Pro, impecabil" meta="Salvat din Marketplace · azi" />
                <SavedCard title="Canapea modulară gri, 3 locuri" meta="Salvat din Marketplace · ieri" />
              </>
            ) : null}

            {activeCollectionId === 's3' ? (
              <>
                <SavedCard title="Summit Social Media & Creator Economy" meta="Salvat din Evenimente · azi" />
                <SavedCard title="Meetup fondatori tech România" meta="Salvat din Evenimente · acum 3 zile" />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function SavedCard({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-[#F7F8FA] p-4">
      <div className="text-[15px] font-semibold text-[#050505]">{title}</div>
      <div className="mt-1 text-[13px] text-[#65676b]">{meta}</div>
    </div>
  );
}
