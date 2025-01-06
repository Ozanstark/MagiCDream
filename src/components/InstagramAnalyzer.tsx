import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

const InstagramAnalyzer = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setSelectedImages(prev => {
      if (prev.length + newImages.length > 2) {
        toast({
          title: "Hata",
          description: "En fazla 2 fotoğraf seçebilirsiniz.",
          variant: "destructive",
        });
        return prev;
      }
      return [...prev, ...newImages];
    });
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
    let retries = 0;
    const maxRetries = 5;

    while (retries < maxRetries) {
      try {
        const response = await fetch("https://api-inference.huggingface.co/models/nlpconnect/vit-gpt2-image-captioning", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: selectedImages,
          }),
        });

        const responseText = await response.text();
        
        // Check if the model is still loading
        if (responseText.includes("Model") && responseText.includes("is currently loading")) {
          console.log(`Model is loading, retry ${retries + 1}/${maxRetries}`);
          toast({
            title: "Bilgi",
            description: `Model yükleniyor, tekrar deneniyor (${retries + 1}/${maxRetries})...`,
          });
          await sleep(5000); // Wait 5 seconds before retrying
          retries++;
          continue;
        }

        if (!response.ok) {
          throw new Error("Analiz sırasında bir hata oluştu");
        }

        const result = JSON.parse(responseText);
        console.log("Analysis result:", result);

        toast({
          title: "Başarılı",
          description: "Fotoğraflar başarıyla analiz edildi!",
        });
        break; // Success, exit the loop

      } catch (error) {
        console.error("Analysis error:", error);
        if (retries === maxRetries - 1) {
          toast({
            title: "Hata",
            description: "Fotoğrafları analiz ederken bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
            variant: "destructive",
          });
        }
        retries++;
        if (retries < maxRetries) {
          await sleep(5000); // Wait 5 seconds before retrying
        }
      }
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">Instagram Fotoğraf Analizi</h2>
        <p className="text-center text-muted-foreground">
          Karşılaştırmak istediğiniz 2 fotoğraf seçin
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedImages.map((image, index) => (
          <div key={index} className="relative">
            <img
              src={image}
              alt={`Selected ${index + 1}`}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => removeImage(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {selectedImages.length < 2 && (
          <div className="aspect-square flex items-center justify-center border-2 border-dashed rounded-lg">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer text-center p-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              Fotoğraf Seç
            </label>
          </div>
        )}
      </div>

      <Button
        className="w-full"
        onClick={analyzeImages}
        disabled={selectedImages.length !== 2 || isAnalyzing}
      >
        {isAnalyzing ? "Analiz Ediliyor..." : "Analiz Et"}
      </Button>
    </div>
  );
};

export default InstagramAnalyzer;