import React from 'react';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  return (
    <header className="h-16 bg-background/40 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 border-b border-white/5">
      <div className="flex items-center space-x-4">
        <button className="bg-background/80 rounded-full p-1 text-muted-foreground hover:text-foreground transition border border-border">
          <ChevronLeft size={24} />
        </button>
        <button className="bg-background/80 rounded-full p-1 text-muted-foreground hover:text-foreground transition border border-border">
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" className="text-muted-foreground hover:text-primary font-bold hidden md:block">
          Upgrade
        </Button>
        <button className="bg-muted rounded-full p-1 flex items-center space-x-2 pr-3 hover:bg-muted/80 transition border border-border group">
          <div className="bg-background rounded-full p-1 group-hover:text-primary transition-colors">
            <User size={16} />
          </div>
          <span className="text-sm font-bold text-foreground">Guest User</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
