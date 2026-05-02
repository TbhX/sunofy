import { create } from 'zustand';
import { Howl } from 'howler';

export interface Song {
  id: string;
  suno_id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // in seconds
  audioUrl: string;
  coverUrl?: string;
}

interface PlayerState {
  currentTrack: Song | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // current position in seconds
  duration: number; // total duration in seconds
  queue: Song[];
  howl: Howl | null;
  
  // Actions
  setTrack: (track: Song) => void;
  setQueue: (tracks: Song[]) => void;
  togglePlay: () => void;
  play: () => void;
  pause: () => void;
  setVolume: (volume: number) => void;
  seek: (position: number) => void;
  updateProgress: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  addToQueue: (track: Song) => void;
}

const ALLOWED_AUDIO_DOMAINS = [
  'www.soundhelix.com',
  'suno.ai',
  'cdn1.suno.ai',
  'cdn2.suno.ai',
  'r2.sunofy.app',
  'pub-34d673932e6546368d3744957e742461.r2.dev' // Mock R2 domain
];

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 0.7,
  progress: 0,
  duration: 0,
  queue: [],
  howl: null,

  setTrack: (track: Song) => {
    // Security: Validate audio URL
    try {
      const url = new URL(track.audioUrl);
      if (!ALLOWED_AUDIO_DOMAINS.some(domain => url.hostname.endsWith(domain))) {
        console.error(`Blocked audio URL from untrusted domain: ${url.hostname}`);
        return;
      }
    } catch {
      console.error(`Invalid audio URL: ${track.audioUrl}`);
      return;
    }

    const { howl: oldHowl, volume } = get();
    
    if (oldHowl) {
      oldHowl.stop();
      oldHowl.unload();
    }

    const newHowl = new Howl({
      src: [track.audioUrl],
      html5: true,
      volume: volume,
      onplay: () => set({ isPlaying: true }),
      onpause: () => set({ isPlaying: false }),
      onstop: () => set({ isPlaying: false, progress: 0 }),
      onend: () => {
        set({ isPlaying: false, progress: 0 });
        get().nextTrack();
      },
      onload: () => {
        set({ duration: newHowl.duration() });
      }
    });

    set({ 
      currentTrack: track, 
      howl: newHowl,
      progress: 0,
      duration: track.duration || 0,
      isPlaying: true
    });
    
    newHowl.play();
  },

  setQueue: (tracks: Song[]) => {
    set({ queue: tracks });
  },

  togglePlay: () => {
    const { howl, isPlaying, currentTrack, queue } = get();
    
    if (!howl) {
        if (queue.length > 0) {
            get().setTrack(queue[0]);
        } else if (currentTrack) {
            get().setTrack(currentTrack);
        }
        return;
    }

    if (isPlaying) {
      howl.pause();
    } else {
      howl.play();
    }
  },

  play: () => {
    const { howl } = get();
    if (howl) howl.play();
  },

  pause: () => {
    const { howl } = get();
    if (howl) howl.pause();
  },

  setVolume: (volume: number) => {
    const { howl } = get();
    if (howl) howl.volume(volume);
    set({ volume });
  },

  seek: (position: number) => {
    const { howl } = get();
    if (howl) {
      howl.seek(position);
      set({ progress: position });
    }
  },

  updateProgress: () => {
    const { howl } = get();
    if (howl && howl.playing()) {
      set({ progress: howl.seek() as number });
    }
  },

  nextTrack: () => {
    const { queue, currentTrack } = get();
    if (queue.length === 0) return;
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < queue.length - 1) {
      get().setTrack(queue[currentIndex + 1]);
    }
  },

  previousTrack: () => {
    const { queue, currentTrack, howl } = get();
    if (queue.length === 0) return;

    // If more than 3 seconds in, restart the song
    if (howl && (howl.seek() as number) > 3) {
      get().seek(0);
      return;
    }
    
    const currentIndex = queue.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      get().setTrack(queue[currentIndex - 1]);
    } else {
        get().seek(0);
    }
  },

  addToQueue: (track: Song) => {
    set(state => ({ queue: [...state.queue, track] }));
  }
}));
