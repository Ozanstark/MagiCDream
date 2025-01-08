import { useState } from "react";
import { ImageUploader } from "./instagram/ImageUploader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2 } from "lucide-react";

const PhotoContest = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [shareCode, setShareCode] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = (images: string[]) => {
    setSelectedImages(images);
  };

  const handleImageRemove = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreateContest = async () => {
    try {
      if (selectedImages.length !== 2) {
        toast({
          title: "Hata",
          description: "Lütfen 2 fotoğraf seçin",
          variant: "destructive",
        });
        return;
      }

      const { data: contest, error } = await supabase
        .from('photo_contests')
        .insert({
          photo1_url: selectedImages[0],
          photo2_url: selectedImages[1],
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('share_code')
        .single();

      if (error) throw error;

      setShareCode(contest.share_code);
      toast({
        title: "Başarılı",
        description: "Yarışma oluşturuldu!",
      });
    } catch (error) {
      console.error('Error creating contest:', error);
      toast({
        title: "Hata",
        description: "Yarışma oluşturulurken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  const copyShareLink = () => {
    if (!shareCode) return;
    const link = `${window.location.origin}/contest/${shareCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Başarılı",
      description: "Link kopyalandı!",
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Anlık Fotoğraf Yarışması</h2>
        <p className="text-muted-foreground">
          İki fotoğraf yükleyin ve arkadaşlarınızın hangisini daha çok beğendiğini öğrenin!
        </p>
      </div>

      <ImageUploader
        selectedImages={selectedImages}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
      />

      {!shareCode ? (
        <Button
          onClick={handleCreateContest}
          disabled={selectedImages.length !== 2}
          className="w-full"
        >
          Yarışma Oluştur
        </Button>
      ) : (
        <Button
          onClick={copyShareLink}
          className="w-full"
          variant="outline"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Paylaşım Linkini Kopyala
        </Button>
      )}
    </div>
  );
};

export default PhotoContest;