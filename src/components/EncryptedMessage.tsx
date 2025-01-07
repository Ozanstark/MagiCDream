import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Copy, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { useQuery } from "@tanstack/react-query";

const EncryptedMessage = () => {
  const [message, setMessage] = useState("");
  const [decryptKey, setDecryptKey] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["encrypted-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("encrypted_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const encryptMessage = async () => {
    if (!message.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir mesaj girin",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simple encryption for demonstration (in real-world, use stronger encryption)
      const key = Math.random().toString(36).substring(7);
      const encrypted = btoa(
        message
          .split("")
          .map((char) => String.fromCharCode(char.charCodeAt(0) + key.length))
          .join("")
      );

      const { error } = await supabase.from("encrypted_messages").insert({
        encrypted_content: encrypted,
        decryption_key: key,
      });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Mesajınız şifrelendi ve kaydedildi",
      });

      setMessage("");
      setDecryptKey(key);
      refetch();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj şifrelenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const decryptMessage = (encrypted: string, key: string) => {
    if (key !== decryptInput) {
      toast({
        title: "Hata",
        description: "Yanlış şifre çözme anahtarı",
        variant: "destructive",
      });
      return;
    }

    try {
      const decrypted = atob(encrypted)
        .split("")
        .map((char) => String.fromCharCode(char.charCodeAt(0) - key.length))
        .join("");

      toast({
        title: "Mesaj çözüldü",
        description: decrypted,
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Mesaj çözülürken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const copyKey = () => {
    navigator.clipboard.writeText(decryptKey);
    toast({
      title: "Kopyalandı",
      description: "Şifre çözme anahtarı panoya kopyalandı",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Mesaj Şifrele</h2>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Şifrelemek istediğiniz mesajı girin..."
          className="min-h-[200px] bg-[#1a1b26] text-white border-gray-700 resize-none"
        />
        <Button onClick={encryptMessage} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
          <Lock className="w-4 h-4 mr-2" />
          Mesajı Şifrele
        </Button>
        {decryptKey && (
          <div className="flex items-center gap-2 p-4 bg-[#1a1b26] rounded-lg border border-gray-700">
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Şifre Çözme Anahtarı:</p>
              <p className="font-mono text-white">{decryptKey}</p>
            </div>
            <Button variant="outline" size="icon" onClick={copyKey} className="border-gray-700 text-white hover:text-white">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {messages && messages.length > 0 && (
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
                    onClick={() =>
                      decryptMessage(msg.encrypted_content, msg.decryption_key)
                    }
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    Çöz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptedMessage;