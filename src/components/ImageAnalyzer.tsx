import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, Upload } from "lucide-react";
import AnalyzerHeader from "./analyzer/AnalyzerHeader";
import ImagePreview from "./analyzer/ImagePreview";
import FeaturesDisplay from "./analyzer/FeaturesDisplay";
import { useImageAnalysis } from "@/hooks/useImageAnalysis";

const ImageAnalyzer = () => {
  const {
    imageUrl,
    isAnalyzing,
    features,
    handleFileChange,
    analyzeImage,
  } = useImageAnalysis();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 px-4 sm:px-6 sm:space-y-8">
      <AnalyzerHeader
        title="Analyze Image Features"
        description="Extract powerful visual features from your images using InternViT"
      />

      <div className="space-y-4">
        <Input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
        />

        {imageUrl && (
          <div className="space-y-4">
            <ImagePreview imageUrl={imageUrl} />

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

            <FeaturesDisplay features={features} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageAnalyzer;