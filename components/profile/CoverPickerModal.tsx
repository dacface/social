"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Bookmark, Check, Dice5, Heart, Sparkles, X } from "lucide-react";

import {
  PROFILE_COVER_CATEGORIES,
  type ProfileCoverTemplate,
} from "@/lib/profileCovers";

import AbstractCoverBanner from "./AbstractCoverBanner";
import CoverCategoryTabs from "./CoverCategoryTabs";

const INITIAL_VISIBLE_COUNT = 8;

export default function CoverPickerModal({
  isOpen,
  covers,
  currentCoverId,
  favoriteIds,
  recommendedIds,
  onClose,
  onPreview,
  onSave,
  onToggleFavorite,
}: {
  isOpen: boolean;
  covers: ProfileCoverTemplate[];
  currentCoverId: string;
  favoriteIds: string[];
  recommendedIds: string[];
  onClose: () => void;
  onPreview: (coverId: string) => void;
  onSave: (coverId: string) => void;
  onToggleFavorite: (coverId: string) => void;
}) {
  const [activeCategory, setActiveCategory] = useState("Pentru tine");
  const [draftCoverId, setDraftCoverId] = useState(currentCoverId);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const recommendedCovers = useMemo(
    () => covers.filter((cover) => recommendedIds.includes(cover.id)),
    [covers, recommendedIds],
  );

  const filteredCovers = useMemo(() => {
    if (activeCategory === "Pentru tine") {
      return recommendedCovers.length > 0 ? recommendedCovers : covers;
    }

    if (activeCategory === "Favorite") {
      return covers.filter((cover) => favoriteIds.includes(cover.id));
    }

    return covers.filter((cover) => cover.category === activeCategory);
  }, [activeCategory, covers, favoriteIds, recommendedCovers]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const sentinel = sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisibleCount((current) => Math.min(current + 6, filteredCovers.length));
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [filteredCovers.length, isOpen]);

  if (!isOpen) {
    return null;
  }

  const previewCover = covers.find((cover) => cover.id === draftCoverId) ?? covers[0];
  const categories = ["Pentru tine", "Favorite", ...PROFILE_COVER_CATEGORIES];
  const visibleCovers = filteredCovers.slice(0, visibleCount);

  const randomizeSuggestion = () => {
    const source = filteredCovers.length > 0 ? filteredCovers : covers;
    const randomCover = source[Math.floor(Math.random() * source.length)];

    if (!randomCover) {
      return;
    }

    setDraftCoverId(randomCover.id);
    onPreview(randomCover.id);
  };

  return (
    <div className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-md" onClick={onClose}>
      <div
        className="absolute inset-x-0 bottom-0 max-h-[90svh] overflow-hidden rounded-t-[32px] bg-[#f6f8fb] shadow-[0_-24px_80px_rgba(15,23,42,0.2)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 border-b border-white/60 bg-[#f6f8fb]/92 px-4 pb-4 pt-3 backdrop-blur-xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-[#d8dee8]" />
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[19px] font-[720] tracking-[-0.04em] text-[#111827]">Choose Cover</div>
              <div className="mt-1 text-[13px] text-[#6b7280]">Preseturi abstracte, preview live și selecție salvată local.</div>
            </div>
            <button onClick={onClose} className="rounded-full bg-white p-2 text-[#111827] shadow-[0_8px_20px_rgba(15,23,42,0.08)]" aria-label="Închide">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="max-h-[calc(90svh-90px)] overflow-y-auto px-4 pb-6">
          <div className="mt-4 rounded-[30px] border border-white/70 bg-white/74 p-3 shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
            <AbstractCoverBanner cover={previewCover} compact className="h-36" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-[15px] font-semibold text-[#111827]">{previewCover.title}</div>
                <div className="mt-1 text-[13px] text-[#6b7280]">{previewCover.category}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={randomizeSuggestion}
                  className="flex items-center gap-2 rounded-full bg-[#eef3f8] px-4 py-2 text-[13px] font-semibold text-[#344054]"
                >
                  <Dice5 className="h-4 w-4" />
                  Random
                </button>
                <button
                  onClick={() => onToggleFavorite(previewCover.id)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3f8] text-[#344054]"
                  aria-label="Favoritează coverul"
                >
                  {favoriteIds.includes(previewCover.id) ? <Heart className="h-4.5 w-4.5 fill-current text-[#ef476f]" /> : <Bookmark className="h-4.5 w-4.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <CoverCategoryTabs
              categories={categories}
              activeCategory={activeCategory}
              onChange={(category) => {
                setActiveCategory(category);
                setVisibleCount(INITIAL_VISIBLE_COUNT);
              }}
            />
          </div>

          {recommendedCovers.length > 0 && activeCategory === "Pentru tine" ? (
            <div className="mt-5 rounded-[28px] border border-white/70 bg-white/82 p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                <Sparkles className="h-4.5 w-4.5 text-[#1877F2]" />
                Recommended for you
              </div>
              <div className="mt-1 text-[13px] text-[#6b7280]">Bazat pe tonul actual al profilului și tag-urile selectate.</div>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-2 gap-3">
            {visibleCovers.map((cover) => {
              const isSelected = cover.id === draftCoverId;

              return (
                <button
                  key={cover.id}
                  onClick={() => {
                    setDraftCoverId(cover.id);
                    onPreview(cover.id);
                  }}
                  className={`relative overflow-hidden rounded-[24px] border text-left shadow-[0_14px_34px_rgba(15,23,42,0.08)] transition-transform active:scale-[0.985] ${
                    isSelected ? "border-[#1877F2] ring-2 ring-[#cfe2ff]" : "border-white/70"
                  }`}
                >
                  <div className="h-28" style={{ backgroundImage: cover.preview }} />
                  <div className="bg-white px-3 pb-3 pt-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-[14px] font-semibold text-[#111827]">{cover.title}</div>
                        <div className="mt-1 text-[12px] text-[#6b7280]">{cover.theme}</div>
                      </div>
                      {isSelected ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1877F2] text-white">
                          <Check className="h-4 w-4" strokeWidth={2.5} />
                        </span>
                      ) : null}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {cover.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="rounded-full bg-[#eef3f8] px-2 py-1 text-[11px] font-semibold text-[#526071]">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div ref={sentinelRef} className="h-8" />

          <div className="sticky bottom-0 mt-4 border-t border-white/60 bg-[#f6f8fb]/92 pb-2 pt-4 backdrop-blur-xl">
            <button
              onClick={() => onSave(draftCoverId)}
              className="w-full rounded-[22px] bg-[#111827] px-4 py-4 text-[15px] font-semibold text-white shadow-[0_16px_36px_rgba(17,24,39,0.2)] transition-transform active:scale-[0.99]"
            >
              Salvează selecția
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
