
import { Film } from "lucide-react";

export const Logo = () => {
    return (
        <div className="flex items-center justify-center gap-2">
            <Film className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">MovieFlix</span>
        </div>
    )
}
