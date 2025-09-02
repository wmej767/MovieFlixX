import React, { useState } from 'react';
import { Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}

export const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  className
}) => {
  const [isHovering, setIsHovering] = useState(false);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return VolumeX;
    if (volume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div 
      className={cn("flex items-center gap-2", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleMute}
        className="text-white hover:bg-white/20 transition-colors"
      >
        <VolumeIcon className="h-5 w-5" />
      </Button>
      
      <div className={cn(
        "transition-all duration-200 overflow-hidden",
        isHovering ? "w-20 opacity-100" : "w-0 opacity-0"
      )}>
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={(value) => onVolumeChange(value[0])}
          max={1}
          step={0.05}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};

export default VolumeControl;