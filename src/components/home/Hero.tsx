
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Movie, TVShow } from "@/types";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface HeroProps {
  media: Movie | TVShow | undefined;
}

const Hero = ({ media }: HeroProps) => {
  const backdropUrl = media ? `${IMAGE_BASE_URL}original${media.backdrop_path}` : '/placeholder.svg';
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Please enter a search term.");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <section className="relative h-[60vh] min-h-[400px] w-full flex items-center justify-center text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backdropUrl})` }}>
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-background via-transparent to-black/20" />
      </div>
      <div className="relative z-10 text-center px-4 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Welcome.</h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Millions of movies, TV shows and people to discover. Explore now.
        </p>
        <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
          <Input 
            type="text" 
            placeholder="Search for a movie, tv show, person..." 
            className="h-12 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" size="lg" className="h-12">Search</Button>
        </form>
      </div>
    </section>
  );
};

export default Hero;
