import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { X, Lock, Key, Image } from "lucide-react";
import PremiumFeature from "./PremiumFeature";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { decryptMessage } from "@/utils/encryption";
import type { EncryptedPhoto, DeletionType } from "@/types/encrypted-content";
import DecryptPhotoForm from "./photo-encryption/DecryptPhotoForm";
import PhotoList from "./photo-encryption/PhotoList";
import ComponentHeader from "./shared/ComponentHeader";

const PhotoEncryption = () => {
  const [encryptedPhotos, setEncryptedPhotos] = useState<EncryptedPhoto[]>([]);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEncryptedPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('encrypted_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedData: EncryptedPhoto[] = data.map(photo => ({
        ...photo,
        deletion_type: photo.deletion_type as DeletionType
      }));
      
      setEncryptedPhotos(typedData);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Hata",
        description: "Şifreli fotoğraflar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchEncryptedPhotos();
  }, []);

  const handlePhotoView = (content: string, key: string) => {
    try {
      const decrypted = decryptMessage(content, key);
      setDecryptedContent(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      toast({
        title: "Hata",
        description: "Fotoğraf çözümlenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <PremiumFeature>
      <div className="space-y-4">
        <ComponentHeader
          title="Fotoğraf Şifreleme"
          description="Fotoğraflarınızı güvenli bir şekilde şifreleyin ve paylaşın. Fotoğraflarınız sadece şifre anahtarına sahip kişiler tarafından görüntülenebilir."
        />

        <div className="flex gap-4 overflow-x-auto pb-2">
          <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-primary" />
              <span className="font-medium">1. Fotoğraf Seçin</span>
            </div>
            <p className="text-xs text-muted-foreground">Şifrelemek istediğiniz fotoğrafı yükleyin</p>
          </div>

          <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-primary" />
              <span className="font-medium">2. Ayarları Seçin</span>
            </div>
            <p className="text-xs text-muted-foreground">Silinme zamanı ve güvenlik ayarlarını belirleyin</p>
          </div>

          <div className="min-w-[200px] p-3 bg-card rounded-lg border border-border/20">
            <div className="flex items-center gap-2 mb-2">
              <Key className="w-4 h-4 text-primary" />
              <span className="font-medium">3. Anahtarı İletin</span>
            </div>
            <p className="text-xs text-muted-foreground">Şifre çözme anahtarını güvenli şekilde paylaşın</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Decrypt Form */}
          <div className="space-y-4">
            <DecryptPhotoForm onDecrypt={setDecryptedContent} />
            
            {decryptedContent && (
              <Card className="p-4 relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setDecryptedContent(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="flex justify-center items-center">
                  <img
                    src={`data:image/jpeg;base64,${decryptedContent}`}
                    alt="Decrypted"
                    className="max-w-[400px] max-h-[400px] w-auto h-auto object-contain rounded-lg"
                  />
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Photos List */}
          <PhotoList
            photos={encryptedPhotos}
            onPhotoDeleted={fetchEncryptedPhotos}
            onPhotoEncrypted={fetchEncryptedPhotos}
            onPhotoView={handlePhotoView}
          />
        </div>
      </div>
    </PremiumFeature>
  );
};

export default PhotoEncryption;