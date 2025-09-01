
import { Link } from "react-router-dom";
import { Movie, TVShow } from "@/types";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import { Star } from "lucide-react";

interface MovieCardProps {
  item: Movie | TVShow;
}

const MovieCard = ({ item }: MovieCardProps) => {
  const title = 'title' in item ? item.title : item.name;
  const rating = item.vote_average.toFixed(1);
  const placeholderUrl = `https://picsum.photos/seed/${item.id}/500/750`;
  const posterUrl = item.poster_path ? `${IMAGE_BASE_URL}w500${item.poster_path}` : placeholderUrl;
  const linkTo = `/${'title' in item ? 'movie' : 'tv'}/${item.id}`;

  const releaseDate = 'release_date' in item ? item.release_date : item.first_air_date;
  const releaseYear = releaseDate ? new Date(releaseDate).getFullYear() : '';

  return (
    <Link to={linkTo} className="group min-w-[150px] md:min-w-[200px] space-y-2 animate-fade-in">
      <div className="aspect-[2/3] overflow-hidden rounded-lg relative">
        <img src={posterUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute top-2 right-2 bg-background/80 text-foreground text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
          <span>{rating}</span>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium truncate group-hover:text-primary">{title}</h3>
        {releaseYear && <p className="text-xs text-muted-foreground">{releaseYear}</p>}
      </div>
    </Link>
  );
};

export default MovieCard;
