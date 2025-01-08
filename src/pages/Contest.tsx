import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ImagePlus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Contest = () => {
  const { shareCode } = useParams();
  const [contest, setContest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [votingDisabled, setVotingDisabled] = useState(false);
  const [voteStats, setVoteStats] = useState({ photo1: 0, photo2: 0, total: 0 });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchContest();
  }, [shareCode]);

  useEffect(() => {
    if (contest) {
      fetchVoteStats();
    }
  }, [contest, votingDisabled]);

  const fetchContest = async () => {
    try {
      const { data, error } = await supabase
        .from('photo_contests')
        .select('*')
        .eq('share_code', shareCode)
        .single();

      if (error) throw error;
      setContest(data);
    } catch (error) {
      console.error('Error fetching contest:', error);
      toast({
        title: "Hata",
        description: "Yarışma bulunamadı",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchVoteStats = async () => {
    try {
      const { data: votes, error } = await supabase
        .from('photo_contest_votes')
        .select('selected_photo')
        .eq('contest_id', contest.id);

      if (error) throw error;

      const photo1Votes = votes.filter(v => v.selected_photo === 1).length;
      const photo2Votes = votes.filter(v => v.selected_photo === 2).length;
      const totalVotes = votes.length;

      setVoteStats({
        photo1: totalVotes > 0 ? (photo1Votes / totalVotes) * 100 : 0,
        photo2: totalVotes > 0 ? (photo2Votes / totalVotes) * 100 : 0,
        total: totalVotes
      });
    } catch (error) {
      console.error('Error fetching vote stats:', error);
    }
  };

  const handleVote = async (selectedPhoto: number) => {
    try {
      const { error } = await supabase
        .from('photo_contest_votes')
        .insert({
          contest_id: contest.id,
          selected_photo: selectedPhoto,
          voter_ip: await fetch('https://api.ipify.org?format=json')
            .then(res => res.json())
            .then(data => data.ip)
        });

      if (error) throw error;

      setVotingDisabled(true);
      toast({
        title: "Başarılı",
        description: "Oyunuz kaydedildi!",
      });
      
      // Fetch updated stats immediately after voting
      fetchVoteStats();
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: "Hata",
        description: "Oy verirken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin">Loading...</div>
      </div>
    );
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Yarışma Bulunamadı</h1>
          <p className="text-muted-foreground">
            Bu yarışma mevcut değil veya sona ermiş olabilir.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Fotoğraf Yarışması</h1>
          <p className="text-muted-foreground">
            Hangi fotoğrafı daha çok beğendiniz? Oy verin!
          </p>
          {voteStats.total > 0 && (
            <p className="text-sm text-muted-foreground">
              Toplam {voteStats.total} oy kullanıldı
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[contest.photo1_url, contest.photo2_url].map((photo, index) => (
            <div key={index} className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {(votingDisabled || contest.user_id) && (
                <div className="space-y-2">
                  <Progress value={index === 0 ? voteStats.photo1 : voteStats.photo2} />
                  <p className="text-center text-sm text-muted-foreground">
                    {Math.round(index === 0 ? voteStats.photo1 : voteStats.photo2)}%
                  </p>
                </div>
              )}
              <Button
                onClick={() => handleVote(index + 1)}
                disabled={votingDisabled}
                className="w-full"
              >
                {votingDisabled ? "Oy Verildi!" : "Bu Fotoğrafa Oy Ver"}
              </Button>
            </div>
          ))}
        </div>

        {votingDisabled && (
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-semibold">Siz de bir yarışma başlatın!</h2>
              <p className="text-muted-foreground">
                Kendi fotoğraf yarışmanızı oluşturun ve arkadaşlarınızın oylarını toplayın.
                Hangi fotoğrafınızın daha çok beğenileceğini öğrenin!
              </p>
              <Button
                onClick={() => navigate("/")}
                className="bg-primary hover:bg-primary/90"
              >
                <ImagePlus className="w-5 h-5 mr-2" />
                Yarışma Oluştur
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Contest;