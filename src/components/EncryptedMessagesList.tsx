import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { decryptMessage } from "@/utils/encryption";

interface Message {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
}

interface EncryptedMessagesListProps {
  messages: Message[];
}

export const EncryptedMessagesList = ({ messages }: EncryptedMessagesListProps) => {
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptedMessages, setDecryptedMessages] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleDecrypt = (messageId: string, encrypted: string, key: string) => {
    if (key !== decryptInput) {
      toast({
        title: "Hata",
        description: "Yanlış şifre çözme anahtarı",
        variant: "destructive",
      });
      return;
    }

    try {
      const decrypted = decryptMessage(encrypted, key);
      setDecryptedMessages(prev => ({
        ...prev,
        [messageId]: decrypted
      }));
    } catch (error) {
      console.error("Decryption error:", error);
      toast({
        title: "Hata",
        description: "Mesaj çözülürken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Şifreli Mesajlar</h2>
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="p-4 border border-gray-700 rounded-lg space-y-2 bg-[#1a1b26]">
            <p className="font-mono text-sm break-all text-white">
              {msg.encrypted_content}
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Şifre çözme anahtarını girin..."
                onChange={(e) => setDecryptInput(e.target.value)}
                className="bg-[#1a1b26] border-gray-700 text-white"
              />
              <Button
                onClick={() => handleDecrypt(msg.id, msg.encrypted_content, msg.decryption_key)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                Çöz
              </Button>
            </div>
            {decryptedMessages[msg.id] && (
              <div className="mt-2 p-3 bg-green-900/20 rounded-lg">
                <p className="text-green-400 font-medium">Çözülmüş Mesaj:</p>
                <p className="text-white">{decryptedMessages[msg.id]}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};