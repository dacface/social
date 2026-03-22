import React from 'react';
import { Settings, User, Bell, Download, Shield, Layout } from 'lucide-react';

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 max-w-5xl mx-auto">
      <header className="mb-10 flex items-center gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl font-bold">
          C
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cristian</h1>
          <p className="text-gray-400">Reputație Globală: <span className="text-green-400 font-medium">98</span></p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation / Sections */}
        <div className="col-span-1 space-y-2">
          <button className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-colors">
            <User className="text-blue-400 w-5 h-5" />
            <span className="font-medium">Editează Profil</span>
          </button>
          
          <button className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-colors">
            <Layout className="text-purple-400 w-5 h-5" />
            <span className="font-medium">Preferințe Feed</span>
          </button>
          
          <button className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-colors">
            <Bell className="text-yellow-400 w-5 h-5" />
            <span className="font-medium">Gestionare Notificări</span>
          </button>

          <button className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-colors">
            <Shield className="text-green-400 w-5 h-5" />
            <span className="font-medium">Securitate & Privacy</span>
          </button>

          <button className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-colors">
            <Download className="text-gray-400 w-5 h-5" />
            <span className="font-medium">Export Date</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Preferințe Feed</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h3 className="font-medium">Mod Afișare</h3>
                  <p className="text-sm text-gray-400">Alege cum vrei să vezi ideile</p>
                </div>
                <div className="flex bg-gray-950 rounded-lg p-1 border border-gray-800">
                  <button className="px-4 py-1.5 bg-gray-800 rounded-md text-sm font-medium">Algoritmic</button>
                  <button className="px-4 py-1.5 text-gray-400 hover:text-white rounded-md text-sm font-medium transition-colors">Cronologic</button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-gray-800 pb-4">
                <div>
                  <h3 className="font-medium">Doar Conturi Verificate</h3>
                  <p className="text-sm text-gray-400">Filtrează conținutul pentru a evita spam-ul</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6"></span>
                </div>
              </div>

              <div className="flex items-center justify-between pb-2">
                <div>
                  <h3 className="font-medium">Autoplay Reels</h3>
                  <p className="text-sm text-gray-400">Rulează automat video-urile scurte</p>
                </div>
                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700">
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1"></span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Analize Conținut</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                <p className="text-sm text-gray-400">Vizualizări (30 zile)</p>
                <p className="text-2xl font-bold mt-1">12.4K</p>
              </div>
              <div className="bg-gray-950 p-4 rounded-lg border border-gray-800">
                <p className="text-sm text-gray-400">Argumente adăugate</p>
                <p className="text-2xl font-bold mt-1">142</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
