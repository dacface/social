"use client";

export default function EmptyProfileState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-[#d6dde8] bg-white/82 px-5 py-8 text-center shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="text-[18px] font-semibold tracking-[-0.03em] text-[#111827]">{title}</div>
      <div className="mx-auto mt-2 max-w-[280px] text-[14px] leading-6 text-[#6b7280]">{description}</div>
      {actionLabel && onAction ? (
        <button
          onClick={onAction}
          className="mt-5 rounded-full bg-[#111827] px-5 py-2.5 text-[14px] font-semibold text-white transition-transform active:scale-[0.985]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
