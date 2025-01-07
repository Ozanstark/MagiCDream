import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { decryptMessage } from "@/utils/encryption";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "./ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { Copy, Key, Lock } from "lucide-react";

interface Message {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: "never" | "on_view" | "timed";
  deletion_time: string | null;
}

interface EncryptedMessagesListProps {
  messages: Message[];
  onMessageDecrypted: (messageId: string) => void;
}

export const EncryptedMessagesList = ({ onMessageDecrypted }: EncryptedMessagesListProps) => {
  const [encryptedInput, setEncryptedInput] = useState("");
  const [decryptInput, setDecryptInput] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserMessages();
  }, []);

  const fetchUserMessages = async () => {
    const { data: messages, error } = await supabase
      .from("encrypted_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching messages:", error);
      toast({
        title: "Hata",
        description: "Mesajlar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
      return;
    }

    // Type assertion to ensure the data matches our Message interface
    setUserMessages(messages as Message[]);
  };

  const copyToClipboard = (text: string, type: "message" | "key") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: type === "message" ? "Şifreli mesaj kopyalandı" : "Şifre çözme anahtarı kopyalandı",
    });
  };

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
      setDecryptedMessage(decrypted);
      
      // If message exists in our list and is set to be deleted on view
      const message = userMessages.find(m => m.encrypted_content === encryptedInput);
      if (message && message.deletion_type === "on_view") {
        const { error } = await supabase
          .from("encrypted_messages")
          .delete()
          .eq("id", message.id);

        if (error) {
          console.error("Error deleting message:", error);
        } else {
          onMessageDecrypted(message.id);
          await fetchUserMessages(); // Refresh the list
        }
      }
      
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
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Şifreli Mesaj Çöz</h2>
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

            {decryptedMessage && (
              <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
                <p className="text-green-400 font-medium">Çözülmüş Mesaj:</p>
                <p className="text-white mt-2">{decryptedMessage}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Mesajlarım</h2>
          <div className="space-y-4">
            {userMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 border border-gray-700 rounded-lg bg-[#1a1b26] space-y-3"
              >
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};