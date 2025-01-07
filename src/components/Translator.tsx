import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Globe, Languages } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { supabase } from "@/integrations/supabase/client";

const LANGUAGES = [
  { value: "tr", label: "Turkish" },
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
];

const Translator = () => {
  const [inputText, setInputText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translateText = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: {
          text: inputText,
          targetLanguage: LANGUAGES.find(lang => lang.value === targetLanguage)?.label || "English",
        },
      });

      if (error) throw error;

      setTranslatedText(data.translatedText);
      toast({
        title: "Success",
        description: "Text translated successfully!",
      });
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to translate text",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold rainbow-text tracking-tight">
          AI Dream Translator
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4 border border-primary/20 py-3 rounded-lg bg-card/50 backdrop-blur-sm">
          Translate your text to any language with AI precision. Break language barriers effortlessly.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger className="w-[200px] input-premium">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Textarea
          placeholder="Enter text to translate..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="min-h-[150px] input-premium"
        />

        <Button
          onClick={translateText}
          disabled={isLoading}
          className="w-full button-primary"
        >
          <Languages className="mr-2 h-4 w-4" />
          {isLoading ? "Translating..." : "Translate"}
        </Button>

        {translatedText && (
          <div className="mt-6 p-6 bg-card rounded-lg border border-primary/20 shadow-lg backdrop-blur-sm">
            <p className="whitespace-pre-wrap text-foreground/90">{translatedText}</p>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(translatedText);
                toast({
                  title: "Success",
                  description: "Translated text copied to clipboard",
                });
              }}
              className="mt-4"
              variant="outline"
            >
              Copy
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translator;