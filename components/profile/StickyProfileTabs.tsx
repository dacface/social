"use client";

export interface StickyProfileTabItem {
  id: string;
  label: string;
}

export default function StickyProfileTabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: StickyProfileTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="sticky top-0 z-30 -mx-4 px-4 pb-3 pt-2">
      <div className="overflow-x-auto no-scrollbar rounded-[24px] border border-white/75 bg-white/78 p-1 shadow-[0_16px_40px_rgba(15,23,42,0.09)] backdrop-blur-xl">
        <div className="flex min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`relative rounded-[18px] px-4 py-2.5 text-[14px] font-semibold tracking-[-0.02em] transition-all ${
                  isActive ? "bg-[#111827] text-white shadow-[0_10px_18px_rgba(17,24,39,0.18)]" : "text-[#667085]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
