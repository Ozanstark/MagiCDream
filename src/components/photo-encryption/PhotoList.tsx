import { Card } from "../ui/card";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { EncryptedPhoto } from "@/types/encrypted-content";
import PhotoUploadForm from "./PhotoUploadForm";
import PhotoListItem from "./PhotoListItem";

interface PhotoListProps {
  photos: EncryptedPhoto[];
  onPhotoDeleted: () => void;
  onPhotoEncrypted: () => void;
}

const PhotoList = ({ photos, onPhotoDeleted, onPhotoEncrypted }: PhotoListProps) => {
  const { toast } = useToast();

  const handleDelete = async (photoId: string) => {
    try {
      const { error } = await supabase
        .from('encrypted_photos')
        .delete()
        .eq('id', photoId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Fotoğraf başarıyla silindi",
      });

      onPhotoDeleted();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-2xl font-bold text-white">Fotoğraflarım</h2>
        <Eye className="w-6 h-6 text-primary animate-pulse" />
      </div>
      <Card className="p-4 space-y-4">
        <PhotoUploadForm onPhotoEncrypted={onPhotoEncrypted} />
      </Card>

      <div className="space-y-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="p-4">
            <PhotoListItem photo={photo} onDelete={handleDelete} />
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoList;