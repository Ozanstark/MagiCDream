import { useState } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImageDisplayProps {
  currentImage: string | null;
  isLoading: boolean;
}

const ImageDisplay = ({ currentImage, isLoading }: ImageDisplayProps) => {
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
    }
  };

  useState(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

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
          <Button
            className="absolute top-4 right-4 bg-primary hover:bg-primary/90"
            onClick={() => setIsZoomed(false)}
          >
            <X className="h-4 w-4" />
          </Button>
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