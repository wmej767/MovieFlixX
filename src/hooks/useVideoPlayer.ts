import { useState, useRef, useCallback, useEffect } from 'react';

interface UseVideoPlayerProps {
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
}

export const useVideoPlayer = ({ onTimeUpdate, onEnded }: UseVideoPlayerProps = {}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Video event handlers
  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  }, [onTimeUpdate]);

  const handlePlay = useCallback(() => setIsPlaying(true), []);
  const handlePause = useCallback(() => setIsPlaying(false), []);
  
  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const handleWaiting = useCallback(() => setIsBuffering(true), []);
  const handleCanPlay = useCallback(() => setIsBuffering(false), []);

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

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(duration, time));
    }
  }, [duration]);

  const skip = useCallback((seconds: number) => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  const changeVolume = useCallback((newVolume: number) => {
    if (videoRef.current) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      videoRef.current.volume = clampedVolume;
      setVolume(clampedVolume);
      setIsMuted(clampedVolume === 0);
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

  const changePlaybackRate = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      videoRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return {
    videoRef,
    // State
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isFullscreen,
    isBuffering,
    playbackRate,
    // Event handlers
    handleLoadedMetadata,
    handleTimeUpdate,
    handlePlay,
    handlePause,
    handleEnded,
    handleWaiting,
    handleCanPlay,
    // Control functions
    togglePlay,
    seek,
    skip,
    changeVolume,
    toggleMute,
    changePlaybackRate,
    toggleFullscreen
  };
};

export default useVideoPlayer;