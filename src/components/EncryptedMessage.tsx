import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { MessageInputForm } from "./MessageInputForm";
import { EncryptedMessagesList } from "./EncryptedMessagesList";
import { useNavigate } from "react-router-dom";

const EncryptedMessage = () => {
  const [decryptKey, setDecryptKey] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

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

      <EncryptedMessagesList messages={[]} onMessageDecrypted={() => {}} />
    </div>
  );
};

export default EncryptedMessage;