import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";

interface MessageInputFormProps {
  onMessageEncrypted: (key: string) => void;
  onSuccess: () => void;
}

export const MessageInputForm = ({ onMessageEncrypted, onSuccess }: MessageInputFormProps) => {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleEncrypt = async () => {
    if (!message.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir mesaj girin",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Hata",
          description: "Mesaj göndermek için giriş yapmalısınız",
          variant: "destructive",
        });
        return;
      }

      // Generate a random key
      const key = Math.random().toString(36).substring(7);
      console.log("Generated key:", key);
      
      // Encrypt the message
      const encrypted = encryptMessage(message, key);
      console.log("Encrypted message:", encrypted);

      const { error } = await supabase.from("encrypted_messages").insert({
        encrypted_content: encrypted,
        decryption_key: key,
        user_id: user.id // Set the user_id when inserting
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      toast({
        title: "Başarılı",
        description: "Mesajınız şifrelendi ve kaydedildi",
      });

      setMessage("");
      onMessageEncrypted(key);
      onSuccess();
    } catch (error) {
      console.error("Encryption error:", error);
      toast({
        title: "Hata",
        description: "Mesaj şifrelenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">Mesaj Şifrele</h2>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Şifrelemek istediğiniz mesajı girin..."
        className="min-h-[200px] bg-[#1a1b26] text-white border-gray-700 resize-none"
      />
      <Button onClick={handleEncrypt} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
        <Lock className="w-4 h-4 mr-2" />
        Mesajı Şifrele
      </Button>
    </div>
  );
};