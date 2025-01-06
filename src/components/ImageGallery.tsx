import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ExpandIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

interface ImageGalleryProps {
  images: string[];
  onImageSelect: (image: string, index: number) => void;
}

const ImageGallery = ({ images, onImageSelect }: ImageGalleryProps) => {
  const [showAll, setShowAll] = useState(false);

  if (images.length === 0) return null;

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
                <div className="relative aspect-square rounded-lg overflow-hidden group">
                  <img
                    src={image}
                    alt={`Generated ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                    onClick={() => onImageSelect(image, index)}
                  />
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
                        src={image}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
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
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => onImageSelect(image, index)}
              >
                <img
                  src={image}
                  alt={`Generated ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ImageGallery;