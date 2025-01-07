import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Lock, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { encryptMessage } from "@/utils/encryption";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MessageInputFormProps {
  onMessageEncrypted: (key: string, message: string) => void;
  onSuccess: () => void;
}

export const MessageInputForm = ({ onMessageEncrypted, onSuccess }: MessageInputFormProps) => {
  const [message, setMessage] = useState("");
  const [deletionType, setDeletionType] = useState<"never" | "on_view" | "timed">("never");
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
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
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

      // Calculate deletion_time if needed
      let deletion_time = null;
      if (deletionType === 'timed') {
        deletion_time = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
      }

      const { error } = await supabase.from("encrypted_messages").insert({
        encrypted_content: encrypted,
        decryption_key: key,
        user_id: session.user.id,
        deletion_type: deletionType,
        deletion_time
      });

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      // First call onMessageEncrypted to update parent state
      onMessageEncrypted(key, encrypted);

      // Then show success toast
      toast({
        title: "Başarılı",
        description: "Mesajınız şifrelendi",
      });

      // Clear the input
      setMessage("");
      setDeletionType("never");
      
      // Finally call onSuccess
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
      <div className="space-y-2">
        <label className="text-sm text-white">Mesaj Silinme Seçeneği</label>
        <Select
          value={deletionType}
          onValueChange={(value: "never" | "on_view" | "timed") => setDeletionType(value)}
        >
          <SelectTrigger className="bg-[#1a1b26] text-white border-gray-700">
            <SelectValue placeholder="Silinme seçeneği seçin" />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1b26] text-white border-gray-700">
            <SelectItem value="never">Asla silme</SelectItem>
            <SelectItem value="on_view">Görüntülendiğinde sil</SelectItem>
            <SelectItem value="timed">1 saat sonra sil</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button 
        onClick={handleEncrypt} 
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-black relative group"
      >
        <Lock className="w-4 h-4 mr-2" />
        Mesajı Şifrele
        <Flame 
          className="absolute -top-2 -right-2 w-5 h-5 text-yellow-600 animate-sparkle" 
          strokeWidth={2.5}
        />
        <div className="absolute inset-0 rounded-md animate-glow opacity-0 group-hover:opacity-100" />
      </Button>
    </div>
  );
};