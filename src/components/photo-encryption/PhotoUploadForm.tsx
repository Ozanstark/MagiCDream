import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import type { DeletionType } from "@/types/encrypted-content";

interface PhotoUploadFormProps {
  onPhotoEncrypted: () => void;
}

const PhotoUploadForm = ({ onPhotoEncrypted }: PhotoUploadFormProps) => {
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

  return (
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
  );
};

export default PhotoUploadForm;