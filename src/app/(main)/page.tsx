'use client';

import React from 'react';
import { usePlayerStore, Song } from '@/stores/player';
import { Play } from 'lucide-react';

export default function HomePage() {
  const { setTrack, setQueue } = usePlayerStore();

  const mockTracks: Song[] = [
    {
      id: 'mock-1',
      suno_id: 'suno-1',
      title: 'Solar Flare Symphony',
      artist: 'Suno Artist',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      duration: 372,
      coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=300&h=300&fit=crop'
    },
    {
      id: 'mock-2',
      suno_id: 'suno-2',
      title: 'Midnight Nebula',
      artist: 'AI Producer',
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      duration: 425,
      coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&h=300&fit=crop'
    }
  ];

  const handlePlayMock = () => {
    setQueue(mockTracks);
    setTrack(mockTracks[0]);
  };

  return (
    <div className="p-8">
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold font-accent tracking-tighter text-foreground">Good evening</h2>
          <button 
            onClick={handlePlayMock}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-bold hover:scale-105 transition shadow-solar-glow active:scale-95"
          >
            Play Mock Tracks
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockTracks.map((track) => (
            <div 
                key={track.id} 
                onClick={() => {
                    setQueue(mockTracks);
                    setTrack(track);
                }}
                className="flex items-center bg-card/40 hover:bg-card/80 border border-white/5 hover:border-primary/20 transition rounded overflow-hidden group cursor-pointer glass"
            >
              <div className="w-20 h-20 bg-muted flex-shrink-0 shadow-lg relative">
                {track.coverUrl && <img src={track.coverUrl} alt={track.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play size={24} className="text-primary fill-primary" />
                </div>
              </div>
              <div className="px-4 py-2 flex-1 min-w-0">
                <p className="font-bold text-foreground truncate group-hover:text-primary transition-colors">{track.title}</p>
                <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold font-accent tracking-tight text-foreground hover:underline cursor-pointer">Made For You</h2>
          <span className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Show all</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-card/40 border border-white/5 p-4 rounded-xl hover:bg-card/80 transition-all group cursor-pointer glass relative hover:-translate-y-1">
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg shadow-xl">
                <div className="w-full h-full bg-muted"></div>
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-solar-glow bg-primary rounded-full p-3 text-primary-foreground active:scale-90">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
              <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">Solar Discover {i}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">Your cosmic mix of AI energy.</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
