"use client";

export interface ProfileStatItem {
  id: string;
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export default function ProfileStatsRow({
  items,
  onSelect,
}: {
  items: ProfileStatItem[];
  onSelect?: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item.id)}
          className="rounded-[22px] border border-white/70 bg-white/82 px-3 py-3 text-left shadow-[0_10px_28px_rgba(15,23,42,0.07)] backdrop-blur transition-transform active:scale-[0.985]"
        >
          <div className={`text-[18px] font-[720] tracking-[-0.04em] ${item.tone === "accent" ? "text-[#0f5fe0]" : "text-[#111827]"}`}>
            {item.value}
          </div>
          <div className="mt-1 text-[12px] font-medium text-[#6b7280]">{item.label}</div>
        </button>
      ))}
    </div>
  );
}
