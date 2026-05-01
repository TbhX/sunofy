'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Play, 
  Pause,
  SkipBack, 
  SkipForward, 
  Repeat, 
  Shuffle, 
  Volume2, 
  ListMusic,
  Mic2,
  MonitorSpeaker
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { usePlayerStore } from '@/stores/player';

const PlayerBar = () => {
  const { 
    currentTrack, 
    isPlaying, 
    volume, 
    progress,
    duration,
    togglePlay, 
    setVolume, 
    seek, 
    nextTrack, 
    previousTrack,
    updateProgress
  } = usePlayerStore();

  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        updateProgress();
      }, 500);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, updateProgress]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-24 bg-card border-t border-border px-4 flex items-center justify-between z-50 relative">
      {/* Track Info */}
      <div className="flex items-center w-[30%]">
        <div className="w-14 h-14 bg-muted rounded flex-shrink-0 overflow-hidden shadow-solar-glow/20">
          {currentTrack?.coverUrl ? (
            <img src={currentTrack.coverUrl} alt={currentTrack.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>
        <div className="ml-4 truncate">
          <p className="text-sm text-foreground font-medium hover:underline cursor-pointer hover:text-primary transition-colors">
            {currentTrack?.title || 'No track selected'}
          </p>
          <p className="text-xs text-muted-foreground hover:underline cursor-pointer hover:text-foreground transition-colors">
            {currentTrack?.artist || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full">
        <div className="flex items-center space-x-6">
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Shuffle size={16} />
          </button>
          <button 
            onClick={previousTrack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button 
            onClick={togglePlay}
            className="bg-primary text-primary-foreground rounded-full p-2 hover:scale-105 transition shadow-solar-glow"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          </button>
          <button 
            onClick={nextTrack}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            <Repeat size={16} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2 w-full mt-2">
          <span className="text-[10px] text-muted-foreground min-w-[30px] text-right">
            {formatTime(progress)}
          </span>
          <Slider 
            value={[progress]} 
            max={duration || 100} 
            step={0.1} 
            className="w-full" 
            onValueChange={(val) => seek(val[0])}
          />
          <span className="text-[10px] text-muted-foreground min-w-[30px]">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume/Extra */}
      <div className="flex items-center justify-end w-[30%] space-x-3">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <Mic2 size={16} />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ListMusic size={16} />
        </button>
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <MonitorSpeaker size={16} />
        </button>
        <div className="flex items-center space-x-2 w-24">
          <Volume2 size={16} className="text-muted-foreground" />
          <Slider 
            value={[volume * 100]} 
            max={100} 
            step={1} 
            className="w-full" 
            onValueChange={(val) => setVolume(val[0] / 100)}
          />
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;
