
import { useQuery } from "@tanstack/react-query";
import { getPopular, getTopRated } from "@/lib/tmdb";
import MediaGrid from "@/components/movies/MediaGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TvShowsPage = () => {
  const { data: popularTv, isLoading: isPopularLoading } = useQuery({
    queryKey: ['popularTvPage'],
    queryFn: () => getPopular('tv'),
  });

  const { data: topRatedTv, isLoading: isTopRatedLoading } = useQuery({
    queryKey: ['topRatedTvPage'],
    queryFn: () => getTopRated('tv'),
  });

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">TV Shows</h1>
      <Tabs defaultValue="popular" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
        </TabsList>
        <TabsContent value="popular" className="mt-8">
          <MediaGrid items={popularTv?.results} isLoading={isPopularLoading} />
        </TabsContent>
        <TabsContent value="top-rated" className="mt-8">
          <MediaGrid items={topRatedTv?.results} isLoading={isTopRatedLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TvShowsPage;
