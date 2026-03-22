import React from 'react';
import { Users, Activity, Shield, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">dacface.</h1>
          <p className="text-gray-400 text-sm mt-1">Sistem de Control Admin</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">Admin: <span className="text-blue-400">cristian@dacface.com</span></div>
          <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
            Deconectare
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Utilizatori Total</p>
            <p className="text-3xl font-bold mt-1">1.2M</p>
          </div>
          <Users className="w-10 h-10 text-blue-500 opacity-50" />
        </div>
        
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Dezbateri Active</p>
            <p className="text-3xl font-bold mt-1">45,210</p>
          </div>
          <Activity className="w-10 h-10 text-purple-500 opacity-50" />
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Fact-Check (Verificări)</p>
            <p className="text-3xl font-bold mt-1">1,402</p>
          </div>
          <Shield className="w-10 h-10 text-green-500 opacity-50" />
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">Creștere (24h)</p>
            <p className="text-3xl font-bold mt-1 text-green-400">+12%</p>
          </div>
          <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Management */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Management Utilizatori</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300">Vezi Toți</button>
          </div>
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center bg-gray-950 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Ion Popescu {i}</p>
                    <p className="text-xs text-gray-500">Reputație: <span className="text-green-400">98</span></p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-white transition-colors">
                    Verificare
                  </button>
                  <button className="text-xs bg-red-900/50 text-red-400 hover:bg-red-900/80 px-3 py-1.5 rounded transition-colors">
                    Block
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Settings & Actions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-lg font-semibold">Acțiuni Rapide Sistem</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <button className="bg-gray-800 border-gray-700 border hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
              <h3 className="font-medium">Force Cache Invalidation</h3>
              <p className="text-xs text-gray-400 mt-1">Șterge Redis Cache pt. Feeds</p>
            </button>
            <button className="bg-gray-800 border-gray-700 border hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
              <h3 className="font-medium">Moderarare Continut AI</h3>
              <p className="text-xs text-gray-400 mt-1">Rulează modelul de detecție</p>
            </button>
            <button className="bg-gray-800 border-gray-700 border hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
              <h3 className="font-medium">Ajustează Algoritm</h3>
              <p className="text-xs text-gray-400 mt-1">Procentaj cronologic vs trend</p>
            </button>
            <button className="bg-gray-800 border-gray-700 border hover:bg-gray-700 p-4 rounded-lg text-left transition-colors">
              <h3 className="font-medium">Notificare Globală</h3>
              <p className="text-xs text-gray-400 mt-1">Trimite push tuturor userilor</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
