import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2, Upload } from "lucide-react";
import { pipeline } from "@huggingface/transformers";

const ImageAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [features, setFeatures] = useState<number[] | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setFeatures(null);
    }
  };

  const analyzeImage = async () => {
    if (!imageUrl) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Use the ONNX version of the model specifically designed for web browsers
      const extractor = await pipeline('feature-extraction', 'Xenova/dinov2-base', {
        quantized: true,
        device: 'webgpu'
      });

      // Extract features using the pipeline directly with the image URL
      const output = await extractor(imageUrl, {
        pooling: "mean",
        normalize: true
      });
      
      setFeatures(output.tolist()[0]);
      
      toast({
        title: "Success",
        description: "Image features extracted successfully!",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <div className="text-center space-y-4 sm:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight leading-tight">
          Analyze Image Features
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-3 sm:px-4 border border-primary/20 py-2 sm:py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Extract powerful visual features from your images using Facebook's DinoV2 model
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />

        {imageUrl && (
          <div className="space-y-4">
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
              <img
                src={imageUrl}
                alt="Selected"
                className="w-full h-full object-contain bg-black/50"
              />
            </div>

            <Button
              onClick={analyzeImage}
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
                  Extract Features
                </>
              )}
            </Button>

            {features && (
              <div className="p-4 rounded-lg border border-border bg-card/50">
                <h3 className="font-semibold mb-2">Extracted Features:</h3>
                <div className="max-h-40 overflow-y-auto">
                  <pre className="text-xs">
                    {JSON.stringify(features, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;