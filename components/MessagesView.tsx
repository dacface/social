"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { ImagePlus, Search, Send } from 'lucide-react';

const THREADS = [
  {
    id: 't1',
    name: 'Alexandra Rus',
    avatar: 'https://i.pravatar.cc/150?u=msg-alexandra',
    messages: [
      { id: 'm1', fromMe: false, text: 'Ai văzut ultimele reacții la postarea despre fact-checking?' },
      { id: 'm2', fromMe: true, text: 'Da, și cred că merită transformată într-o dezbatere separată.' },
    ],
  },
  {
    id: 't2',
    name: 'Echipa Dacface',
    avatar: 'https://i.pravatar.cc/150?u=msg-dacface',
    messages: [
      { id: 'm3', fromMe: false, text: 'Am activat noile suprafețe pentru marketplace și evenimente.' },
    ],
  },
];

export default function MessagesView() {
  const [query, setQuery] = useState('');
  const [threads, setThreads] = useState(THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(THREADS[0]?.id ?? null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadMessages() {
      try {
        const response = await fetch('/api/messages', { cache: 'no-store' });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load conversations');
        }

        if (!cancelled && Array.isArray(data.conversations) && data.conversations.length > 0) {
          setThreads(data.conversations);
          setActiveThreadId(data.conversations[0].id);
        }
      } catch {
        if (!cancelled) {
          setThreads(THREADS);
        }
      }
    }

    loadMessages();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredThreads = useMemo(
    () => threads.filter((thread) => thread.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query, threads]
  );

  const activeThread = threads.find((thread) => thread.id === activeThreadId) ?? null;

  const sendMessage = () => {
    if (!draft.trim() || !activeThread) {
      return;
    }

    const messageText = draft.trim();
    const optimisticMessage = { id: `m-${Date.now()}`, fromMe: true, text: messageText };

    setThreads((current) =>
      current.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              messages: [...thread.messages, optimisticMessage],
            }
          : thread
      )
    );
    setDraft('');

    void fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: activeThread.id, text: messageText }),
    }).catch(() => {
      // Leave optimistic state in place if request fails.
    });
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white px-4 pb-4 pt-4 shadow-sm">
        <div className="text-[28px] font-bold tracking-tight text-[#050505]">Mesaje</div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-[#F0F2F5] px-4 py-3">
          <Search className="h-5 w-5 text-[#65676b]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Caută conversații"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-[#65676b]"
          />
        </div>
      </div>

      <div className="grid gap-3 p-3 md:grid-cols-[240px_minmax(0,1fr)]">
        <div className="space-y-2">
          {filteredThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => setActiveThreadId(thread.id)}
              className={`flex w-full items-center gap-3 rounded-[22px] p-3 text-left shadow-sm ${
                activeThreadId === thread.id ? 'bg-[#E7F3FF]' : 'bg-white'
              }`}
            >
              <img src={thread.avatar} alt={thread.name} className="h-12 w-12 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#050505]">{thread.name}</div>
                <div className="mt-1 line-clamp-1 text-[13px] text-[#65676b]">
                  {thread.messages[thread.messages.length - 1]?.text}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="flex min-h-[520px] flex-col rounded-[24px] bg-white shadow-sm">
          {activeThread ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                <img src={activeThread.avatar} alt={activeThread.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="text-[16px] font-bold text-[#050505]">{activeThread.name}</div>
                  <div className="text-[13px] text-[#65676b]">Activ recent</div>
                </div>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                {activeThread.messages.map((message) => (
                  <div key={message.id} className={`flex ${message.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-[20px] px-4 py-3 text-[15px] ${
                        message.fromMe ? 'bg-[#1877F2] text-white' : 'bg-[#F0F2F5] text-[#050505]'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 px-4 py-3">
                <div className="flex items-center gap-2 rounded-2xl bg-[#F0F2F5] px-3 py-2">
                  <button className="rounded-full p-2 text-[#65676b] hover:bg-white">
                    <ImagePlus className="h-5 w-5" />
                  </button>
                  <input
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Scrie un mesaj"
                    className="w-full bg-transparent text-[15px] outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                    className="rounded-full p-2 text-[#1877F2] disabled:text-[#B9D4FB]"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-[15px] text-[#65676b]">
              Selectează o conversație pentru a continua.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
