import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, SkipBack, SkipForward, PictureInPicture2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Chapter {
  time: number;
  title: string;
  thumbnail?: string;
}

interface Subtitle {
  language: string;
  label: string;
  src: string;
}

interface VideoQuality {
  quality: string;
  src: string;
  label: string;
}

interface VideoPlayerProps {
  src: string;
  title: string;
  poster?: string;
  chapters?: Chapter[];
  subtitles?: Subtitle[];
  qualities?: VideoQuality[];
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  poster,
  chapters = [],
  subtitles = [],
  qualities = [],
  onTimeUpdate,
  onEnded,
  className
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [currentQuality, setCurrentQuality] = useState(qualities[0]?.quality || 'auto');
  const [currentSubtitle, setCurrentSubtitle] = useState<string>('off');
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isPiPSupported, setIsPiPSupported] = useState(false);
  const [isPiPActive, setIsPiPActive] = useState(false);

  // Check Picture-in-Picture support
  useEffect(() => {
    setIsPiPSupported('pictureInPictureEnabled' in document);
  }, []);

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setShowControls(true);
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 3000);
      }
    };

    const handleMouseMove = () => resetTimeout();
    const handleMouseLeave = () => {
      if (isPlaying) {
        timeout = setTimeout(() => setShowControls(false), 1000);
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      containerRef.current.addEventListener('mouseleave', handleMouseLeave);
    }

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isPlaying]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  const handleEnded = () => {
    setIsPlaying(false);
    onEnded?.();
  };

  const handleWaiting = () => setIsBuffering(true);
  const handleCanPlay = () => setIsBuffering(false);

  // Control functions
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  }, [isPlaying]);

  const handleSeek = useCallback((value: number[]) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  }, []);

  const handleVolumeChange = useCallback((value: number[]) => {
    if (videoRef.current) {
      const newVolume = value[0];
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, currentTime + seconds));
    }
  }, [currentTime, duration]);

  const togglePictureInPicture = useCallback(async () => {
    if (videoRef.current) {
      try {
        if (isPiPActive) {
          await document.exitPictureInPicture();
        } else {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (error) {
        console.error('Picture-in-Picture error:', error);
      }
    }
  }, [isPiPActive]);

  const handleQualityChange = useCallback((quality: string) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const wasPlaying = !videoRef.current.paused;
      
      const selectedQuality = qualities.find(q => q.quality === quality);
      if (selectedQuality) {
        videoRef.current.src = selectedQuality.src;
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) {
          videoRef.current.play();
        }
        setCurrentQuality(quality);
      }
    }
  }, [qualities]);

  const handleSubtitleChange = useCallback((language: string) => {
    if (videoRef.current) {
      const tracks = videoRef.current.textTracks;
      for (let i = 0; i < tracks.length; i++) {
        tracks[i].mode = tracks[i].language === language ? 'showing' : 'hidden';
      }
      setCurrentSubtitle(language);
    }
  }, []);

  const handlePlaybackRateChange = useCallback((rate: string) => {
    if (videoRef.current) {
      const newRate = parseFloat(rate);
      videoRef.current.playbackRate = newRate;
      setPlaybackRate(newRate);
    }
  }, []);

  const jumpToChapter = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange([Math.min(1, volume + 0.1)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange([Math.max(0, volume - 0.1)]);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, skip, handleVolumeChange, volume, toggleMute, toggleFullscreen]);

  // Picture-in-Picture events
  useEffect(() => {
    const handleEnterPiP = () => setIsPiPActive(true);
    const handleLeavePiP = () => setIsPiPActive(false);

    if (videoRef.current) {
      videoRef.current.addEventListener('enterpictureinpicture', handleEnterPiP);
      videoRef.current.addEventListener('leavepictureinpicture', handleLeavePiP);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('enterpictureinpicture', handleEnterPiP);
        videoRef.current.removeEventListener('leavepictureinpicture', handleLeavePiP);
      }
    };
  }, []);

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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative bg-black rounded-lg overflow-hidden group",
        "focus-within:outline-none focus-within:ring-2 focus-within:ring-primary",
        className
      )}
      tabIndex={0}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={handlePlay}
        onPause={handlePause}
        onEnded={handleEnded}
        onWaiting={handleWaiting}
        onCanPlay={handleCanPlay}
        onClick={togglePlay}
      >
        {/* Subtitle tracks */}
        {subtitles.map((subtitle) => (
          <track
            key={subtitle.language}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.language}
            label={subtitle.label}
          />
        ))}
      </video>

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Chapter Indicator */}
      {currentChapter && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-md text-sm">
          {currentChapter.title}
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start">
          <h3 className="text-white text-lg font-semibold truncate">{title}</h3>
          <div className="flex gap-2">
            {isPiPSupported && (
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePictureInPicture}
                className="text-white hover:bg-white/20"
              >
                <PictureInPicture2 className="h-5 w-5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20"
            >
              {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Center Play Button */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="h-20 w-20 rounded-full bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
            >
              <Play className="h-10 w-10 ml-1" />
            </Button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          {/* Progress Bar with Chapters */}
          <div className="relative">
            <div 
              ref={progressRef}
              className="relative h-2 bg-white/30 rounded-full cursor-pointer group/progress"
              onClick={(e) => {
                if (progressRef.current && videoRef.current) {
                  const rect = progressRef.current.getBoundingClientRect();
                  const percent = (e.clientX - rect.left) / rect.width;
                  const newTime = percent * duration;
                  videoRef.current.currentTime = newTime;
                }
              }}
            >
              {/* Chapter markers */}
              {chapters.map((chapter) => (
                <div
                  key={chapter.time}
                  className="absolute top-0 w-1 h-full bg-white/60 cursor-pointer hover:bg-white transition-colors"
                  style={{ left: `${(chapter.time / duration) * 100}%` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    jumpToChapter(chapter.time);
                  }}
                  title={chapter.title}
                />
              ))}
              
              {/* Progress */}
              <div 
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
              
              {/* Hover preview */}
              <div className="absolute top-0 w-full h-full opacity-0 group-hover/progress:opacity-100 transition-opacity">
                <div 
                  className="absolute top-0 w-1 h-full bg-white rounded-full transform -translate-x-1/2"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Control Buttons and Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              {/* Skip buttons */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(-10)}
                className="text-white hover:bg-white/20"
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => skip(10)}
                className="text-white hover:bg-white/20"
              >
                <SkipForward className="h-4 w-4" />
              </Button>

              {/* Volume */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    onValueChange={handleVolumeChange}
                    max={1}
                    step={0.1}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              {/* Time */}
              <span className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Settings */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3 space-y-4">
                  {/* Quality Selection */}
                  {qualities.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Quality</label>
                      <Select value={currentQuality} onValueChange={handleQualityChange}>
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
                  {subtitles.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subtitles</label>
                      <Select value={currentSubtitle} onValueChange={handleSubtitleChange}>
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
                  )}

                  {/* Playback Speed */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Playback Speed</label>
                    <Select value={playbackRate.toString()} onValueChange={handlePlaybackRateChange}>
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
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Sidebar */}
      {chapters.length > 0 && (
        <div className={cn(
          "absolute right-4 top-1/2 transform -translate-y-1/2",
          "bg-black/80 rounded-lg p-3 max-w-xs",
          "transition-opacity duration-300",
          showControls ? "opacity-100" : "opacity-0"
        )}>
          <h4 className="text-white text-sm font-semibold mb-2">Chapters</h4>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => jumpToChapter(chapter.time)}
                className={cn(
                  "w-full text-left p-2 rounded text-xs text-white/80 hover:bg-white/20 transition-colors",
                  currentChapter === chapter && "bg-primary/50 text-white"
                )}
              >
                <div className="font-medium">{chapter.title}</div>
                <div className="text-white/60">{formatTime(chapter.time)}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Help */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
              ?
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <h4 className="font-semibold mb-2">Keyboard Shortcuts</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Play/Pause</span>
                <Badge variant="outline">Space</Badge>
              </div>
              <div className="flex justify-between">
                <span>Skip backward</span>
                <Badge variant="outline">←</Badge>
              </div>
              <div className="flex justify-between">
                <span>Skip forward</span>
                <Badge variant="outline">→</Badge>
              </div>
              <div className="flex justify-between">
                <span>Volume up/down</span>
                <Badge variant="outline">↑/↓</Badge>
              </div>
              <div className="flex justify-between">
                <span>Mute</span>
                <Badge variant="outline">M</Badge>
              </div>
              <div className="flex justify-between">
                <span>Fullscreen</span>
                <Badge variant="outline">F</Badge>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default VideoPlayer;