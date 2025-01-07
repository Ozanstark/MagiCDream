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
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Mesaj Şifrele</h2>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Şifrelemek istediğiniz mesajı girin..."
          className="min-h-[100px]"
        />
        <Button onClick={encryptMessage} className="w-full">
          <Lock className="w-4 h-4 mr-2" />
          Mesajı Şifrele
        </Button>
        {decryptKey && (
          <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <p className="text-sm font-medium">Şifre Çözme Anahtarı:</p>
              <p className="font-mono">{decryptKey}</p>
            </div>
            <Button variant="outline" size="icon" onClick={copyKey}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {messages && messages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Şifreli Mesajlar</h2>
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4 border rounded-lg space-y-2">
                <p className="font-mono text-sm break-all">
                  {msg.encrypted_content}
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Şifre çözme anahtarını girin..."
                    onChange={(e) => setDecryptInput(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      decryptMessage(msg.encrypted_content, msg.decryption_key)
                    }
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