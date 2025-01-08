import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Share2, Trash2 } from "lucide-react";
import { Progress } from "../ui/progress";
import { supabase } from "@/integrations/supabase/client";

interface ContestCardProps {
  contest: {
    id: string;
    share_code: string;
    photo1_url: string;
    photo2_url: string;
  };
  onDelete: (shareCode: string) => void;
}

export const ContestCard = ({ contest, onDelete }: ContestCardProps) => {
  const [votes, setVotes] = useState({ photo1: 0, photo2: 0 });
  const totalVotes = votes.photo1 + votes.photo2;
  const photo1Percentage = totalVotes > 0 ? (votes.photo1 / totalVotes) * 100 : 0;
  const photo2Percentage = totalVotes > 0 ? (votes.photo2 / totalVotes) * 100 : 0;

  useEffect(() => {
    const fetchVotes = async () => {
      const { data: votesData } = await supabase
        .from('photo_contest_votes')
        .select('selected_photo')
        .eq('contest_id', contest.id);

      if (votesData) {
        const photo1Votes = votesData.filter(v => v.selected_photo === 1).length;
        const photo2Votes = votesData.filter(v => v.selected_photo === 2).length;
        setVotes({ photo1: photo1Votes, photo2: photo2Votes });
      }
    };

    fetchVotes();

    const channel = supabase
      .channel('contest-votes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'photo_contest_votes',
        filter: `contest_id=eq.${contest.id}`,
      }, () => {
        fetchVotes();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [contest.id]);

  const copyShareLink = () => {
    const link = `${window.location.origin}/contest/${contest.share_code}`;
    navigator.clipboard.writeText(link);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="w-full h-32 md:h-48 relative rounded-lg overflow-hidden">
            <img 
              src={contest.photo1_url} 
              alt="Photo 1" 
              className="w-full h-full object-contain bg-black/5" 
            />
          </div>
          <Progress value={photo1Percentage} className="h-2" />
          <p className="text-center text-sm">
            {votes.photo1} oy ({photo1Percentage.toFixed(1)}%)
          </p>
        </div>
        <div className="space-y-2">
          <div className="w-full h-32 md:h-48 relative rounded-lg overflow-hidden">
            <img 
              src={contest.photo2_url} 
              alt="Photo 2" 
              className="w-full h-full object-contain bg-black/5" 
            />
          </div>
          <Progress value={photo2Percentage} className="h-2" />
          <p className="text-center text-sm">
            {votes.photo2} oy ({photo2Percentage.toFixed(1)}%)
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          onClick={copyShareLink}
          className="flex-1"
          variant="outline"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Paylaşım Linkini Kopyala
        </Button>
        <Button
          onClick={() => onDelete(contest.share_code)}
          variant="destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Toplam {totalVotes} oy
      </p>
    </div>
  );
};