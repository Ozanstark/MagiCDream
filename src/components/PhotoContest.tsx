import { useState } from "react";
import { ImageUploader } from "./instagram/ImageUploader";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Trash2 } from "lucide-react";

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
      if (selectedImages.length < 2) {
        toast({
          title: "Hata",
          description: "En az 2 fotoğraf seçmelisiniz",
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
        .select('share_code, id')
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

  const handleDeleteContest = async () => {
    try {
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('share_code', shareCode);

      if (error) throw error;

      setShareCode(null);
      setSelectedImages([]);
      
      toast({
        title: "Başarılı",
        description: "Yarışma silindi!",
      });
    } catch (error) {
      console.error('Error deleting contest:', error);
      toast({
        title: "Hata",
        description: "Yarışma silinirken bir hata oluştu",
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
          2-10 arası fotoğraf yükleyin ve arkadaşlarınızın hangisini daha çok beğendiğini öğrenin!
        </p>
      </div>

      <ImageUploader
        selectedImages={selectedImages}
        onImageUpload={handleImageUpload}
        onImageRemove={handleImageRemove}
        maxImages={10}
        minImages={2}
      />

      {!shareCode ? (
        <Button
          onClick={handleCreateContest}
          disabled={selectedImages.length < 2}
          className="w-full"
        >
          Yarışma Oluştur
        </Button>
      ) : (
        <div className="space-y-4">
          <Button
            onClick={copyShareLink}
            className="w-full"
            variant="outline"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Paylaşım Linkini Kopyala
          </Button>
          
          <Button
            onClick={handleDeleteContest}
            className="w-full"
            variant="destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Yarışmayı Sil
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoContest;