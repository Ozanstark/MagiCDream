import { Button } from "../ui/button";
import { Copy, Key, Lock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: "never" | "on_view" | "timed";
  deletion_time: string | null;
}

interface MessageCardProps {
  message: Message;
}

export const MessageCard = ({ message }: MessageCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: "message" | "key") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: type === "message" ? "Şifreli mesaj kopyalandı" : "Şifre çözme anahtarı kopyalandı",
    });
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
        </div>
      </div>
      <div className="text-sm">
        <p className="text-gray-400">Silinme:</p>
        <p className="text-white">
          {message.deletion_type === "never" && "Asla silinmeyecek"}
          {message.deletion_type === "on_view" && "Görüntülendiğinde silinecek"}
          {message.deletion_type === "timed" && message.deletion_time && 
            `${formatDistanceToNow(new Date(message.deletion_time))} sonra silinecek`}
        </p>
      </div>
    </div>
  );
};