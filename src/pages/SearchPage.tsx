
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchMulti } from "@/lib/tmdb";
import MediaGrid from "@/components/movies/MediaGrid";
import PersonCard from "@/components/movies/PersonCard";
import { Movie, Person, TVShow } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMulti(query),
    enabled: !!query,
  });

  const moviesAndTv = data?.results.filter(
    (item): item is Movie | TVShow => item.media_type === 'movie' || item.media_type === 'tv'
  );

  const people = data?.results.filter(
    (item): item is Person => item.media_type === 'person'
  );

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Search Results for "{query}"</h1>

      {isLoading && <Skeleton className="w-full h-96" />}
      {isError && <p>Error loading results. Please try again.</p>}

      {data && moviesAndTv && moviesAndTv.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Movies & TV Shows</h2>
          <MediaGrid items={moviesAndTv} isLoading={false} />
        </section>
      )}

      {data && people && people.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">People</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {people.map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </section>
      )}

      {data && data.results.length === 0 && (
        <p>No results found for "{query}".</p>
      )}
    </div>
  );
};

export default SearchPage;
