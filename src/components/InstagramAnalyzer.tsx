import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import InstagramScoreDisplay from "./InstagramScoreDisplay";

interface UploadedImage {
  url: string;
  score?: number | null;
  feedback?: string | null;
}

const InstagramAnalyzer = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (images.length >= 2) {
      toast({
        title: "Hata",
        description: "Karşılaştırma için sadece 2 resim yükleyebilirsiniz",
        variant: "destructive",
      });
      return;
    }

    try {
      const filename = `${crypto.randomUUID()}.${file.name.split('.').pop()}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(filename, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('generated-images')
        .getPublicUrl(filename);

      setImages(prev => [...prev, { url: publicUrl }]);

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Hata",
        description: "Resim yüklenemedi",
        variant: "destructive",
      });
    }
  };

  const analyzeImages = async () => {
    if (images.length !== 2) {
      toast({
        title: "Hata",
        description: "Lütfen karşılaştırma için tam olarak 2 resim yükleyin",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-instagram-photos', {
        body: {
          imageUrls: images.map(img => img.url),
        },
      });

      if (error) throw error;
      
      setImages(prev => prev.map((img, index) => ({
        ...img,
        score: data[index].score,
        feedback: data[index].feedback,
      })));

      toast({
        title: "Başarılı",
        description: "Resimler başarıyla analiz edildi!",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Hata",
        description: "Resimler analiz edilemedi",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Instagram Fotoğraf Analizi</h1>
        <p className="text-muted-foreground">
          Instagram için hangi fotoğrafın daha iyi olduğunu öğrenmek için 2 fotoğraf yükleyin
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={images.length >= 2 || isAnalyzing}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                   file:text-sm file:font-semibold file:bg-primary/10 file:text-primary 
                   hover:file:bg-primary/20"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div key={index} className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={image.url}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {image.score !== undefined && (
                <InstagramScoreDisplay
                  score={image.score}
                  feedback={image.feedback}
                />
              )}
            </div>
          ))}
        </div>

        {images.length === 2 && (
          <Button
            onClick={analyzeImages}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analiz Ediliyor...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Fotoğrafları Analiz Et
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InstagramAnalyzer;