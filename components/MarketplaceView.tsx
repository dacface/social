"use client";

import React, { useMemo, useState } from 'react';
import { Heart, MapPin, Search, SlidersHorizontal, Store, Tag } from 'lucide-react';

interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  category: string;
  location: string;
  imageUrl: string;
  seller: string;
  postedAt: string;
}

const CATEGORIES = ['Toate', 'Auto', 'Imobiliare', 'Electronice', 'Casă', 'Fashion'];

const INITIAL_ITEMS: MarketplaceItem[] = [
  {
    id: 'm1',
    title: 'iPhone 15 Pro, impecabil',
    price: '4.700 lei',
    category: 'Electronice',
    location: 'București',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop',
    seller: 'Radu Stoica',
    postedAt: 'Acum 2 ore',
  },
  {
    id: 'm2',
    title: 'Canapea modulară gri, 3 locuri',
    price: '1.950 lei',
    category: 'Casă',
    location: 'Cluj-Napoca',
    imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
    seller: 'Mara Design',
    postedAt: 'Astăzi',
  },
  {
    id: 'm3',
    title: 'Volkswagen Golf 2020, diesel',
    price: '13.900 EUR',
    category: 'Auto',
    location: 'Iași',
    imageUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
    seller: 'Auto Select',
    postedAt: 'Ieri',
  },
  {
    id: 'm4',
    title: 'Apartament 2 camere, central',
    price: '118.000 EUR',
    category: 'Imobiliare',
    location: 'Timișoara',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop',
    seller: 'Andreea Imobiliare',
    postedAt: 'Acum 30 min',
  },
];

export default function MarketplaceView() {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Toate');
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [activeDetailId, setActiveDetailId] = useState<string | null>(null);

  const visibleItems = useMemo(() => {
    return INITIAL_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'Toate' || item.category === selectedCategory;
      const haystack = `${item.title} ${item.location} ${item.category} ${item.seller}`.toLowerCase();
      return matchesCategory && haystack.includes(query.trim().toLowerCase());
    });
  }, [query, selectedCategory]);

  const activeConversationItem = INITIAL_ITEMS.find((item) => item.id === activeConversationId) ?? null;
  const activeDetailItem = INITIAL_ITEMS.find((item) => item.id === activeDetailId) ?? null;

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="px-4 pb-4 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[29px] font-[700] tracking-[-0.045em] text-[#050505]">Marketplace</div>
              <div className="text-[14px] text-[#65676b]">Descoperă anunțuri locale, ca într-un feed dedicat.</div>
            </div>
            <div className="rounded-full bg-[#E7F3FF] p-3 text-[#1877F2]">
              <Store className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-[#F0F2F5] px-4 py-3">
            <Search className="h-5 w-5 text-[#65676b]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Caută pe Marketplace"
              className="w-full bg-transparent text-[15px] text-[#050505] outline-none placeholder:text-[#65676b]"
            />
            <SlidersHorizontal className="h-5 w-5 text-[#65676b]" />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-4 py-2 text-[14px] font-[630] tracking-[-0.02em] transition-colors ${
                    isActive ? 'bg-[#1877F2] text-white' : 'bg-[#E9EDF2] text-[#050505]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid gap-3 p-3">
        {visibleItems.map((item) => {
          const isSaved = savedIds.includes(item.id);
          return (
            <article key={item.id} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#D9DDE3]">
                <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                <button
                  onClick={() =>
                    setSavedIds((current) =>
                      current.includes(item.id) ? current.filter((savedId) => savedId !== item.id) : [...current, item.id]
                    )
                  }
                  className="absolute right-3 top-3 rounded-full bg-black/45 p-2 text-white backdrop-blur-sm"
                >
                  <Heart className={`h-5 w-5 ${isSaved ? 'fill-current text-[#ff4d67]' : ''}`} />
                </button>
              </div>

              <div className="p-4">
                <div className="text-[21px] font-[690] tracking-[-0.035em] text-[#050505]">{item.price}</div>
                <div className="mt-1 text-[16px] font-[630] tracking-[-0.02em] text-[#050505]">{item.title}</div>
                <div className="mt-2 flex items-center gap-2 text-[14px] text-[#65676b]">
                  <MapPin className="h-4 w-4" />
                  <span>{item.location}</span>
                  <span>·</span>
                  <span>{item.postedAt}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-[#65676b]">
                  <Tag className="h-4 w-4" />
                  <span>{item.category}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveConversationId(item.id)}
                    className="rounded-2xl bg-[#1877F2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-white shadow-sm"
                  >
                    Trimite mesaj
                  </button>
                  <button
                    onClick={() => setActiveDetailId(item.id)}
                    className="rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505] shadow-sm"
                  >
                    Vezi detalii
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {visibleItems.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-sm">
            <div className="text-[18px] font-[680] tracking-[-0.03em] text-[#050505]">Nu am găsit rezultate.</div>
            <div className="mt-1 text-[14px] text-[#65676b]">Încearcă altă categorie sau un termen mai simplu.</div>
          </div>
        ) : null}
      </div>

      {activeConversationItem ? (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={() => setActiveConversationId(null)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="text-[19px] font-[680] tracking-[-0.035em] text-[#050505]">Mesaj către {activeConversationItem.seller}</div>
            <div className="mt-1 text-[14px] text-[#65676b]">Despre: {activeConversationItem.title}</div>
            <textarea
              defaultValue={`Bună! Mai este disponibil ${activeConversationItem.title}?`}
              className="mt-4 min-h-[140px] w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-4 text-[15px] text-[#050505] outline-none"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveConversationId(null)}
                className="rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505]"
              >
                Închide
              </button>
              <button
                onClick={() => setActiveConversationId(null)}
                className="rounded-2xl bg-[#1877F2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-white"
              >
                Trimite
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {activeDetailItem ? (
        <div className="fixed inset-0 z-[88] bg-black/40 backdrop-blur-sm" onClick={() => setActiveDetailId(null)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="text-[22px] font-[690] tracking-[-0.04em] text-[#050505]">{activeDetailItem.title}</div>
            <div className="mt-1 text-[16px] font-[650] tracking-[-0.025em] text-[#1877F2]">{activeDetailItem.price}</div>
            <div className="mt-4 space-y-2 text-[14px] text-[#65676b]">
              <div>Vândut de {activeDetailItem.seller}</div>
              <div>Locație: {activeDetailItem.location}</div>
              <div>Categorie: {activeDetailItem.category}</div>
              <div>Publicat: {activeDetailItem.postedAt}</div>
            </div>
            <p className="mt-4 rounded-2xl bg-[#F7F8FA] px-4 py-4 text-[15px] text-[#050505]">
              Articol în stare foarte bună, cu prezentare orientată pe viteza de răspuns și contact rapid, similar cu cardurile detaliate din Facebook Marketplace.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setActiveDetailId(null);
                  setActiveConversationId(activeDetailItem.id);
                }}
                className="rounded-2xl bg-[#1877F2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-white"
              >
                Contactează vânzătorul
              </button>
              <button
                onClick={() => setActiveDetailId(null)}
                className="rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505]"
              >
                Închide
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
