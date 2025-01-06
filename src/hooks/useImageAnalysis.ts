import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { pipeline } from "@huggingface/transformers";

export const useImageAnalysis = () => {
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
      // Try WebGPU first, fall back to WASM if not available
      const device = 'webgpu';
      console.log("Initializing feature extraction pipeline with device:", device);
      
      const extractor = await pipeline('feature-extraction', 'Xenova/vit-base-patch16-224', {
        device
      });

      console.log("Pipeline created successfully, processing image...");
      const output = await extractor(imageUrl, {
        pooling: "mean",
        normalize: true
      });
      
      console.log("Features extracted successfully");
      setFeatures(output.tolist()[0]);
      
      toast({
        title: "Success",
        description: "Image features extracted successfully!",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      
      // If WebGPU failed, try WASM
      if (error instanceof Error && error.message.includes('webgpu')) {
        try {
          console.log("WebGPU not available, falling back to WASM...");
          const extractor = await pipeline('feature-extraction', 'Xenova/vit-base-patch16-224', {
            device: 'wasm'
          });

          const output = await extractor(imageUrl, {
            pooling: "mean",
            normalize: true
          });
          
          console.log("Features extracted successfully using WASM");
          setFeatures(output.tolist()[0]);
          
          toast({
            title: "Success",
            description: "Image features extracted successfully!",
          });
          return;
        } catch (wasmError) {
          console.error('WASM fallback error:', wasmError);
        }
      }

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    selectedFile,
    imageUrl,
    isAnalyzing,
    features,
    handleFileChange,
    analyzeImage,
  };
};