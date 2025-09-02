import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import VideoPlayer from './VideoPlayer';

interface VideoPlayerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  poster?: string;
  movieId?: string;
}

export const VideoPlayerDialog: React.FC<VideoPlayerDialogProps> = ({
  isOpen,
  onClose,
  videoUrl,
  title,
  poster,
  movieId
}) => {
  // Sample chapters data - in a real app, this would come from your database
  const sampleChapters = [
    { time: 0, title: "Opening Credits" },
    { time: 180, title: "Act I" },
    { time: 1800, title: "Plot Development" },
    { time: 3600, title: "Climax" },
    { time: 5400, title: "Resolution" },
    { time: 6300, title: "End Credits" }
  ];

  // Sample subtitles - in a real app, these would be dynamically loaded
  const sampleSubtitles = [
    { language: 'en', label: 'English', src: '/subtitles/en.vtt' },
    { language: 'es', label: 'Español', src: '/subtitles/es.vtt' },
    { language: 'fr', label: 'Français', src: '/subtitles/fr.vtt' }
  ];

  // Sample quality options - in a real app, these would be different video sources
  const sampleQualities = [
    { quality: 'auto', label: 'Auto', src: videoUrl },
    { quality: '1080p', label: '1080p HD', src: videoUrl },
    { quality: '720p', label: '720p HD', src: videoUrl },
    { quality: '480p', label: '480p', src: videoUrl }
  ];

  const handleTimeUpdate = (currentTime: number) => {
    // Save progress to localStorage or send to backend
    if (movieId) {
      localStorage.setItem(`video-progress-${movieId}`, currentTime.toString());
    }
  };

  const handleVideoEnded = () => {
    // Mark as watched, suggest next episode, etc.
    console.log('Video ended');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl p-0 border-0 bg-transparent shadow-none">
        <VideoPlayer
          src={videoUrl}
          title={title}
          poster={poster}
          chapters={sampleChapters}
          subtitles={sampleSubtitles}
          qualities={sampleQualities}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          className="w-full h-[80vh]"
        />
      </DialogContent>
    </Dialog>
  );
};

export default VideoPlayerDialog;