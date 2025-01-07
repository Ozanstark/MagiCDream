import { useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { MessageInputForm } from "./MessageInputForm";
import { EncryptedMessagesList } from "./EncryptedMessagesList";
import { useParams } from "react-router-dom";

const EncryptedMessage = () => {
  const [decryptKey, setDecryptKey] = useState("");
  const { toast } = useToast();
  const { shareId } = useParams();

  const { data: messages, refetch } = useQuery({
    queryKey: ["encrypted-messages", shareId],
    queryFn: async () => {
      let query = supabase
        .from("encrypted_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (shareId) {
        query = query.eq("share_id", shareId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      return data;
    },
  });

  const copyKey = () => {
    navigator.clipboard.writeText(decryptKey);
    toast({
      title: "Kopyalandı",
      description: "Şifre çözme anahtarı panoya kopyalandı",
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 p-6">
      {!shareId && (
        <MessageInputForm
          onMessageEncrypted={setDecryptKey}
          onSuccess={refetch}
        />
      )}
      
      {decryptKey && !shareId && (
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

      {messages && messages.length > 0 && (
        <EncryptedMessagesList messages={messages} />
      )}
    </div>
  );
};

export default EncryptedMessage;