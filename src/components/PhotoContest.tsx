import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContestCreator } from "./photo-contest/ContestCreator";
import { ContestCard } from "./photo-contest/ContestCard";

interface Contest {
  id: string;
  share_code: string;
  photo1_url: string;
  photo2_url: string;
}

const PhotoContest = () => {
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
      
      console.log("Fetched contests:", userContests);
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

  const handleCreateContest = async (selectedImages: string[]) => {
    try {
      console.log("Creating contest with images:", selectedImages);
      
      // Store the images in Supabase Storage
      const uploadPromises = selectedImages.map(async (imageUrl, index) => {
        // Convert data URL to Blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        
        // Generate a unique filename with timestamp and extension
        const fileName = `contest-${Date.now()}-${index + 1}.jpg`;
        
        const { data, error: uploadError } = await supabase.storage
          .from('generated-images')
          .upload(fileName, blob, {
            contentType: 'image/jpeg',
            upsert: false
          });

        if (uploadError) throw uploadError;
        
        return fileName;
      });

      const [photo1Path, photo2Path] = await Promise.all(uploadPromises);

      const { data: contest, error } = await supabase
        .from('photo_contests')
        .insert({
          photo1_url: photo1Path,
          photo2_url: photo2Path,
          user_id: (await supabase.auth.getUser()).data.user?.id
        })
        .select('*')
        .single();

      if (error) throw error;

      console.log("Created contest:", contest);
      setContests(prev => [contest, ...prev]);
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
      const contestToDelete = contests.find(c => c.share_code === shareCode);
      
      if (contestToDelete) {
        // Delete the images from storage
        await supabase.storage
          .from('generated-images')
          .remove([contestToDelete.photo1_url, contestToDelete.photo2_url]);
      }

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

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Anlık Fotoğraf Yarışması</h2>
        <p className="text-muted-foreground">
          2 fotoğraf yükleyin ve arkadaşlarınızın hangisini daha çok beğendiğini öğrenin!
        </p>
      </div>

      <ContestCreator
        onCreateContest={handleCreateContest}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
      />

      {contests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Yarışmalarım</h3>
          <div className="grid gap-4">
            {contests.map((contest) => (
              <ContestCard
                key={contest.id}
                contest={contest}
                onDelete={handleDeleteContest}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoContest;