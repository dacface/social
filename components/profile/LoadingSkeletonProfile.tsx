"use client";

export default function LoadingSkeletonProfile() {
  return (
    <div className="animate-pulse bg-[#f3f6fa] pb-24">
      <div className="h-[38svh] min-h-[320px] rounded-b-[34px] bg-[linear-gradient(135deg,#edf2f8,#f7f9fb,#e8eef6)]" />
      <div className="-mt-20 px-4">
        <div className="mx-auto h-40 w-40 rounded-full border-[8px] border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.1)]" />
        <div className="mt-6 rounded-[28px] bg-white px-5 py-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
          <div className="mx-auto h-8 w-44 rounded-full bg-[#e6ebf2]" />
          <div className="mx-auto mt-3 h-5 w-28 rounded-full bg-[#eef2f7]" />
          <div className="mx-auto mt-4 h-4 w-full rounded-full bg-[#eef2f7]" />
          <div className="mx-auto mt-2 h-4 w-5/6 rounded-full bg-[#eef2f7]" />
          <div className="mt-6 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-18 rounded-[20px] bg-[#f0f4f8]" />
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <div className="h-12 flex-1 rounded-[20px] bg-[#e7edf4]" />
            <div className="h-12 flex-1 rounded-[20px] bg-[#edf2f7]" />
            <div className="h-12 w-12 rounded-[18px] bg-[#edf2f7]" />
          </div>
        </div>
      </div>
    </div>
  );
}
