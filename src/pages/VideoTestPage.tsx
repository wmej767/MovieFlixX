import videoMap from "@/data/video-map.json";
import { useParams } from "react-router-dom";

const VideoTestPage = () => {
  const { id } = useParams<{ id: string }>();
  const videoFile = id ? videoMap[id] : null;
  const videoUrl = videoFile ? `http://localhost:3001/movies/${videoFile}` : null;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">🎬 Test Video Player</h1>
      {videoUrl ? (
        <video
          width="100%"
          height="auto"
          controls
          autoPlay
          className="rounded-lg shadow-lg"
          src={videoUrl}
          onError={() => alert(`⚠️ No se pudo cargar el video: ${videoFile}`)}
        />
      ) : (
        <p className="text-red-600">
          ❌ Video no encontrado. Revisa el ID en la URL o actualiza `video-map.json`.
        </p>
      )}
    </div>
  );
};

export default VideoTestPage;
