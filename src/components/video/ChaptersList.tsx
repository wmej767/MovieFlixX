import React from 'react';
import { cn } from '@/lib/utils';

interface Chapter {
  time: number;
  title: string;
  thumbnail?: string;
}

interface ChaptersListProps {
  chapters: Chapter[];
  currentTime: number;
  onChapterClick: (time: number) => void;
  className?: string;
}

export const ChaptersList: React.FC<ChaptersListProps> = ({
  chapters,
  currentTime,
  onChapterClick,
  className
}) => {
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCurrentChapter = () => {
    return chapters.find((chapter, index) => {
      const nextChapter = chapters[index + 1];
      return currentTime >= chapter.time && (!nextChapter || currentTime < nextChapter.time);
    });
  };

  const currentChapter = getCurrentChapter();

  if (chapters.length === 0) return null;

  return (
    <div className={cn("bg-black/80 rounded-lg p-3 max-w-xs", className)}>
      <h4 className="text-white text-sm font-semibold mb-2">Chapters</h4>
      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
        {chapters.map((chapter, index) => (
          <button
            key={index}
            onClick={() => onChapterClick(chapter.time)}
            className={cn(
              "w-full text-left p-2 rounded text-xs transition-all duration-200",
              "hover:bg-white/20 hover:scale-105",
              currentChapter === chapter 
                ? "bg-primary/50 text-white shadow-lg" 
                : "text-white/80"
            )}
          >
            <div className="flex items-center gap-2">
              {chapter.thumbnail && (
                <img 
                  src={chapter.thumbnail} 
                  alt={chapter.title}
                  className="w-8 h-6 object-cover rounded"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{chapter.title}</div>
                <div className="text-white/60">{formatTime(chapter.time)}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ChaptersList;