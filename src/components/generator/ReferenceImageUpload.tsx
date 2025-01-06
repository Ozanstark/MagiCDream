import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ReferenceImageUploadProps {
  onImagesSelected: (images: File[]) => void;
  selectedImages: File[];
  onRemoveImage: (index: number) => void;
}

const ReferenceImageUpload = ({
  onImagesSelected,
  selectedImages,
  onRemoveImage,
}: ReferenceImageUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onImagesSelected(files);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        id="reference-images"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="w-full"
      />

      {selectedImages.length > 0 && (
        <ScrollArea className="h-32">
          <div className="flex gap-2 flex-wrap">
            {selectedImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Reference ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 w-6 h-6"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default ReferenceImageUpload;