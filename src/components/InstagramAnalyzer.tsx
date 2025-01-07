import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ImageUploader } from "./instagram/ImageUploader";
import { AnalysisResults } from "./instagram/AnalysisResults";

interface AnalysisResult {
  score: number;
  caption: string;
  feedback: string;
}

const InstagramAnalyzer = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [language, setLanguage] = useState<"tr" | "en">("tr");
  const { toast } = useToast();

  const uploadImageToStorage = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const filename = `${crypto.randomUUID()}.${blob.type.split('/')[1] || 'png'}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(filename, blob, {
          contentType: blob.type,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('generated-images')
        .getPublicUrl(filename);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const analyzeImages = async () => {
    if (selectedImages.length !== 2) {
      toast({
        title: "Hata",
        description: "Lütfen tam olarak 2 fotoğraf seçin.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const publicUrls = await Promise.all(
        selectedImages.map(url => uploadImageToStorage(url))
      );

      const { data, error } = await supabase.functions.invoke('analyze-instagram-photos', {
        body: { imageUrls: publicUrls, language }
      });

      if (error) throw error;

      setResults(data);
      toast({
        title: "Başarılı",
        description: "Fotoğraflar başarıyla analiz edildi!",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Hata",
        description: "Fotoğrafları analiz ederken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Instagram Fotoğraf Analizi</h2>
        <p className="text-center text-muted-foreground">
          Karşılaştırmak istediğiniz 2 fotoğraf seçin
        </p>
      </div>

      <ImageUploader
        selectedImages={selectedImages}
        onImageUpload={setSelectedImages}
        onImageRemove={(index) => {
          setSelectedImages(prev => prev.filter((_, i) => i !== index));
          setResults([]);
        }}
      />

      {results.length > 0 && (
        <AnalysisResults
          results={results}
          language={language}
          onLanguageChange={setLanguage}
        />
      )}

      <Button
        className="w-full"
        onClick={analyzeImages}
        disabled={selectedImages.length !== 2 || isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analiz Ediliyor...
          </>
        ) : (
          "Analiz Et"
        )}
      </Button>
    </div>
  );
};

export default InstagramAnalyzer;