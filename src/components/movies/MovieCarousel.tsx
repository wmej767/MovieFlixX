
import { Movie, TVShow } from "@/types";
import MovieCard from "./MovieCard";
import { Skeleton } from "@/components/ui/skeleton";

interface MovieCarouselProps {
  title: string;
  items: (Movie | TVShow)[] | undefined;
  isLoading: boolean;
}

const MovieCarousel = ({ title, items, isLoading }: MovieCarouselProps) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4 container">{title}</h2>
      <div className="relative">
        <div className="flex overflow-x-auto no-scrollbar space-x-4 px-4 container">
          {isLoading && Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="min-w-[150px] h-[225px] md:min-w-[200px] md:h-[300px] rounded-lg" />
          ))}
          {items?.map((item) => (
            <MovieCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MovieCarousel;
