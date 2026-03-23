"use client";

import React, { useState } from 'react';
import { CalendarDays, Clock3, MapPin, Plus, Users } from 'lucide-react';

interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  imageUrl: string;
}

const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Summit Social Media & Creator Economy',
    date: '27 martie',
    time: '18:30',
    location: 'București, Sala Palatului',
    attendees: 184,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'e2',
    title: 'Târg local de design și produse handmade',
    date: '29 martie',
    time: '11:00',
    location: 'Cluj-Napoca, Iulius Parc',
    attendees: 96,
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'e3',
    title: 'Meetup fondatori tech România',
    date: '2 aprilie',
    time: '19:00',
    location: 'Timișoara, Cowork Hub',
    attendees: 73,
    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop',
  },
];

export default function EventsView() {
  const [interestedIds, setInterestedIds] = useState<string[]>(['e1']);
  const [goingIds, setGoingIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const toggleInterested = (id: string) => {
    setInterestedIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
  };

  const toggleGoing = (id: string) => {
    setGoingIds((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]));
    setInterestedIds((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="sticky top-0 z-30 bg-white px-4 pb-4 pt-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[29px] font-[700] tracking-[-0.045em] text-[#050505]">Evenimente</div>
            <div className="text-[14px] text-[#65676b]">Descoperă ce se întâmplă în jurul tău și răspunde rapid.</div>
          </div>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#1877F2] px-4 py-2 text-[14px] font-[640] tracking-[-0.02em] text-white shadow-sm"
          >
            <Plus className="h-4 w-4" />
            Creează
          </button>
        </div>
      </div>

      <div className="space-y-3 p-3">
        {INITIAL_EVENTS.map((event) => {
          const isInterested = interestedIds.includes(event.id);
          const isGoing = goingIds.includes(event.id);

          return (
            <article key={event.id} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#D9DDE3]">
                <img src={event.imageUrl} alt={event.title} className="h-full w-full object-cover" />
              </div>

              <div className="p-4">
                <div className="text-[20px] font-[680] tracking-[-0.03em] text-[#050505]">{event.title}</div>
                <div className="mt-3 space-y-2 text-[14px] text-[#65676b]">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees + (isGoing ? 1 : 0)} participă sau sunt interesați</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => toggleInterested(event.id)}
                    className={`rounded-2xl px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] shadow-sm ${
                      isInterested ? 'bg-[#E7F3FF] text-[#1877F2]' : 'bg-[#E9EDF2] text-[#050505]'
                    }`}
                  >
                    {isInterested ? 'Interesat' : 'Mă interesează'}
                  </button>
                  <button
                    onClick={() => toggleGoing(event.id)}
                    className={`rounded-2xl px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] shadow-sm ${
                      isGoing ? 'bg-[#1877F2] text-white' : 'bg-[#E9EDF2] text-[#050505]'
                    }`}
                  >
                    {isGoing ? 'Particip' : 'Voi participa'}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {isCreateOpen ? (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm" onClick={() => setIsCreateOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white px-4 pb-6 pt-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-gray-300" />
            <div className="text-[19px] font-[680] tracking-[-0.035em] text-[#050505]">Creează eveniment</div>
            <div className="mt-3 space-y-3">
              <input className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none" placeholder="Titlu eveniment" />
              <input className="w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none" placeholder="Locație" />
              <textarea className="min-h-[120px] w-full rounded-2xl border border-gray-200 bg-[#F7F8FA] px-4 py-3 text-[15px] outline-none" placeholder="Descriere" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button onClick={() => setIsCreateOpen(false)} className="rounded-2xl bg-[#E9EDF2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-[#050505]">
                Renunță
              </button>
              <button onClick={() => setIsCreateOpen(false)} className="rounded-2xl bg-[#1877F2] px-4 py-[11px] text-[14px] font-[640] tracking-[-0.02em] text-white">
                Publică
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
