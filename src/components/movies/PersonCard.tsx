
import { Person } from "@/types";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import { User } from "lucide-react";

interface PersonCardProps {
  person: Person;
}

const PersonCard = ({ person }: PersonCardProps) => {
  const profileUrl = person.profile_path
    ? `${IMAGE_BASE_URL}w500${person.profile_path}`
    : "/placeholder.svg";

  return (
    <div className="group min-w-[150px] space-y-2 animate-fade-in text-center">
      <div className="aspect-square overflow-hidden rounded-full relative bg-card mx-auto w-32 h-32 md:w-40 md:h-40">
        {person.profile_path ? (
          <img
            src={profileUrl}
            alt={person.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium truncate group-hover:text-primary">{person.name}</h3>
        <p className="text-xs text-muted-foreground">{person.known_for_department}</p>
      </div>
    </div>
  );
};

export default PersonCard;
