import { useState } from "react";
import { Button } from "../ui/button";
import { Copy, Key, Lock, Trash2, Eye, Flame } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { decryptMessage } from "@/utils/encryption";

interface Message {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: "never" | "on_view" | "timed";
  deletion_time: string | null;
  decryption_count: number;
}

interface MessageCardProps {
  message: Message;
  onDelete?: (messageId: string) => void;
}

export const MessageCard = ({ message, onDelete }: MessageCardProps) => {
  const { toast } = useToast();
  const [decryptedContent, setDecryptedContent] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: "message" | "key") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: type === "message" ? "Şifreli mesaj kopyalandı" : "Şifre çözme anahtarı kopyalandı",
    });
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("encrypted_messages")
        .delete()
        .eq("id", message.id);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Mesaj başarıyla silindi",
      });

      if (onDelete) {
        onDelete(message.id);
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Hata",
        description: "Mesaj silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const handleDecrypt = async () => {
    try {
      const decrypted = decryptMessage(message.encrypted_content, message.decryption_key);
      setDecryptedContent(decrypted);

      // Update decryption count
      const { error } = await supabase
        .from("encrypted_messages")
        .update({ decryption_count: (message.decryption_count || 0) + 1 })
        .eq("id", message.id);

      if (error) throw error;
    } catch (error) {
      console.error("Error decrypting message:", error);
      toast({
        title: "Hata",
        description: "Mesaj çözülürken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-[#1a1b26] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-yellow-400" />
          <span className="text-sm text-gray-400">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.encrypted_content, "message")}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(message.decryption_key, "key")}
          >
            <Key className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDecrypt}
            className="relative group"
          >
            <Eye className="w-4 h-4" />
            <Flame className="absolute -top-2 -right-2 w-3 h-3 text-yellow-500 animate-sparkle" />
            <div className="absolute inset-0 rounded-md animate-glow opacity-0 group-hover:opacity-100" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4 text-red-400" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-sm text-gray-400">Şifreli Mesaj:</p>
          <p className="text-white break-all font-mono text-sm">{message.encrypted_content}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Şifre Çözme Anahtarı:</p>
          <p className="text-white break-all font-mono text-sm">{message.decryption_key}</p>
        </div>
        {decryptedContent && (
          <div className="p-3 bg-green-900/20 rounded-lg">
            <p className="text-sm text-gray-400">Çözülmüş Mesaj:</p>
            <p className="text-green-400">{decryptedContent}</p>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-sm">
        <div>
          <p className="text-gray-400">Silinme:</p>
          <p className="text-white">
            {message.deletion_type === "never" && "Asla silinmeyecek"}
            {message.deletion_type === "on_view" && "Görüntülendiğinde silinecek"}
            {message.deletion_type === "timed" && message.deletion_time && 
              `${formatDistanceToNow(new Date(message.deletion_time))} sonra silinecek`}
          </p>
        </div>
        <div>
          <p className="text-gray-400">Çözülme Sayısı:</p>
          <p className="text-white">{message.decryption_count || 0}</p>
        </div>
      </div>
    </div>
  );
};