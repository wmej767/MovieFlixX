import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Maximize, Minimize, Settings, PictureInPicture2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import VolumeControl from './VolumeControl';
import { cn } from '@/lib/utils';

interface VideoControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isFullscreen: boolean;
  isPiPSupported: boolean;
  currentQuality: string;
  currentSubtitle: string;
  playbackRate: number;
  qualities: Array<{ quality: string; label: string; src: string }>;
  subtitles: Array<{ language: string; label: string; src: string }>;
  onTogglePlay: () => void;
  onSkip: (seconds: number) => void;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onToggleFullscreen: () => void;
  onTogglePiP: () => void;
  onQualityChange: (quality: string) => void;
  onSubtitleChange: (language: string) => void;
  onPlaybackRateChange: (rate: string) => void;
  className?: string;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isFullscreen,
  isPiPSupported,
  currentQuality,
  currentSubtitle,
  playbackRate,
  qualities,
  subtitles,
  onTogglePlay,
  onSkip,
  onVolumeChange,
  onToggleMute,
  onToggleFullscreen,
  onTogglePiP,
  onQualityChange,
  onSubtitleChange,
  onPlaybackRateChange,
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

  return (
    <div className={cn("flex items-center justify-between text-white", className)}>
      {/* Left Controls */}
      <div className="flex items-center gap-3">
        {/* Play/Pause */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePlay}
          className="text-white hover:bg-white/20 transition-colors"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
        </Button>

        {/* Skip buttons */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(-10)}
          className="text-white hover:bg-white/20 transition-colors"
        >
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onSkip(10)}
          className="text-white hover:bg-white/20 transition-colors"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        {/* Volume Control */}
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />

        {/* Time Display */}
        <span className="text-white text-sm font-mono min-w-[100px]">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Settings */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3 space-y-4">
            {/* Quality Selection */}
            {qualities.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Quality</label>
                <Select value={currentQuality} onValueChange={onQualityChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualities.map((quality) => (
                      <SelectItem key={quality.quality} value={quality.quality}>
                        {quality.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Subtitle Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitles</label>
              <Select value={currentSubtitle} onValueChange={onSubtitleChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  {subtitles.map((subtitle) => (
                    <SelectItem key={subtitle.language} value={subtitle.language}>
                      {subtitle.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Playback Speed */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Playback Speed</label>
              <Select value={playbackRate.toString()} onValueChange={onPlaybackRateChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="0.75">0.75x</SelectItem>
                  <SelectItem value="1">Normal</SelectItem>
                  <SelectItem value="1.25">1.25x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        {/* Picture-in-Picture */}
        {isPiPSupported && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onTogglePiP}
            className="text-white hover:bg-white/20 transition-colors"
          >
            <PictureInPicture2 className="h-5 w-5" />
          </Button>
        )}

        {/* Fullscreen */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFullscreen}
          className="text-white hover:bg-white/20 transition-colors"
        >
          {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
        </Button>
      </div>
    </div>
  );
};

export default VideoControls;