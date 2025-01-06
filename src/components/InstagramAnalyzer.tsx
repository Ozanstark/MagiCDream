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
        title: "Error",
        description: "You can only upload 2 images for comparison",
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
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    }
  };

  const analyzeImages = async () => {
    if (images.length !== 2) {
      toast({
        title: "Error",
        description: "Please upload exactly 2 images for comparison",
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
        title: "Success",
        description: "Images analyzed successfully!",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: "Failed to analyze images",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 px-4">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Instagram Photo Analyzer</h1>
        <p className="text-muted-foreground">
          Upload 2 photos to compare and find out which one is better for Instagram
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
                Analyzing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Analyze Photos
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default InstagramAnalyzer;