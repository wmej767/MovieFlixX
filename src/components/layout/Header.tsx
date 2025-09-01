import { Link } from "react-router-dom";
import { Film, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import { SearchDialog } from "./SearchDialog";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/movies" className="text-muted-foreground transition-colors hover:text-foreground/80 flex items-center gap-1">
              <Film className="h-4 w-4" /> Movies
            </Link>
            <Link to="/tv" className="text-muted-foreground transition-colors hover:text-foreground/80 flex items-center gap-1">
              <Tv className="h-4 w-4" /> TV Shows
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <SearchDialog />
          <Button>Sign In</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
