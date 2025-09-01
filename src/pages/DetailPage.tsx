// src/pages/DetailPage.tsx
import videoMap from "@/data/video-map.json";
import { useParams, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMediaDetails, getMediaCredits, getRecommendations, IMAGE_BASE_URL } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Calendar, Clock, Terminal, PlayCircle } from "lucide-react";
import MovieCarousel from "@/components/movies/MovieCarousel";
import PersonCard from "@/components/movies/PersonCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const DetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const mediaType = location.pathname.startsWith('/movie') ? 'movie' : 'tv';
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const { data: details, isLoading: detailsLoading, isError: isDetailsError, error: detailsError } = useQuery({
    queryKey: ['details', mediaType, id],
    queryFn: () => getMediaDetails(mediaType, id!),
    enabled: !!mediaType && !!id,
  });

  const { data: credits, isLoading: creditsLoading } = useQuery({
    queryKey: ['credits', mediaType, id],
    queryFn: () => getMediaCredits(mediaType, id!),
    enabled: !!mediaType && !!id,
  });

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['recommendations', mediaType, id],
    queryFn: () => getRecommendations(mediaType, id!),
    enabled: !!mediaType && !!id,
  });

  if (detailsLoading) return (
    <div className="container py-8">
      <Skeleton className="h-[50vh] w-full mb-8" />
      <div className="flex gap-8">
        <div className="w-1/3"><Skeleton className="w-full aspect-[2/3]" /></div>
        <div className="w-2/3 space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-24 w-full" /><Skeleton className="h-6 w-1/2" /></div>
      </div>
    </div>
  );

  if (isDetailsError) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error al cargar los detalles</AlertTitle>
          <AlertDescription>
            <p>Hubo un problema al obtener los detalles del medio. Esto puede deberse a una clave de API de TMDB no válida o faltante.</p>
            <p className="mt-2">Por favor, revisa el archivo `src/lib/tmdb.ts` y asegúrate de haber proporcionado una clave de API válida.</p>
            {detailsError && (
              <details className="mt-4 text-xs">
                <summary>Detalles del error</summary>
                <pre className="mt-2 p-2 bg-muted rounded-md text-left text-sm overflow-auto">
                  {detailsError instanceof Error ? detailsError.message : JSON.stringify(detailsError, null, 2)}
                </pre>
              </details>
            )}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!details) return <div>Media not found.</div>;

  const item = details as Movie & TVShow;
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const runtime = item.runtime || (item.episode_run_time && item.episode_run_time[0]);
  const videoFilename = videoMap[item.id.toString()];
  const videoUrl = videoFilename ? `http://localhost:3001/movies/${videoFilename}` : null;

  return (
    <div className="animate-fade-in">
      {/* Backdrop */}
      <div className="relative h-[40vh] md:h-[60vh] w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent z-10" />
        {item.backdrop_path && (
          <img
            src={`${IMAGE_BASE_URL}original${item.backdrop_path}`}
            alt={title}
            className="w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="container -mt-24 md:-mt-48 relative z-20 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
            <div
              onClick={() => setIsPlayerOpen(true)}
              className="relative group cursor-pointer"
            >
              <img
                src={item.poster_path ? `${IMAGE_BASE_URL}w500${item.poster_path}` : '/placeholder.svg'}
                alt={title}
                className="rounded-lg shadow-2xl w-full aspect-[2/3]"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <PlayCircle className="h-20 w-20 text-white" />
              </div>
            </div>
          </div>
          <div className="md:w-2/3 lg:w-3/4 text-foreground">
            <h1 className="text-3xl md:text-5xl font-bold mb-2">{title}</h1>
            <div className="flex items-center gap-4 text-muted-foreground text-sm mb-4">
              <div className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-yellow-400" /> <span>{item.vote_average.toFixed(1)}</span></div>
              {releaseDate && <div className="flex items-center gap-1"><Calendar className="h-4 w-4" /> <span>{new Date(releaseDate).getFullYear()}</span></div>}
              {runtime && <div className="flex items-center gap-1"><Clock className="h-4 w-4" /> <span>{runtime} min</span></div>}
            </div>
            {item.genres && item.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {item.genres.map(genre => (
                  <div key={genre.id} className="text-xs border border-border px-2 py-1 rounded-full">{genre.name}</div>
                ))}
              </div>
            )}
            <h2 className="text-xl font-semibold mt-6 mb-2">Overview</h2>
            <p className="text-muted-foreground">{item.overview}</p>
          </div>
        </div>

        {/* Cast */}
        {credits && credits.cast.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Top Billed Cast</h2>
            <div className="flex overflow-x-auto no-scrollbar space-x-4">
              {creditsLoading ? (
                Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="min-w-[150px] h-[280px]" />)
              ) : (
                credits.cast.slice(0, 20).map(person => <PersonCard key={person.credit_id} person={{ ...person, media_type: 'person' }} />)
              )}
            </div>
          </section>
        )}

        {/* Recommendations */}
        {recommendations && recommendations.results.length > 0 && (
          <MovieCarousel title="Recommendations" items={recommendations.results} isLoading={recommendationsLoading} />
        )}
      </div>

      <Dialog open={isPlayerOpen} onOpenChange={setIsPlayerOpen}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          {videoUrl ? (
            <video
              className="w-full h-auto max-h-[90vh] rounded-lg"
              controls
              autoPlay
              src={videoUrl}
              onError={() => {
                alert(`⚠️ No se pudo cargar el video: ${videoFilename}`);
                setIsPlayerOpen(false);
              }}
            />
          ) : (
            <div className="bg-background text-red-500 text-center py-12 rounded-lg">
              ❌ No hay video disponible para esta película.<br />
              Agrega el archivo a <code>/movies/</code> y actualiza <code>video-map.json</code>.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DetailPage;
