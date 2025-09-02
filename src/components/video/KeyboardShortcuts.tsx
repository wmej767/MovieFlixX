import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HelpCircle } from 'lucide-react';

interface KeyboardShortcutsProps {
  className?: string;
}

export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({ className }) => {
  const shortcuts = [
    { action: 'Play/Pause', key: 'Space' },
    { action: 'Skip backward 10s', key: '←' },
    { action: 'Skip forward 10s', key: '→' },
    { action: 'Volume up', key: '↑' },
    { action: 'Volume down', key: '↓' },
    { action: 'Mute/Unmute', key: 'M' },
    { action: 'Fullscreen', key: 'F' },
    { action: 'Picture-in-Picture', key: 'P' },
    { action: 'Speed up', key: '>' },
    { action: 'Speed down', key: '<' },
    { action: 'Jump to beginning', key: 'Home' },
    { action: 'Jump to end', key: 'End' }
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white/60 hover:text-white hover:bg-white/20 transition-colors"
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4">
        <div className="space-y-3">
          <h4 className="font-semibold text-center">Keyboard Shortcuts</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm">{shortcut.action}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {shortcut.key}
                </Badge>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Click on the video player to focus and use shortcuts
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default KeyboardShortcuts;