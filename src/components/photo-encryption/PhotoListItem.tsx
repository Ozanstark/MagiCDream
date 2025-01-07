import { Button } from "../ui/button";
import { Lock, Key, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { EncryptedPhoto } from "@/types/encrypted-content";

interface PhotoListItemProps {
  photo: EncryptedPhoto;
  onDelete: (photoId: string) => void;
}

const PhotoListItem = ({ photo, onDelete }: PhotoListItemProps) => {
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <p className="text-sm text-gray-400">
          Oluşturulma: {formatDistanceToNow(new Date(photo.created_at), { addSuffix: true })}
        </p>
        <p className="text-sm text-gray-400">
          Görüntülenme: {photo.decryption_count || 0} kez
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(photo.encrypted_content);
            toast({
              title: "Kopyalandı",
              description: "Şifreli içerik panoya kopyalandı",
            });
          }}
        >
          <Lock className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(photo.decryption_key);
            toast({
              title: "Kopyalandı",
              description: "Şifre çözme anahtarı panoya kopyalandı",
            });
          }}
        >
          <Key className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(photo.id)}
        >
          <Trash2 className="w-4 h-4 text-red-400" />
        </Button>
      </div>
    </div>
  );
};

export default PhotoListItem;