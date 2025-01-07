import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import PremiumFeature from "./PremiumFeature";
import { Lock } from "lucide-react";

const PhotoEncryption = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [encryptionKey, setEncryptionKey] = useState("");

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleEncrypt = async () => {
    if (!selectedFile || !encryptionKey) return;
    // Şifreleme işlemi burada yapılacak
  };

  return (
    <PremiumFeature>
      <Card className="w-full max-w-2xl p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <Lock className="w-6 h-6" />
          <h2 className="text-2xl font-bold">Fotoğraf Şifreleme</h2>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="cursor-pointer"
            />
          </div>

          <div>
            <Input
              type="password"
              placeholder="Şifreleme anahtarı"
              value={encryptionKey}
              onChange={(e) => setEncryptionKey(e.target.value)}
            />
          </div>

          <Button
            onClick={handleEncrypt}
            disabled={!selectedFile || !encryptionKey}
            className="w-full"
          >
            Fotoğrafı Şifrele
          </Button>
        </div>
      </Card>
    </PremiumFeature>
  );
};

export default PhotoEncryption;