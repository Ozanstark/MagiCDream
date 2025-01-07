import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import PremiumFeature from "./PremiumFeature";
import { Lock, Eye, Trash2, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage, decryptMessage } from "@/utils/encryption";
import { formatDistanceToNow } from "date-fns";

interface EncryptedPhoto {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: "never" | "on_view" | "timed";
  deletion_time: string | null;
  decryption_count: number;
}

const PhotoEncryption = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState("");
  const [encryptedPhotos, setEncryptedPhotos] = useState<EncryptedPhoto[]>([]);
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
  const [decryptInput, setDecryptInput] = useState({ content: "", key: "" });
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

          const { error } = await supabase
            .from('encrypted_photos')
            .insert({
              encrypted_content: encryptedContent,
              decryption_key: encryptionKey,
              user_id: (await supabase.auth.getUser()).data.user?.id
            });

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

  const handleDecrypt = async () => {
    try {
      const decrypted = decryptMessage(decryptInput.content, decryptInput.key);
      setDecryptedContent(decrypted);
      setDecryptInput({ content: "", key: "" });
      
      toast({
        title: "Başarılı",
        description: "Fotoğraf başarıyla çözüldü",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf çözülürken bir hata oluştu",
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

      fetchEncryptedPhotos();
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Hata",
        description: "Fotoğraf silinirken bir hata oluştu",
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
            <h2 className="text-2xl font-bold text-white">Şifreli Fotoğraf Çöz</h2>
            <Card className="p-4 space-y-4">
              <div>
                <label className="text-sm text-gray-400">Şifreli İçerik</label>
                <Textarea
                  value={decryptInput.content}
                  onChange={(e) => setDecryptInput({ ...decryptInput, content: e.target.value })}
                  placeholder="Şifreli fotoğraf içeriğini yapıştırın..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Şifre Çözme Anahtarı</label>
                <Input
                  value={decryptInput.key}
                  onChange={(e) => setDecryptInput({ ...decryptInput, key: e.target.value })}
                  placeholder="Şifre çözme anahtarını girin..."
                />
              </div>
              <Button onClick={handleDecrypt} className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Fotoğrafı Çöz
              </Button>
            </Card>

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
                <Input
                  type="password"
                  placeholder="Şifreleme anahtarı"
                  value={encryptionKey}
                  onChange={(e) => setEncryptionKey(e.target.value)}
                />
                <Button
                  onClick={handleEncrypt}
                  disabled={!selectedFile || !encryptionKey}
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Fotoğrafı Şifrele
                </Button>
              </div>
            </Card>

            <div className="space-y-4">
              {encryptedPhotos.map((photo) => (
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
        </div>
      </div>
    </PremiumFeature>
  );
};

export default PhotoEncryption;