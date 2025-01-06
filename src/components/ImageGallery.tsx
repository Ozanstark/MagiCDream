import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ExpandIcon, AlertTriangle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from "./ui/dialog";

interface ImageGalleryProps {
  images: Array<{
    url: string;
    isNSFW: boolean;
  }>;
  onImageSelect: (image: string, index: number) => void;
}

const ImageGallery = ({ images, onImageSelect }: ImageGalleryProps) => {
  const [showAll, setShowAll] = useState(false);
  const [unblurredImages, setUnblurredImages] = useState<Set<string>>(new Set());
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [selectedImageForVerification, setSelectedImageForVerification] = useState<{url: string, index: number} | null>(null);

  if (images.length === 0) return null;

  const handleImageClick = (image: string, index: number, isNSFW: boolean) => {
    if (isNSFW && !unblurredImages.has(image)) {
      setSelectedImageForVerification({ url: image, index });
      setShowAgeVerification(true);
    } else {
      onImageSelect(image, index);
    }
  };

  const handleAgeVerification = () => {
    if (selectedImageForVerification) {
      const newUnblurred = new Set(unblurredImages);
      newUnblurred.add(selectedImageForVerification.url);
      setUnblurredImages(newUnblurred);
      onImageSelect(selectedImageForVerification.url, selectedImageForVerification.index);
    }
    setShowAgeVerification(false);
  };

  const renderImage = (image: { url: string; isNSFW: boolean }, index: number) => {
    const isBlurred = image.isNSFW && !unblurredImages.has(image.url);

    return (
      <div className="relative aspect-square rounded-lg overflow-hidden group">
        <div className={`relative w-full h-full ${isBlurred ? 'cursor-pointer' : ''}`}>
          <img
            src={image.url}
            alt={`Generated ${index + 1}`}
            className={`w-full h-full object-cover transition-transform duration-200 group-hover:scale-105 ${
              isBlurred ? 'blur-xl' : ''
            }`}
            onClick={() => handleImageClick(image.url, index, image.isNSFW)}
          />
          {isBlurred && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
              <AlertTriangle className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">18+ Content</span>
              <span className="text-xs mt-1">Click to view</span>
            </div>
          )}
        </div>
        {!isBlurred && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 hover:bg-black/70"
              >
                <ExpandIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={image.url}
                alt={`Generated ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4 mt-8 border-t pt-8">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Generated Images</h3>
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="text-primary hover:text-primary/80"
        >
          {showAll ? "Show Less" : "See More"}
        </Button>
      </div>

      {!showAll ? (
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-1/1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                {renderImage(image, index)}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      ) : (
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index}>
                {renderImage(image, index)}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}

      <Dialog open={showAgeVerification} onOpenChange={setShowAgeVerification}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Age Verification Required</DialogTitle>
            <DialogDescription>
              This content is only suitable for adults aged 18 and above. By continuing, you confirm that you are at least 18 years old.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowAgeVerification(false)}>
              Cancel
            </Button>
            <Button onClick={handleAgeVerification}>
              I am 18 or older
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;