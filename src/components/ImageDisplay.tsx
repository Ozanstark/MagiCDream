import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import InstagramScoreDisplay from "./InstagramScoreDisplay";

interface ImageDisplayProps {
  currentImage: string | null;
  isLoading: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  isNSFW: boolean;
  instagramScore?: number | null;
  instagramFeedback?: string | null;
}

const ImageDisplay = ({
  currentImage,
  isLoading,
  onNavigate,
  canNavigatePrev,
  canNavigateNext,
  isNSFW,
  instagramScore,
  instagramFeedback,
}: ImageDisplayProps) => {
  if (isLoading) {
    return (
      <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
        <div className="animate-pulse text-muted-foreground">Generating...</div>
      </div>
    );
  }

  if (!currentImage) {
    return (
      <div className="w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-muted">
        <div className="text-muted-foreground">Your image will appear here</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative group">
        <img
          src={currentImage}
          alt="Generated"
          className="w-full rounded-lg object-contain max-h-[512px]"
        />
        <div className="absolute inset-y-0 left-0 hidden group-hover:flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('prev')}
            disabled={!canNavigatePrev}
            className="ml-2 bg-background/50 hover:bg-background/80"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-0 hidden group-hover:flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('next')}
            disabled={!canNavigateNext}
            className="mr-2 bg-background/50 hover:bg-background/80"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {isNSFW && (
          <div className="absolute top-2 right-2">
            <Badge variant="destructive">NSFW</Badge>
          </div>
        )}
      </div>
      
      <InstagramScoreDisplay score={instagramScore} feedback={instagramFeedback} />
    </div>
  );
};

export default ImageDisplay;