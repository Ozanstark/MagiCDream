import { useState, useEffect } from "react";
import { X, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <>
      <div className="image-container group">
        <img
          src={currentImage!}
          alt="Generated"
          className="w-full h-full object-cover transition-transform duration-200 cursor-pointer hover:scale-105"
          onClick={() => setIsZoomed(true)}
        />
        <Button
          onClick={handleDownload}
          className="absolute top-4 right-4 bg-primary hover:bg-primary/90"
        >
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {isZoomed && (
        <div className="zoom-overlay" onClick={() => setIsZoomed(false)}>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              onClick={handleDownload}
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
    </>
  );
};

export default ImageDisplay;