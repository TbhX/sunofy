'use client';

import React, { useState } from 'react';
import { Heart, Music2, Mic2, Disc3 } from 'lucide-react';

const TABS = [
  { id: 'playlists', label: 'Playlists', icon: Music2 },
  { id: 'artists', label: 'Artists', icon: Mic2 },
  { id: 'albums', label: 'Albums', icon: Disc3 },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('playlists');

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-6 font-accent">Your Library</h1>
        <div className="flex space-x-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-solar-glow'
                  : 'bg-card/40 hover:bg-card/80 border border-white/5'
              }`}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Liked Songs Special Card */}
        <div className="bg-gradient-to-br from-indigo-700 via-indigo-600 to-primary/80 col-span-2 rounded-xl p-8 flex flex-col justify-end relative overflow-hidden group cursor-pointer shadow-solar-glow/20 hover:shadow-solar-glow transition-all active:scale-[0.98]">
          <div className="absolute top-6 right-6 text-white/20 group-hover:scale-110 transition-transform">
            <Heart size={80} fill="currentColor" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Liked Songs</h2>
            <p className="text-white/80 font-medium">0 liked songs</p>
          </div>
        </div>

        {/* Placeholder Items */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card/40 border border-white/5 p-4 rounded-xl hover:bg-card/80 transition-all group cursor-pointer glass relative hover:-translate-y-1">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-xl bg-muted flex items-center justify-center">
              <Music2 size={48} className="text-muted-foreground/20" />
            </div>
            <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">My Suno Mix #{i}</h3>
            <p className="text-xs text-muted-foreground line-clamp-1 mt-1">Playlist • You</p>
          </div>
        ))}
      </div>

      {/* Empty State for specific tabs if needed */}
      {activeTab !== 'playlists' && (
        <div className="mt-12 flex flex-col items-center justify-center text-center py-20 bg-card/20 rounded-2xl border border-dashed border-white/10">
          <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {activeTab === 'artists' ? <Mic2 size={32} /> : <Disc3 size={32} />}
          </div>
          <h3 className="text-xl font-bold mb-2">No {activeTab} yet</h3>
          <p className="text-muted-foreground max-w-sm">Follow your favorite AI artists or save albums to see them here.</p>
        </div>
      )}
    </div>
  );
}
