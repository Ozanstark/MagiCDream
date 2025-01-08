import { useState } from "react";
import { Button } from "../ui/button";
import { ImageUploader } from "../instagram/ImageUploader";
import { Card } from "../ui/card";

interface ContestCreatorProps {
  onCreateContest: (selectedImages: string[]) => void;
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

  const handleSubmit = () => {
    if (selectedImages.length === 2) {
      onCreateContest(selectedImages);
      setSelectedImages([]);
    }
  };

  if (!isCreating) {
    return (
      <Button onClick={() => setIsCreating(true)}>
        Yeni Yarışma Başlat
      </Button>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Fotoğrafları Seç</h3>
        <p className="text-sm text-muted-foreground">
          Yarışma için 2 fotoğraf seçin
        </p>
      </div>

      <div className="w-full">
        <ImageUploader
          selectedImages={selectedImages}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          maxImages={2}
          minImages={2}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={selectedImages.length !== 2}
          className="flex-1"
        >
          Yarışmayı Başlat
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setIsCreating(false);
            setSelectedImages([]);
          }}
        >
          İptal
        </Button>
      </div>
    </Card>
  );
};