import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { DecryptMessageForm } from "./encrypted-messages/DecryptMessageForm";
import { MessageCard } from "./encrypted-messages/MessageCard";

interface Message {
  id: string;
  encrypted_content: string;
  decryption_key: string;
  created_at: string;
  deletion_type: "never" | "on_view" | "timed";
  deletion_time: string | null;
  decryption_count: number;
}

interface EncryptedMessagesListProps {
  messages: Message[];
  onMessageDecrypted: (messageId: string) => void;
}

export const EncryptedMessagesList = ({ onMessageDecrypted }: EncryptedMessagesListProps) => {
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [userMessages, setUserMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserMessages();
  }, []);

  const fetchUserMessages = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: messages, error } = await supabase
      .from("encrypted_messages")
      .select("*")
      .eq('user_id', session.user.id)
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

    setUserMessages(messages as Message[]);
  };

  const handleDecryptSuccess = async (decrypted: string) => {
    setDecryptedMessage(decrypted);
  };

  const handleMessageDelete = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from("encrypted_messages")
        .delete()
        .eq('id', messageId);

      if (error) throw error;

      setUserMessages(prevMessages => prevMessages.filter(msg => msg.id !== messageId));
      toast({
        title: "Başarılı",
        description: "Mesaj başarıyla silindi",
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Hata",
        description: "Mesaj silinirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Şifreli Mesaj Çöz</h2>
          <DecryptMessageForm 
            onMessageDecrypted={onMessageDecrypted}
            onDecryptSuccess={handleDecryptSuccess}
          />
          
          {decryptedMessage && (
            <div className="mt-4 p-4 bg-green-900/20 rounded-lg">
              <p className="text-green-400 font-medium">Çözülmüş Mesaj:</p>
              <p className="text-white mt-2">{decryptedMessage}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Mesajlarım</h2>
          <div className="space-y-4">
            {userMessages.map((message) => (
              <MessageCard 
                key={message.id} 
                message={message} 
                onDelete={handleMessageDelete}
              />
            ))}
            {userMessages.length === 0 && (
              <p className="text-gray-400 text-center py-4">Henüz hiç mesajınız yok</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};