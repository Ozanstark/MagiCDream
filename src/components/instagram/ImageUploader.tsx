import { Input } from "../ui/button";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  selectedImages: string[];
  onImageUpload: (images: string[]) => void;
  onImageRemove: (index: number) => void;
}

export const ImageUploader = ({
  selectedImages,
  onImageUpload,
  onImageRemove,
}: ImageUploaderProps) => {
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    if (selectedImages.length + newImages.length > 2) {
      toast({
        title: "Hata",
        description: "En fazla 2 fotoğraf seçebilirsiniz.",
        variant: "destructive",
      });
      return;
    }
    onImageUpload([...selectedImages, ...newImages]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {selectedImages.map((image, index) => (
        <div key={index} className="relative">
          <img
            src={image}
            alt={`Selected ${index + 1}`}
            className="w-full aspect-square object-cover rounded-lg"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => onImageRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {selectedImages.length < 2 && (
        <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
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