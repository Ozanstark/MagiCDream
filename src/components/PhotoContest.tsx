import { useState, useEffect } from "react";
import { ImageUploader } from "./instagram/ImageUploader";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2, Trash2, Plus } from "lucide-react";

interface Contest {
  id: string;
  share_code: string;
  photo1_url: string;
  photo2_url: string;
}

const PhotoContest = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [contests, setContests] = useState<Contest[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserContests();
  }, []);

  const fetchUserContests = async () => {
    try {
      const { data: userContests, error } = await supabase
        .from('photo_contests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContests(userContests || []);
    } catch (error) {
      console.error('Error fetching contests:', error);
      toast({
        title: "Hata",
        description: "Yarışmalar yüklenirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

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
        .select('*')
        .single();

      if (error) throw error;

      setContests(prev => [contest, ...prev]);
      setSelectedImages([]);
      setIsCreating(false);
      
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

  const handleDeleteContest = async (shareCode: string) => {
    try {
      const { error } = await supabase
        .from('photo_contests')
        .delete()
        .eq('share_code', shareCode);

      if (error) throw error;

      setContests(prev => prev.filter(contest => contest.share_code !== shareCode));
      
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

  const copyShareLink = (shareCode: string) => {
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

      {!isCreating ? (
        <Button onClick={() => setIsCreating(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Yeni Yarışma Oluştur
        </Button>
      ) : (
        <div className="space-y-4">
          <ImageUploader
            selectedImages={selectedImages}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            maxImages={10}
            minImages={2}
          />

          <div className="flex gap-2">
            <Button
              onClick={handleCreateContest}
              disabled={selectedImages.length < 2}
              className="flex-1"
            >
              Yarışma Oluştur
            </Button>
            <Button
              onClick={() => {
                setIsCreating(false);
                setSelectedImages([]);
              }}
              variant="outline"
            >
              İptal
            </Button>
          </div>
        </div>
      )}

      {contests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Yarışmalarım</h3>
          <div className="grid gap-4">
            {contests.map((contest) => (
              <div key={contest.id} className="border rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <img src={contest.photo1_url} alt="Photo 1" className="w-full h-40 object-cover rounded" />
                  <img src={contest.photo2_url} alt="Photo 2" className="w-full h-40 object-cover rounded" />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyShareLink(contest.share_code)}
                    className="flex-1"
                    variant="outline"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Paylaşım Linkini Kopyala
                  </Button>
                  <Button
                    onClick={() => handleDeleteContest(contest.share_code)}
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoContest;