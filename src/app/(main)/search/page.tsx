'use client';

import React, { useState } from 'react';
import { Search as SearchIcon, X, Play, Clock } from 'lucide-react';
import { usePlayerStore, Song } from '@/stores/player';
import Image from 'next/image';

const CATEGORIES = [
  { title: 'Electronic', color: 'bg-blue-600' },
  { title: 'Pop', color: 'bg-green-600' },
  { title: 'Rock', color: 'bg-red-600' },
  { title: 'Hip Hop', color: 'bg-purple-600' },
  { title: 'Jazz', color: 'bg-yellow-600' },
  { title: 'Classical', color: 'bg-pink-600' },
  { title: 'Ambient', color: 'bg-indigo-600' },
  { title: 'Chill', color: 'bg-teal-600' },
];

const MOCK_RESULTS: Song[] = [
  {
    id: 'search-1',
    suno_id: 'suno-s1',
    title: 'Cybernetic Dreams',
    artist: 'Synth Wave AI',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop'
  },
  {
    id: 'search-2',
    suno_id: 'suno-s2',
    title: 'Neon Horizons',
    artist: 'Digital Echo',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    duration: 312,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop'
  }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { setTrack, setQueue } = usePlayerStore();

  const handlePlay = (song: Song) => {
    setQueue(MOCK_RESULTS);
    setTrack(song);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-8">
      {/* Search Header */}
      <div className="max-w-md mb-8">
        <div className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <SearchIcon size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-card/60 border border-white/10 rounded-full py-3 pl-12 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-card transition-all text-sm glass"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {!searchQuery ? (
        /* Categories */
        <section>
          <h2 className="text-2xl font-bold mb-6 font-accent">Browse all</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {CATEGORIES.map((cat) => (
              <div 
                key={cat.title}
                className={`${cat.color} aspect-square rounded-xl p-4 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition shadow-lg group glass border-white/10`}
              >
                <h3 className="text-xl font-bold text-white z-10 relative">{cat.title}</h3>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-lg rotate-[25deg] group-hover:rotate-[20deg] transition-transform" />
              </div>
            ))}
          </div>
        </section>
      ) : (
        /* Search Results */
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-accent">Search results for &quot;{searchQuery}&quot;</h2>
          </div>
          
          <div className="space-y-1">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 text-sm text-muted-foreground border-b border-white/5 mb-2">
              <div className="w-10">#</div>
              <div>Title</div>
              <div className="flex items-center"><Clock size={16} /></div>
            </div>
            
            {MOCK_RESULTS.map((track, i) => (
              <div 
                key={track.id}
                onClick={() => handlePlay(track)}
                className="grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 rounded-md hover:bg-white/5 group cursor-pointer items-center transition-colors"
              >
                <div className="w-10 text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-center">
                   <span className="group-hover:hidden">{i + 1}</span>
                   <Play size={16} className="hidden group-hover:block fill-primary text-primary" />
                </div>
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0 relative">
                    {track.coverUrl && <Image src={track.coverUrl} alt={track.title} fill className="object-cover" />}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-foreground truncate group-hover:text-primary transition-colors">{track.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDuration(track.duration)}
                </div>
              </div>
            ))}
          </div>

          {/* No results simulation */}
          {searchQuery.length > 20 && (
            <div className="mt-12 flex flex-col items-center justify-center text-center py-20">
              <SearchIcon size={64} className="text-muted-foreground/20 mb-4" />
              <h3 className="text-xl font-bold mb-2">No results found</h3>
              <p className="text-muted-foreground">Try searching for something else.</p>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
