"use client";

export interface ProfileGridItem {
  id: string;
  title: string;
  imageUrl: string;
  subtitle?: string;
}

export default function ProfilePostGrid({
  items,
  onSelect,
}: {
  items: ProfileGridItem[];
  onSelect?: (item: ProfileGridItem) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onSelect?.(item)}
          className={`group relative overflow-hidden rounded-[28px] bg-[#dfe6ee] text-left shadow-[0_16px_38px_rgba(15,23,42,0.08)] transition-transform active:scale-[0.985] ${
            index % 5 === 0 ? "col-span-2 aspect-[1.42/1]" : "aspect-[0.88/1]"
          }`}
        >
          <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-active:scale-[1.02]" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/58 via-black/14 to-transparent px-4 pb-4 pt-10 text-white">
            <div className="text-[15px] font-semibold tracking-[-0.02em]">{item.title}</div>
            {item.subtitle ? <div className="mt-1 text-[12px] text-white/80">{item.subtitle}</div> : null}
          </div>
        </button>
      ))}
    </div>
  );
}
