"use client";

export default function CoverCategoryTabs({
  categories,
  activeCategory,
  onChange,
}: {
  categories: string[];
  activeCategory: string;
  onChange: (category: string) => void;
}) {
  return (
    <div className="overflow-x-auto no-scrollbar">
      <div className="flex min-w-max gap-2">
        {categories.map((category) => {
          const isActive = category === activeCategory;

          return (
            <button
              key={category}
              onClick={() => onChange(category)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                isActive ? "bg-[#111827] text-white" : "bg-[#eef2f6] text-[#667085]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
