'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Search', href: '/search', icon: Search },
    { label: 'Your Library', href: '/library', icon: Library },
  ];

  return (
    <div className="flex flex-col h-full bg-background w-64 p-4 space-y-6 border-r border-border">
      <div className="px-2 mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full shadow-solar-glow group-hover:shadow-solar-glow-lg transition-all duration-300">
            <Image 
              src="/branding/logo.png" 
              alt="Sunofy Logo" 
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary font-accent tracking-tighter group-hover:text-morning-sun transition-colors">
            Sunofy
          </h1>
        </Link>
      </div>
      
      <nav className="space-y-1 text-muted-foreground font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex items-center space-x-4 px-3 py-2 rounded-md transition group",
                isActive ? "bg-white/5 text-foreground" : "hover:text-foreground hover:bg-white/5"
              )}
            >
              <item.icon 
                size={24} 
                className={cn(
                  "transition-colors",
                  isActive ? "text-primary" : "group-hover:text-primary"
                )} 
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="pt-6 space-y-4">
        <button className="flex items-center space-x-4 px-3 text-muted-foreground hover:text-foreground transition w-full group">
          <div className="bg-muted text-foreground p-1 rounded-sm group-hover:bg-primary transition-colors group-hover:text-primary-foreground">
            <PlusSquare size={16} />
          </div>
          <span className="font-medium text-sm">Create Playlist</span>
        </button>
        <Link 
          href="/library?tab=liked" 
          className={cn(
            "flex items-center space-x-4 px-3 py-1 text-muted-foreground hover:text-foreground transition group",
            pathname === '/library' && 'text-foreground' // Simple check for liked songs highlight if needed
          )}
        >
          <div className="bg-gradient-to-br from-primary to-secondary p-1 rounded-sm shadow-solar-glow/20">
            <Heart size={16} className="text-primary-foreground fill-current" />
          </div>
          <span className="font-medium text-sm">Liked Songs</span>
        </Link>
      </div>

      <div className="border-t border-border pt-4 overflow-y-auto flex-1 custom-scrollbar">
        <p className="text-[10px] text-muted-foreground uppercase font-bold px-3 mb-4 tracking-widest font-accent">Your Playlists</p>
        <div className="space-y-1 px-1 text-sm text-muted-foreground">
          <p className="px-2 py-1 hover:text-primary hover:bg-white/5 rounded-md cursor-pointer transition">My Awesome Suno Mix</p>
          <p className="px-2 py-1 hover:text-primary hover:bg-white/5 rounded-md cursor-pointer transition">AI Vocals</p>
          <p className="px-2 py-1 hover:text-primary hover:bg-white/5 rounded-md cursor-pointer transition">Late Night Grooves</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
