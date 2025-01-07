import { useState } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { MessageInputForm } from "./MessageInputForm";
import { EncryptedMessagesList } from "./EncryptedMessagesList";

const EncryptedMessage = () => {
  const [decryptKey, setDecryptKey] = useState("");
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["encrypted-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("encrypted_messages")
        .select("*")
        .order("created_at", { ascending: false });

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
      <MessageInputForm
        onMessageEncrypted={setDecryptKey}
        onSuccess={refetch}
      />
      
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

      {messages && messages.length > 0 && (
        <EncryptedMessagesList messages={messages} />
      )}
    </div>
  );
};

export default EncryptedMessage;