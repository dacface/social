"use client";

import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Scale,
  Sparkles,
  Send,
  Home,
  Compass,
  Plus,
  Bell,
  User,
  CheckCircle2,
  AlertCircle,
  PlaySquare,
  Clock,
  Activity,
  ShieldCheck
} from 'lucide-react';
import Image from 'next/image';

export default function MobileFeed() {
  const [activeTab, setActiveTab] = useState('Pentru Tine');
  const [activeFilter, setActiveFilter] = useState('Cronologic');

  const tabs = ['Pentru Tine', 'Politic', 'Economie', 'Social', 'Artă', 'Sport'];

  return (
    <main className="relative w-full h-[100dvh] bg-black text-white font-sans overflow-hidden max-w-md mx-auto sm:border-x sm:border-gray-800">
      
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1541872596495-25b8431945ae?q=80&w=800&auto=format&fit=crop" 
          alt="Post background"
          className="w-full h-full object-cover"
        />
        {/* Gradient overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* --- TOP NAVIGATION --- */}
      <div className="absolute top-0 left-0 right-0 z-20 pt-12 px-4">
        {/* Tabs Row */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-5">
            {tabs.map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap pb-1.5 text-sm font-semibold transition-colors
                  ${activeTab === tab 
                    ? 'text-white border-b-2 border-white' 
                    : 'text-gray-300/70 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="text-white p-1">
            <Search className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-2">
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600/40 backdrop-blur-md rounded-full text-xs font-medium border border-gray-500/30"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Cronologic</span>
            <span className="text-gray-400 ml-1">v</span>
          </button>
          
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600/40 backdrop-blur-md rounded-full text-xs font-medium border border-gray-500/30"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Algoritmic</span>
            <span className="text-gray-400 ml-1">v</span>
          </button>
          
          <button 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-600/40 backdrop-blur-md rounded-full text-xs font-medium border border-gray-500/30"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verificat</span>
          </button>

          <div className="flex-1" />
          <button className="text-white p-1">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* --- FLOATING ELEMENTS --- */}
      {/* Fact Check Pill */}
      <button className="absolute top-36 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-md rounded-full border border-red-500/30">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <span className="text-xs font-bold text-gray-200">FALS</span>
        <span className="text-xs md:text-[11px] text-gray-300">Manipulare detectată &gt;</span>
      </button>

      {/* Top Right Floating Avatar */}
      <div className="absolute top-36 right-4 z-20">
        <div className="relative">
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d" 
            className="w-10 h-10 rounded-full border-2 border-white/20"
            alt="Secondary user"
          />
          <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5 border-2 border-transparent">
            <CheckCircle2 className="w-3 h-3 text-white" />
          </div>
        </div>
        <div className="text-[9px] text-white/70 text-center mt-1 font-medium">1 112</div>
      </div>

      {/* --- RIGHT ACTIONS BAR --- */}
      <div className="absolute right-4 bottom-32 z-20 flex flex-col items-center gap-6">
        <button className="flex flex-col items-center gap-1">
          <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">12.4K</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
            <MessageCircle className="w-7 h-7 text-white fill-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">256</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <div className="p-3 bg-black/20 rounded-full backdrop-blur-sm">
            <Share2 className="w-7 h-7 text-white fill-white" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">1.2K</span>
        </button>

        <button className="flex flex-col items-center gap-1 mt-2">
          <div className="p-3 bg-black/40 rounded-full backdrop-blur-md border border-white/20">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium text-white drop-shadow-md">Dezbatere</span>
        </button>

        <button className="flex flex-col items-center gap-1 mt-2">
          <div className="p-3 bg-purple-600/30 rounded-full backdrop-blur-md border border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            <Sparkles className="w-6 h-6 text-purple-200" />
          </div>
          <span className="text-[10px] font-medium text-purple-200 drop-shadow-md">Explică AI</span>
        </button>
      </div>

      {/* --- BOTTOM LEFT CONTENT --- */}
      <div className="absolute left-4 bottom-28 right-20 z-20 flex flex-col gap-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <img 
            src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
            className="w-11 h-11 rounded-full border border-white/30"
            alt="Ana Popescu"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-white drop-shadow-md">Ana Popescu</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-blue-500 bg-white rounded-full" />
            </div>
            <span className="text-xs text-gray-300 drop-shadow-md">
              București, România • 5m
            </span>
          </div>
        </div>

        {/* Caption */}
        <p className="text-sm font-medium text-white leading-snug drop-shadow-md">
          Trebuie să mergem la vot pentru a schimba viitorul! 
          <span className="text-blue-400"> #Politica #Alegeri #Democratie</span>
        </p>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 mt-1">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800/60 backdrop-blur-md rounded-md">
            <PlaySquare className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-medium text-gray-200">Politic</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800/60 backdrop-blur-md rounded-md">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs font-medium text-gray-200">Alegeri 2025</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-800/60 backdrop-blur-md rounded-md">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs font-medium text-gray-200">Discuție activă</span>
          </div>
        </div>
      </div>

      {/* --- COMMENT INPUT ROW --- */}
      <div className="absolute bottom-[72px] left-0 right-0 px-4 z-20">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-3 py-2">
          <img 
             src="https://i.pravatar.cc/150?u=a042581f4e29026024d" 
             className="w-7 h-7 rounded-full"
             alt="User"
          />
          <input 
            type="text" 
            placeholder="Adaugă un comentariu..." 
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-400 outline-none"
          />
          <button className="text-gray-400 hover:text-white transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- FIXED BOTTOM NAVIGATION --- */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-t border-gray-800/60 z-30 px-6">
        <div className="flex items-center justify-between h-full">
          <button className="flex flex-col items-center gap-1">
            <Home className="w-6 h-6 text-white" />
            <span className="text-[10px] font-medium text-white">Acasă</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <Compass className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500">Explorează</span>
          </button>

          <button className="relative -top-3 w-12 h-10 bg-blue-500 hover:bg-blue-400 transition-colors rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <Plus className="w-6 h-6 text-white" />
          </button>

          <button className="flex flex-col items-center gap-1 relative">
            <div className="relative">
              <Bell className="w-6 h-6 text-gray-500" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-black flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">3</span>
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-500">Notificări</span>
          </button>

          <button className="flex flex-col items-center gap-1">
            <User className="w-6 h-6 text-gray-500" />
            <span className="text-[10px] font-medium text-gray-500">Profil</span>
          </button>
        </div>
      </div>

      {/* Custom styles to hide scrollbar */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </main>
  );
}
