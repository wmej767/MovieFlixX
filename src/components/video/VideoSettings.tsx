import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface VideoQuality {
  quality: string;
  label: string;
  src: string;
}

interface Subtitle {
  language: string;
  label: string;
  src: string;
}

interface VideoSettingsProps {
  currentQuality: string;
  currentSubtitle: string;
  playbackRate: number;
  qualities: VideoQuality[];
  subtitles: Subtitle[];
  onQualityChange: (quality: string) => void;
  onSubtitleChange: (language: string) => void;
  onPlaybackRateChange: (rate: string) => void;
  className?: string;
}

export const VideoSettings: React.FC<VideoSettingsProps> = ({
  currentQuality,
  currentSubtitle,
  playbackRate,
  qualities,
  subtitles,
  onQualityChange,
  onSubtitleChange,
  onPlaybackRateChange,
  className
}) => {
  return (
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
      <PopoverContent className="w-64 p-4 space-y-4">
        <h4 className="font-semibold text-center">Video Settings</h4>
        
        {/* Quality Selection */}
        {qualities.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Video Quality</label>
            <Select value={currentQuality} onValueChange={onQualityChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {qualities.map((quality) => (
                  <SelectItem key={quality.quality} value={quality.quality}>
                    <div className="flex items-center justify-between w-full">
                      <span>{quality.label}</span>
                      {quality.quality === currentQuality && (
                        <span className="text-primary text-xs">●</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Separator />

        {/* Subtitle Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Subtitles</label>
          <Select value={currentSubtitle} onValueChange={onSubtitleChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="off">
                <div className="flex items-center justify-between w-full">
                  <span>Off</span>
                  {currentSubtitle === 'off' && (
                    <span className="text-primary text-xs">●</span>
                  )}
                </div>
              </SelectItem>
              {subtitles.map((subtitle) => (
                <SelectItem key={subtitle.language} value={subtitle.language}>
                  <div className="flex items-center justify-between w-full">
                    <span>{subtitle.label}</span>
                    {subtitle.language === currentSubtitle && (
                      <span className="text-primary text-xs">●</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Playback Speed */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Playback Speed</label>
          <Select value={playbackRate.toString()} onValueChange={onPlaybackRateChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.25">0.25x</SelectItem>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="0.75">0.75x</SelectItem>
              <SelectItem value="1">
                <div className="flex items-center justify-between w-full">
                  <span>Normal</span>
                  {playbackRate === 1 && (
                    <span className="text-primary text-xs">●</span>
                  )}
                </div>
              </SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="1.75">1.75x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default VideoSettings;