"use client";

import { Edit3, Ellipsis, MessageCircle, UserPlus, UserRoundCheck } from "lucide-react";

export default function ProfileActionButtons({
  isOwnProfile,
  isFollowing,
  onFollow,
  onMessage,
  onMore,
  onEdit,
}: {
  isOwnProfile?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onMessage?: () => void;
  onMore?: () => void;
  onEdit?: () => void;
}) {
  return (
    <div className="grid w-full grid-cols-2 gap-2.5 overflow-hidden">
      {isOwnProfile ? (
        <button
          onClick={onEdit}
          className="col-span-2 flex min-w-0 items-center justify-center gap-2 rounded-[22px] bg-[#111827] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_34px_rgba(17,24,39,0.2)] transition-transform active:scale-[0.985]"
        >
          <Edit3 className="h-4.5 w-4.5" strokeWidth={2.1} />
          <span className="truncate">Editează profilul</span>
        </button>
      ) : (
        <button
          onClick={onFollow}
          className={`col-span-2 flex min-w-0 items-center justify-center gap-2 rounded-[22px] px-4 py-3 text-[15px] font-semibold transition-transform active:scale-[0.985] ${
            isFollowing
              ? "border border-[#d7dee8] bg-white text-[#111827]"
              : "bg-[#1877F2] text-white shadow-[0_14px_34px_rgba(24,119,242,0.24)]"
          }`}
        >
          {isFollowing ? <UserRoundCheck className="h-4.5 w-4.5" strokeWidth={2.1} /> : <UserPlus className="h-4.5 w-4.5" strokeWidth={2.1} />}
          <span className="truncate">{isFollowing ? "Urmărești" : "Urmărește"}</span>
        </button>
      )}

      <button
        onClick={onMessage}
        className="flex min-w-0 items-center justify-center gap-2 rounded-[22px] border border-[#dce4ef] bg-white/88 px-4 py-3 text-[15px] font-semibold text-[#111827] shadow-[0_10px_26px_rgba(15,23,42,0.07)] backdrop-blur transition-transform active:scale-[0.985]"
      >
        <MessageCircle className="h-4.5 w-4.5" strokeWidth={2.1} />
        <span className="truncate">Mesaj</span>
      </button>

      <button
        onClick={onMore}
        className="flex h-[50px] min-w-0 items-center justify-center rounded-[20px] border border-[#dce4ef] bg-white/88 text-[#111827] shadow-[0_10px_26px_rgba(15,23,42,0.07)] backdrop-blur transition-transform active:scale-[0.985]"
        aria-label="Mai multe opțiuni"
      >
        <Ellipsis className="h-5 w-5" strokeWidth={2.3} />
      </button>
    </div>
  );
}
