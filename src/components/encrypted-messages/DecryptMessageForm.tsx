import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { decryptMessage } from "@/utils/encryption";

interface DecryptMessageFormProps {
  onMessageDecrypted: (messageId: string) => void;
  onDecryptSuccess: (decryptedMessage: string) => void;
}

export const DecryptMessageForm = ({ onMessageDecrypted, onDecryptSuccess }: DecryptMessageFormProps) => {
  const [encryptedInput, setEncryptedInput] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const { toast } = useToast();

  const handleDecrypt = async () => {
    if (!encryptedInput.trim() || !decryptInput.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen şifreli mesaj ve şifre çözme anahtarını girin",
        variant: "destructive",
      });
      return;
    }

    try {
      const decrypted = decryptMessage(encryptedInput, decryptInput);
      onDecryptSuccess(decrypted);
      
      toast({
        title: "Başarılı",
        description: "Mesaj başarıyla çözüldü",
      });
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Hata",
        description: "Mesaj çözülürken bir hata oluştu. Lütfen doğru şifreli mesaj ve anahtarı girdiğinizden emin olun.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-[#1a1b26]">
      <div className="space-y-2">
        <label className="text-sm text-white">Şifreli Mesaj</label>
        <Textarea
          value={encryptedInput}
          onChange={(e) => setEncryptedInput(e.target.value)}
          placeholder="Şifreli mesajı buraya yapıştırın..."
          className="min-h-[100px] bg-[#1a1b26] border-gray-700 text-white"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm text-white">Şifre Çözme Anahtarı</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={decryptInput}
            onChange={(e) => setDecryptInput(e.target.value)}
            placeholder="Şifre çözme anahtarını girin..."
            className="bg-[#1a1b26] border-gray-700 text-white"
          />
          <Button
            onClick={handleDecrypt}
            className="bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            Çöz
          </Button>
        </div>
      </div>
    </div>
  );
};