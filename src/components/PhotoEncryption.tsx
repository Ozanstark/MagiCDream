import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PremiumFeature from "./PremiumFeature";
import { Lock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage, decryptMessage } from "@/utils/encryption";

const PhotoEncryption = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptedPhotos, setEncryptedPhotos] = useState<any[]>([]);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile || !encryptionKey) {
      toast({
        title: "Hata",
        description: "Lütfen bir fotoğraf ve şifreleme anahtarı girin",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        if (e.target?.result) {
          const base64String = e.target.result.toString().split(',')[1];
          const encryptedContent = encryptMessage(base64String, encryptionKey);

          const { data, error } = await supabase
            .from('encrypted_photos')
            .insert({
              encrypted_content: encryptedContent,
              decryption_key: encryptionKey,
              user_id: (await supabase.auth.getUser()).data.user?.id
            })
            .select();

          if (error) throw error;

          toast({
            title: "Başarılı",
            description: "Fotoğraf başarıyla şifrelendi",
          });

          fetchEncryptedPhotos();
          setSelectedFile(null);
          setEncryptionKey("");
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

  const fetchEncryptedPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('encrypted_photos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEncryptedPhotos(data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      toast({
        title: "Hata",
        description: "Şifreli fotoğraflar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleDecrypt = async (encryptedPhoto: any) => {
    try {
      const decrypted = decryptMessage(encryptedPhoto.encrypted_content, encryptedPhoto.decryption_key);
      setDecryptedContent(decrypted);

      // Update decryption count
      const { error } = await supabase
        .from('encrypted_photos')
        .update({ decryption_count: (encryptedPhoto.decryption_count || 0) + 1 })
        .eq('id', encryptedPhoto.id);

      if (error) throw error;
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf çözülürken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  // Fetch encrypted photos on component mount
  useEffect(() => {
    fetchEncryptedPhotos();
  }, []);

  return (
    <PremiumFeature>
      <div className="space-y-8">
        <Card className="w-full max-w-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <Lock className="w-6 h-6" />
            <h2 className="text-2xl font-bold">Fotoğraf Şifreleme</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="cursor-pointer"
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Şifreleme anahtarı"
                value={encryptionKey}
                onChange={(e) => setEncryptionKey(e.target.value)}
              />
            </div>

            <Button
              onClick={handleEncrypt}
              disabled={!selectedFile || !encryptionKey}
              className="w-full"
            >
              Fotoğrafı Şifrele
            </Button>
          </div>
        </Card>

        <div className="space-y-4">
          {encryptedPhotos.map((photo) => (
            <Card key={photo.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Oluşturulma: {new Date(photo.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Görüntülenme: {photo.decryption_count || 0} kez
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDecrypt(photo)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Görüntüle
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {decryptedContent && (
          <Card className="p-4">
            <img
              src={`data:image/jpeg;base64,${decryptedContent}`}
              alt="Decrypted"
              className="max-w-full h-auto rounded-lg"
            />
          </Card>
        )}
      </div>
    </PremiumFeature>
  );
};

export default PhotoEncryption;