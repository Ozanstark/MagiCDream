import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Lock, Key, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { formatDistanceToNow } from "date-fns";
import type { EncryptedPhoto, DeletionType } from "@/types/encrypted-content";

interface PhotoListProps {
  photos: EncryptedPhoto[];
  onPhotoDeleted: () => void;
  onPhotoEncrypted: () => void;
}

const PhotoList = ({ photos, onPhotoDeleted, onPhotoEncrypted }: PhotoListProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile) {
      toast({
        title: "Hata",
        description: "Lütfen bir fotoğraf seçin",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a random key
      const key = Math.random().toString(36).substring(7);
      console.log("Generated key:", key);

      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const base64String = e.target.result.toString().split(',')[1];
          const encryptedContent = encryptMessage(base64String, key);

          const { error } = await supabase
            .from('encrypted_photos')
            .insert({
              encrypted_content: encryptedContent,
              decryption_key: key,
              deletion_type: "never" as DeletionType,
              user_id: (await supabase.auth.getUser()).data.user?.id
            });

          if (error) throw error;

          toast({
            title: "Başarılı",
            description: "Fotoğraf başarıyla şifrelendi",
          });

          onPhotoEncrypted();
          setSelectedFile(null);
        }
      };
      reader.readAsDataURL(selectedFile);
    } catch (error) {
      console.error("Encryption error:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf şifrelenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

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
      <h2 className="text-2xl font-bold text-white">Fotoğraflarım</h2>
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="cursor-pointer"
          />
          <Button
            onClick={handleEncrypt}
            disabled={!selectedFile}
            className="w-full"
          >
            <Lock className="w-4 h-4 mr-2" />
            Fotoğrafı Şifrele
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        {photos.map((photo) => (
          <Card key={photo.id} className="p-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">
                  Oluşturulma: {formatDistanceToNow(new Date(photo.created_at), { addSuffix: true })}
                </p>
                <p className="text-sm text-gray-400">
                  Görüntülenme: {photo.decryption_count || 0} kez
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(photo.encrypted_content);
                    toast({
                      title: "Kopyalandı",
                      description: "Şifreli içerik panoya kopyalandı",
                    });
                  }}
                >
                  <Lock className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(photo.decryption_key);
                    toast({
                      title: "Kopyalandı",
                      description: "Şifre çözme anahtarı panoya kopyalandı",
                    });
                  }}
                >
                  <Key className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(photo.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PhotoList;