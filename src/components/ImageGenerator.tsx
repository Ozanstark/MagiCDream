import { useState } from "react";
import { Button } from "@/components/ui/button";

const ImageGenerator = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    setLoading(true);
    // Simulate image generation
    setTimeout(() => {
      setImage("https://example.com/generated-image.png");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight text-glow-effect">
          Unleash Your Imagination
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Transform your wildest dreams into stunning visuals. Where words become reality, and imagination knows no bounds.
        </p>
      </div>
      <div className="flex justify-center">
        <Button onClick={generateImage} className="bg-primary text-primary-foreground hover:bg-primary/90">
          Generate Image
        </Button>
      </div>
      {loading && <p className="text-center">Loading...</p>}
      {image && <img src={image} alt="Generated" className="w-full h-auto" />}
    </div>
  );
};

export default ImageGenerator;
