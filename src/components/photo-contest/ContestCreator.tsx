import { useState } from "react";
import { ImageUploader } from "../instagram/ImageUploader";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

interface ContestCreatorProps {
  onCreateContest: (images: string[]) => void;
  isCreating: boolean;
  setIsCreating: (value: boolean) => void;
}

export const ContestCreator = ({ onCreateContest, isCreating, setIsCreating }: ContestCreatorProps) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageUpload = (images: string[]) => {
    setSelectedImages(images);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  return !isCreating ? (
    <Button onClick={() => setIsCreating(true)} className="w-full bg-primary hover:bg-primary/90">
      <Plus className="w-4 h-4 mr-2" />
      Yeni Yarışma Oluştur
    </Button>
  ) : (
    <div className="space-y-4">
      <ImageUploader
        selectedImages={selectedImages}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        maxImages={2}
        minImages={2}
      />

      <div className="flex gap-2">
        <Button
          onClick={() => {
            onCreateContest(selectedImages);
            setSelectedImages([]);
          }}
          disabled={selectedImages.length < 2}
          className="flex-1"
        >
          Yarışma Oluştur
        </Button>
        <Button
          onClick={() => {
            setIsCreating(false);
            setSelectedImages([]);
          }}
          variant="outline"
        >
          İptal
        </Button>
      </div>
    </div>
  );
};