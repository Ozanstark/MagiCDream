import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Copy, Lock, Key } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageInputForm } from "./MessageInputForm";
import { EncryptedMessagesList } from "./EncryptedMessagesList";
import { useNavigate } from "react-router-dom";
import ComponentHeader from "./shared/ComponentHeader";

const EncryptedMessage = () => {
  const [decryptKey, setDecryptKey] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
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

  const copyText = (text: string, type: "key" | "message") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Kopyalandı",
      description: type === "key" ? "Şifre çözme anahtarı panoya kopyalandı" : "Şifreli mesaj panoya kopyalandı",
    });
  };

  const handleMessageEncrypted = (key: string, message: string) => {
    setDecryptKey(key);
    setEncryptedMessage(message);
  };

  const handleMessageDecrypted = (messageId: string) => {
    toast({
      title: "Mesaj silindi",
      description: "Görüntülenen mesaj başarıyla silindi",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <ComponentHeader
        title="Mesaj Şifreleme"
        description="Mesajlarınızı güvenli bir şekilde şifreleyin ve paylaşın. Mesajlarınız sadece şifre anahtarına sahip kişiler tarafından okunabilir."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-card rounded-lg border border-border/20 space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">1. Mesajı Girin</h3>
          <p className="text-sm text-muted-foreground">Şifrelemek istediğiniz mesajı girin ve silinme seçeneğini belirleyin.</p>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border/20 space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Key className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">2. Anahtarı Paylaşın</h3>
          <p className="text-sm text-muted-foreground">Oluşturulan şifre çözme anahtarını güvenli bir şekilde alıcıya iletin.</p>
        </div>

        <div className="p-4 bg-card rounded-lg border border-border/20 space-y-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mb-2">
            <Copy className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">3. Mesajı Çözün</h3>
          <p className="text-sm text-muted-foreground">Şifreli mesajı ve anahtarı kullanarak mesajı çözün ve okuyun.</p>
        </div>
      </div>
      
      <MessageInputForm
        onMessageEncrypted={handleMessageEncrypted}
        onSuccess={() => {}}
      />
      
      {(decryptKey && encryptedMessage) && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-4 bg-[#1a1b26] rounded-lg border border-gray-700">
            <Lock className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Şifreli Mesaj:</p>
              <p className="font-mono text-white break-all">{encryptedMessage}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => copyText(encryptedMessage, "message")}
              className="border-gray-700 text-white hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 p-4 bg-[#1a1b26] rounded-lg border border-gray-700">
            <Key className="w-5 h-5 text-yellow-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-white mb-2">Şifre Çözme Anahtarı:</p>
              <p className="font-mono text-white break-all">{decryptKey}</p>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => copyText(decryptKey, "key")}
              className="border-gray-700 text-white hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <EncryptedMessagesList onMessageDecrypted={handleMessageDecrypted} messages={[]} />
    </div>
  );
};

export default EncryptedMessage;