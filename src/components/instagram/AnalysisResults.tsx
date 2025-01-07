import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Star, ThumbsUp, MessageCircle } from "lucide-react";

interface AnalysisResult {
  score: number;
  caption: string;
  feedback: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
  language: "tr" | "en";
  onLanguageChange: (value: "tr" | "en") => void;
}

export const AnalysisResults = ({
  results,
  language,
  onLanguageChange,
}: AnalysisResultsProps) => {
  if (!results.length) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Analiz Sonuçları</h3>
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tr">Türkçe</SelectItem>
            <SelectItem value="en">English</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {results.map((result, index) => (
          <Card key={index} className="bg-card/50 backdrop-blur-sm border border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Fotoğraf #{index + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 bg-background/50 p-3 rounded-lg">
                <ThumbsUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Instagram Skoru</p>
                  <p className="text-2xl font-bold">{result.score}/100</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <MessageCircle className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium">Detaylı Geri Bildirim</p>
                    <ScrollArea className="h-24 w-full rounded-md border p-2">
                      <p className="text-sm text-muted-foreground">{result.feedback}</p>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};