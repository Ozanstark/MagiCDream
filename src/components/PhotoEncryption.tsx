import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import PremiumFeature from "./PremiumFeature";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { EncryptedPhoto, DeletionType } from "@/types/encrypted-content";
import DecryptPhotoForm from "./photo-encryption/DecryptPhotoForm";
import PhotoList from "./photo-encryption/PhotoList";

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

  return (
    <PremiumFeature>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Column - Decrypt Form */}
          <div className="space-y-4">
            <DecryptPhotoForm onDecrypt={setDecryptedContent} />
            
            {decryptedContent && (
              <Card className="p-4">
                <img
                  src={`data:image/jpeg;base64,${decryptedContent}`}
                  alt="Decrypted"
                  className="w-full h-auto rounded-lg"
                />
              </Card>
            )}
          </div>

          {/* Right Column - Photos List */}
          <PhotoList
            photos={encryptedPhotos}
            onPhotoDeleted={fetchEncryptedPhotos}
            onPhotoEncrypted={fetchEncryptedPhotos}
          />
        </div>
      </div>
    </PremiumFeature>
  );
};

export default PhotoEncryption;