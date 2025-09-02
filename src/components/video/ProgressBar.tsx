import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Chapter {
  time: number;
  title: string;
  thumbnail?: string;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered?: TimeRanges;
  chapters?: Chapter[];
  onSeek: (time: number) => void;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentTime,
  duration,
  buffered,
  chapters = [],
  onSeek,
  className
}) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      setHoverTime(percent * duration);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      onSeek(percent * duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getBufferedRanges = () => {
    if (!buffered || !duration) return [];
    const ranges = [];
    for (let i = 0; i < buffered.length; i++) {
      ranges.push({
        start: (buffered.start(i) / duration) * 100,
        end: (buffered.end(i) / duration) * 100
      });
    }
    return ranges;
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Hover preview */}
      {isHovering && (
        <div 
          className="absolute bottom-full mb-2 transform -translate-x-1/2 bg-black/90 text-white px-2 py-1 rounded text-xs whitespace-nowrap"
          style={{ left: `${(hoverTime / duration) * 100}%` }}
        >
          {formatTime(hoverTime)}
        </div>
      )}

      <div
        ref={progressRef}
        className="relative h-1 bg-white/30 rounded-full cursor-pointer group-hover:h-2 transition-all"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleClick}
      >
        {/* Buffered ranges */}
        {getBufferedRanges().map((range, index) => (
          <div
            key={index}
            className="absolute top-0 h-full bg-white/50 rounded-full"
            style={{
              left: `${range.start}%`,
              width: `${range.end - range.start}%`
            }}
          />
        ))}

        {/* Chapter markers */}
        {chapters.map((chapter, index) => (
          <div
            key={index}
            className="absolute top-0 w-0.5 h-full bg-white/80 hover:bg-white transition-colors"
            style={{ left: `${(chapter.time / duration) * 100}%` }}
            title={chapter.title}
          />
        ))}

        {/* Progress */}
        <div
          className="absolute top-0 h-full bg-primary rounded-full transition-all"
          style={{ width: `${Math.max(0, Math.min(100, (currentTime / duration) * 100))}%` }}
        />

        {/* Hover indicator */}
        {isHovering && (
          <div
            className="absolute top-0 w-0.5 h-full bg-white rounded-full"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          />
        )}

        {/* Current time indicator */}
        <div
          className="absolute top-1/2 w-3 h-3 bg-primary rounded-full transform -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;