import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { decryptMessage } from "@/utils/encryption";

interface DecryptPhotoFormProps {
  onDecrypt: (decryptedContent: string) => void;
}

const DecryptPhotoForm = ({ onDecrypt }: DecryptPhotoFormProps) => {
  const [decryptInput, setDecryptInput] = useState({ content: "", key: "" });
  const { toast } = useToast();

  const handleDecrypt = async () => {
    try {
      const decrypted = decryptMessage(decryptInput.content, decryptInput.key);
      onDecrypt(decrypted);
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

  return (
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
      {decryptInput.content && (
        <Card className="p-4">
          <div className="flex justify-center items-center">
            <img
              src={`data:image/jpeg;base64,${decryptInput.content}`}
              alt="Decrypted"
              className="max-w-[400px] max-h-[400px] w-auto h-auto object-contain rounded-lg"
            />
          </div>
        </Card>
      )}
    </div>
  );
};

export default DecryptPhotoForm;