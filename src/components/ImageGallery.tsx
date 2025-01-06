import { useState } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ExpandIcon, Trash2 } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScrollArea } from "./ui/scroll-area";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ImageGalleryProps {
  images: Array<{
    url: string;
    isNSFW: boolean;
  }>;
  onImageSelect: (image: string, index: number) => void;
  onImageDelete?: (index: number) => void;
}

const ImageGallery = ({ images, onImageSelect, onImageDelete }: ImageGalleryProps) => {
  const [showAll, setShowAll] = useState(false);
  const { toast } = useToast();

  if (images.length === 0) return null;

  const handleDelete = async (imageUrl: string, index: number) => {
    try {
      // Extract the file name from the URL
      const fileName = imageUrl.split('/').pop();
      if (!fileName) throw new Error('Invalid image URL');

      // Delete from Supabase Storage
      const { error: storageError } = await supabase.storage
        .from('generated-images')
        .remove([fileName]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('generated_images')
        .delete()
        .eq('url', imageUrl);

      if (dbError) throw dbError;

      // Update UI
      if (onImageDelete) {
        onImageDelete(index);
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      });
    }
  };

  const renderImage = (image: { url: string; isNSFW: boolean }, index: number) => {
    return (
      <div className="relative aspect-square rounded-lg overflow-hidden group">
        <div className="relative w-full h-full">
          <img
            src={image.url}
            alt={`Generated ${index + 1}`}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onClick={() => onImageSelect(image.url, index)}
          />
        </div>
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="bg-black/50 hover:bg-black/70"
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
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/50 hover:bg-red-500/70"
            onClick={() => handleDelete(image.url, index)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
    </div>
  );
};

export default ImageGallery;