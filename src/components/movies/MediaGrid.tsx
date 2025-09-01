
import { Movie, TVShow } from "@/types";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

interface MediaGridProps {
  items: (Movie | TVShow)[] | undefined;
  isLoading: boolean;
}

const MediaGrid = ({ items, isLoading }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {isLoading && Array.from({ length: 20 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-[2/3] rounded-lg" />
      ))}
      {items?.map((item) => (
        <MovieCard key={item.id} item={item} />
      ))}
    </div>
  );
};

export default MediaGrid;
