import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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
    <div className="space-y-4">
      {results.map((result, index) => (
        <div key={index} className="mt-2 space-y-2 p-4 bg-background/80 backdrop-blur-sm rounded-lg">
          <div className="flex items-center justify-between">
            <p className="font-semibold">Skor: {result.score}/100</p>
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
          <p className="text-sm text-muted-foreground">{result.caption}</p>
          <p className="text-sm">{result.feedback}</p>
        </div>
      ))}
    </div>
  );
};