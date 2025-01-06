import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface InstagramScoreDisplayProps {
  score: number | null;
  feedback: string | null;
}

const InstagramScoreDisplay = ({ score, feedback }: InstagramScoreDisplayProps) => {
  if (!score && !feedback) return null;

  return (
    <div className="space-y-2 p-4 border rounded-lg bg-card">
      {score && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Instagram Score:</span>
          <Badge variant={score > 75 ? "default" : score > 50 ? "secondary" : "destructive"}>
            {score}/100
          </Badge>
        </div>
      )}
      {feedback && (
        <ScrollArea className="h-24">
          <p className="text-sm text-muted-foreground">{feedback}</p>
        </ScrollArea>
      )}
    </div>
  );
};

export default InstagramScoreDisplay;