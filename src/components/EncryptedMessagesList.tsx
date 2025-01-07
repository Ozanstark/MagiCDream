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

  const handleDecryptSuccess = async (decrypted: string) => {
    setDecryptedMessage(decrypted);
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
              <MessageCard key={message.id} message={message} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};