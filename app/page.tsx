"use client";

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal,
  Heart,
  MessageSquareMore,
  Share,
  Scale,
  Sparkles,
  Send,
  Home,
  Compass,
  Plus,
  Bell,
  User,
  CheckCircle2,
  Clock,
  ChevronDown,
  ShieldCheck,
  Signal,
  Wifi,
  Battery,
  FileText,
  CalendarDays,
  Circle,
  Activity
} from 'lucide-react';

export default function MobileFeed() {
  const [activeTab, setActiveTab] = useState('Pentru Tine');

  const tabs = ['Pentru Tine', 'Politic', 'Economie', 'Social', 'Artă', 'Sport'];

  return (
    <main className="relative w-full h-[100dvh] bg-black text-white font-sans overflow-hidden max-w-[430px] mx-auto sm:border-x sm:border-gray-800 flex flex-col">
      
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541872596495-25b8431945ae?q=80&w=800&auto=format&fit=crop" 
          alt="Post background"
          className="w-full h-full object-cover rounded-[2.5rem] sm:rounded-none object-[70%_20%]" // Adjusted focal point for resemblance
        />
        {/* Gradients for text readability */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-black/95 via-black/40 to-transparent pointer-events-none" />
      </div>

      {/* --- FLOATING OVERLAY UI --- */}
      <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between">
        
        {/* Top Section */}
        <div className="pointer-events-auto">
          {/* iOS Status Bar Mock */}
          <div className="flex justify-between items-center px-6 pt-3 pb-2">
            <span className="text-[15px] font-semibold tracking-wide">10:24</span>
            <div className="flex items-center gap-1.5">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-[18px] h-[18px]" />
            </div>
          </div>

          {/* Top Tabs Nav */}
          <div className="flex items-center justify-between px-4 mt-1">
            <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-4">
              {tabs.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-2 whitespace-nowrap text-[15px] transition-colors
                    ${activeTab === tab 
                      ? 'text-white font-bold' 
                      : 'text-white/60 font-medium hover:text-white'
                    }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t-sm" />
                  )}
                </button>
              ))}
            </div>
            <button className="pl-3 pb-2">
              <Search className="w-5 h-5 text-white stroke-[2.5]" />
            </button>
          </div>

          {/* Filters Row */}
          <div className="flex items-center px-4 mt-3 gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[13px] font-medium border border-white/5">
              <Clock className="w-3.5 h-3.5 text-white/80" />
              <span>Cronologic</span>
              <ChevronDown className="w-3.5 h-3.5 text-white/70" />
            </button>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-[13px] font-medium border border-blue-500/20">
              <Activity className="w-3.5 h-3.5 text-blue-100" />
              <span className="text-blue-50">Algoritmic</span>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200/70" />
            </button>
            
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[13px] font-medium border border-white/5">
              <ShieldCheck className="w-3.5 h-3.5 text-white/80" />
              <span>Verificat</span>
            </button>

            <div className="flex-1" />
            <button className="p-1">
              <SlidersHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Content Overlays - "FALS" Pill and Floating Avatar */}
          <div className="relative mt-5 px-4 h-12">
            {/* FALS Badge */}
            <button className="absolute left-4 top-0 flex items-center gap-1.5 pl-2 pr-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-red-500/40">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <span className="text-[11px] font-bold text-red-500 tracking-wider">FALS</span>
              <span className="text-[12px] font-medium text-gray-200 ml-0.5">Manipulare detectată &gt;</span>
            </button>

            {/* Top Right Floating Avatar */}
            <div className="absolute right-4 top-0 flex flex-col items-center">
              <div className="relative">
                <img 
                  src="https://i.pravatar.cc/150?u=a042581f4e3" 
                  className="w-[38px] h-[38px] rounded-full border border-white/30"
                  alt="Secondary user"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full border-2 border-transparent">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <span className="text-[10px] text-white/80 font-medium mt-1">1 112</span>
            </div>
          </div>
        </div>

        {/* Bottom Section (excluding bottom nav) */}
        <div className="flex-1 flex justify-between items-end pb-4 pt-10 pointer-events-auto">
          
          {/* Post Info (Left) */}
          <div className="flex-1 px-4 flex flex-col pb-3">
            {/* Avatar & Name */}
            <div className="flex items-center gap-3 mb-3">
              <img 
                src="https://i.pravatar.cc/150?u=a042581f4e29026" 
                className="w-11 h-11 rounded-full border-[1.5px] border-white/30"
                alt="Ana Popescu"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[16px] text-white drop-shadow-md">Ana Popescu</span>
                  <div className="bg-white rounded-full p-[1px]">
                    <CheckCircle2 className="w-[14px] h-[14px] text-blue-500 fill-blue-500" />
                  </div>
                </div>
                <span className="text-[13px] tracking-tight text-white/80 drop-shadow-md font-medium">
                  București, România • 5m
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-[15px] font-medium text-white/95 leading-[1.3] drop-shadow-md mb-0.5">
              Trebuie să mergem la vot pentru a schimba viitorul!
            </p>
            
            {/* Hashtags */}
            <p className="text-[15px] font-semibold text-blue-400 drop-shadow-md mb-3">
              #Politica #Alegeri #Democratie
            </p>

            {/* Tags Row */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-600/30 backdrop-blur-md rounded border border-white/10">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-[12px] font-medium text-white/90">Politic</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-600/30 backdrop-blur-md rounded border border-white/10">
                <CalendarDays className="w-3.5 h-3.5 text-white/80" />
                <span className="text-[12px] font-medium text-white/90">Alegeri 2025</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-600/30 backdrop-blur-md rounded border border-white/10">
                <div className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]" />
                <span className="text-[12px] font-medium text-white/90">Discuție activă</span>
              </div>
            </div>
          </div>

          {/* Action Bar (Right) */}
          <div className="w-[70px] flex flex-col items-center justify-end gap-5 pb-5 pr-2">
            <button className="flex flex-col items-center gap-1 group">
              <Heart className="w-8 h-8 text-white fill-white drop-shadow-lg group-active:scale-95 transition-transform" />
              <span className="text-[12px] font-bold text-white drop-shadow-md">12.4K</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <MessageSquareMore className="w-8 h-8 text-white fill-white drop-shadow-lg group-active:scale-95 transition-transform" />
              <span className="text-[12px] font-bold text-white drop-shadow-md">256</span>
            </button>

            <button className="flex flex-col items-center gap-1 group">
              <Share className="w-8 h-8 text-white fill-white drop-shadow-lg group-active:scale-95 transition-transform" />
              <span className="text-[12px] font-bold text-white drop-shadow-md">1.2K</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 mt-2 group">
              <div className="p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/20 group-active:scale-95 transition-transform shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                <Scale className="w-[22px] h-[22px] text-white" />
              </div>
              <span className="text-[11px] font-medium text-white/90 drop-shadow-md">Dezbatere</span>
            </button>

            <button className="flex flex-col items-center gap-1.5 mt-2 group relative">
              <div className="absolute inset-0 bg-purple-600/80 rounded-full blur-xl pointer-events-none scale-150" />
              <div className="relative p-3 bg-[#1E0D35]/80 rounded-full backdrop-blur-md border border-purple-400/40 group-active:scale-95 transition-transform z-10 shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                <Sparkles className="w-[22px] h-[22px] text-purple-100" />
              </div>
              <span className="text-[11px] font-medium text-purple-50 drop-shadow-md z-10">Explică AI</span>
            </button>
          </div>
        </div>

        {/* Comment Input Bar */}
        <div className="px-4 pb-[85px] pointer-events-auto">
          <div className="flex items-center gap-3 bg-black/30 backdrop-blur-xl rounded-full px-1 py-1 border border-white/10 shadow-lg">
            <img 
               src="https://i.pravatar.cc/150?u=a042581f4e29026024" 
               className="w-[34px] h-[34px] rounded-full ml-0.5 border border-white/20"
               alt="User"
            />
            <input 
              type="text" 
              placeholder="Adaugă un comentariu..." 
              className="flex-1 bg-transparent text-[14px] font-medium text-white placeholder-white/60 outline-none pb-0.5"
            />
            <button className="pr-3 pl-1 opacity-70 hover:opacity-100 transition-opacity">
              <Send className="w-[18px] h-[18px] text-white" />
            </button>
          </div>
        </div>

      </div>

      {/* --- FIXED BOTTOM NAVIGATION --- */}
      <div className="absolute bottom-0 left-0 right-0 h-[85px] bg-[#0A0A0A] border-t border-white/5 z-30 px-6 pt-3 pb-6 pointer-events-auto">
        <div className="flex items-start justify-between h-full">
          <button className="flex flex-col items-center gap-1.5 w-14">
            <Home className="w-[26px] h-[26px] text-white fill-white" />
            <span className="text-[10px] font-bold text-white tracking-wide">Acasă</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 w-14">
            <Compass className="w-[26px] h-[26px] text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500 tracking-wide">Explorează</span>
          </button>

          {/* Central Plus Button */}
          <button className="relative -top-2 w-[52px] h-[38px] bg-blue-500 rounded-[18px] flex items-center justify-center shadow-[0_0_14px_rgba(59,130,246,0.6)] active:scale-95 transition-transform">
            <Plus className="w-6 h-6 text-white stroke-[3]" />
          </button>

          <button className="flex flex-col items-center gap-1.5 w-14 relative">
            <div className="relative">
              <Bell className="w-[26px] h-[26px] text-gray-500" />
              <div className="absolute top-0 right-0 w-[14px] h-[14px] bg-red-500 rounded-full border-[2px] border-[#0A0A0A] flex items-center justify-center translate-x-1 -translate-y-0.5">
                <span className="text-[9px] font-bold text-white leading-none">3</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-500 tracking-wide">Notificări</span>
          </button>

          <button className="flex flex-col items-center gap-1.5 w-14">
            <User className="w-[26px] h-[26px] text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500 tracking-wide">Profil</span>
          </button>
        </div>
      </div>

      {/* Custom Global Styles */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
