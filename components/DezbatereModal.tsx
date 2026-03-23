"use client";

import React, { useState } from 'react';
import { X, ThumbsUp, ArrowRight } from 'lucide-react';

interface DezbatereModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

export default function DezbatereModal({ isOpen, onClose, postId }: DezbatereModalProps) {
  const [activeTab, setActiveTab] = useState<'pro' | 'contra'>('pro');
  const [draft, setDraft] = useState('');
  const [argumentsByTab, setArgumentsByTab] = useState({
    pro: [
      { id: `${postId}-pro-1`, author: 'Ion Ionescu', text: 'Această măsură va aduce beneficii pe termen lung pentru economie. Este necesară o reformă acum.', votes: 245 },
      { id: `${postId}-pro-2`, author: 'Maria G.', text: 'Studiile arată clar că direcția aceasta funcționează în alte țări europene.', votes: 180 },
    ],
    contra: [
      { id: `${postId}-contra-1`, author: 'Radu Popa', text: 'Costurile de implementare sunt prea mari pentru bugetul actual. Ne vom îndatora și mai mult.', votes: 312 },
      { id: `${postId}-contra-2`, author: 'Elena D.', text: 'Nu a existat o consultare publică reală înainte de a propune acest lucru.', votes: 89 },
    ],
  });

  if (!isOpen) return null;

  const visibleArguments = argumentsByTab[activeTab];

  const handleSubmitArgument = () => {
    const nextText = draft.trim();

    if (!nextText) {
      return;
    }

    setArgumentsByTab((current) => ({
      ...current,
      [activeTab]: [
        {
          id: `${postId}-${activeTab}-${Date.now()}`,
          author: 'Alexandru Marin',
          text: nextText,
          votes: 1,
        },
        ...current[activeTab],
      ],
    }));
    setDraft('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full sm:w-[500px] sm:max-w-[95%] bg-[#F0F2F5] sm:rounded-xl rounded-t-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Dezbatere Publică</h2>
          <button 
            onClick={onClose}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Voting Header */}
        <div className="bg-white px-5 py-4 flex flex-col gap-3">
          <p className="text-[15px] font-semibold text-gray-800 text-center">
            Părerea comunității despre acest subiect
          </p>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-green-600">65%</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Sunt de acord</span>
            </div>
            <div className="w-full flex-1 h-3 bg-red-100 rounded-full overflow-hidden flex">
              <div className="h-full bg-green-500" style={{ width: '65%' }} />
              <div className="h-full bg-red-500" style={{ width: '35%' }} />
            </div>
            <div className="flex flex-col items-center flex-1">
              <span className="text-2xl font-bold text-red-600">35%</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Se opun</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white mt-1 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('pro')}
            className={`flex-1 py-3 text-[15px] font-bold ${activeTab === 'pro' ? 'text-green-600 border-b-[3px] border-green-600' : 'text-gray-500'}`}
          >
            Argumente PRO
          </button>
          <button 
            onClick={() => setActiveTab('contra')}
            className={`flex-1 py-3 text-[15px] font-bold ${activeTab === 'contra' ? 'text-red-600 border-b-[3px] border-red-600' : 'text-gray-500'}`}
          >
            Argumente CONTRA
          </button>
        </div>

        {/* Arguments List */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {visibleArguments.map((argument) => (
            <ArgumentCard key={argument.id} author={argument.author} text={argument.text} votes={argument.votes} isPro={activeTab === 'pro'} />
          ))}
        </div>

        {/* Add argument footer */}
        <div className="bg-white p-4 border-t border-gray-200">
          <div className="flex flex-col gap-3">
            <textarea
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={activeTab === 'pro' ? 'Adaugă un argument PRO...' : 'Adaugă un argument CONTRA...'}
              className="min-h-[96px] w-full resize-none rounded-lg border border-gray-200 bg-[#F7F8FA] px-3 py-3 text-[14px] text-gray-800 outline-none"
            />
            <button
              onClick={handleSubmitArgument}
              disabled={!draft.trim()}
              className="w-full py-2.5 bg-[#1877F2] hover:bg-[#166FE5] disabled:bg-[#b9d4fb] text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Participă la dezbatere
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArgumentCard({ author, text, votes, isPro }: { author: string, text: string, votes: number, isPro: boolean }) {
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-[14px] text-gray-900">{author}</span>
        <div className="flex items-center gap-1">
          <span className="text-[13px] font-semibold text-gray-600">{votes}</span>
          <ThumbsUp className={`w-4 h-4 ${isPro ? 'text-green-600' : 'text-red-600'}`} />
        </div>
      </div>
      <p className="text-[14px] text-gray-700">{text}</p>
    </div>
  );
}
