import { useState, useEffect } from "react";
import { X, Download, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface ImageDisplayProps {
  currentImage: string | null;
  isLoading: boolean;
  onNavigate?: (direction: 'prev' | 'next') => void;
  canNavigatePrev?: boolean;
  canNavigateNext?: boolean;
}

const ImageDisplay = ({ 
  currentImage, 
  isLoading, 
  onNavigate,
  canNavigatePrev = false,
  canNavigateNext = false 
}: ImageDisplayProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleDownload = () => {
    if (currentImage) {
      const link = document.createElement("a");
      link.href = currentImage;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (!currentImage) return;

    try {
      // For X (Twitter), we'll use their Web Intent URL
      const tweetText = "Check out this AI-generated image! ✨";
      const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
      
      // Open in a new window
      window.open(shareUrl, '_blank', 'width=550,height=420');
      
      toast({
        title: "Share Link Opened",
        description: "A new window has been opened to share on X (Twitter)",
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to open share dialog",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsZoomed(false);
    } else if (onNavigate) {
      if (e.key === "ArrowLeft" && canNavigatePrev) {
        onNavigate('prev');
      } else if (e.key === "ArrowRight" && canNavigateNext) {
        onNavigate('next');
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canNavigatePrev, canNavigateNext]);

  if (!currentImage && !isLoading) {
    return (
      <div className="image-container flex items-center justify-center">
        <p className="text-gray-500">Your generated image will appear here</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="image-container flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <div className="image-container group">
      <img
        src={currentImage!}
        alt="Generated"
        className="w-full h-full object-cover transition-transform duration-200 cursor-pointer hover:scale-105"
        onClick={() => setIsZoomed(true)}
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <Button
          onClick={handleShare}
          className="bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          onClick={handleDownload}
          className="bg-primary hover:bg-primary/90"
          size="icon"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {isZoomed && (
        <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleShare();
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setIsZoomed(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {onNavigate && (
            <>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('prev');
                }}
                disabled={!canNavigatePrev}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary"
                size="icon"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate('next');
                }}
                disabled={!canNavigateNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-primary/80 hover:bg-primary"
                size="icon"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          <img
            src={currentImage!}
            alt="Generated"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;