import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ImageUploaderProps {
  selectedImages: string[];
  onImageUpload: (images: string[]) => void;
  onImageRemove: (index: number) => void;
  maxImages?: number;
  minImages?: number;
}

export const ImageUploader = ({
  selectedImages,
  onImageUpload,
  onImageRemove,
  maxImages = 10,
  minImages = 2
}: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    if (selectedImages.length + newImages.length > maxImages) {
      toast({
        title: "Hata",
        description: `En fazla ${maxImages} fotoğraf seçebilirsiniz.`,
        variant: "destructive",
      });
      return;
    }
    onImageUpload([...selectedImages, ...newImages]);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {selectedImages.map((image, index) => (
        <div key={index} className="relative group">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">
                <img
                  src={image}
                  alt={`Selected ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg hover:opacity-90 transition-opacity"
                />
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <img
                src={image}
                alt={`Selected ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onImageRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {selectedImages.length < maxImages && (
        <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            multiple
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer text-center p-4 text-muted-foreground hover:text-foreground transition-colors"
          >
            Fotoğraf Seç
          </label>
        </div>
      )}
    </div>
  );
};