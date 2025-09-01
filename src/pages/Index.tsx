
import { useQuery } from "@tanstack/react-query";
import { getTrending, getPopular } from "@/lib/tmdb";
import Hero from "@/components/home/Hero";
import MovieCarousel from "@/components/movies/MovieCarousel";

const Index = () => {
  const { data: trendingMovies, isLoading: isTrendingLoading } = useQuery({
    queryKey: ['trendingMovies'],
    queryFn: () => getTrending('movie'),
  });

  const { data: popularMovies, isLoading: isPopularMoviesLoading } = useQuery({
      queryKey: ['popularMovies'],
      queryFn: () => getPopular('movie'),
  });

  const { data: popularTv, isLoading: isPopularTvLoading } = useQuery({
      queryKey: ['popularTv'],
      queryFn: () => getPopular('tv'),
  });

  const heroMedia = trendingMovies?.results?.[0];

  return (
    <div className="flex flex-col">
      <Hero media={heroMedia} />
      <MovieCarousel title="Trending Movies" items={trendingMovies?.results} isLoading={isTrendingLoading} />
      <MovieCarousel title="Popular Movies" items={popularMovies?.results} isLoading={isPopularMoviesLoading} />
      <MovieCarousel title="Popular TV Shows" items={popularTv?.results} isLoading={isPopularTvLoading} />
    </div>
  );
};

export default Index;
