import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { List, Trophy, Users } from "lucide-react";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

interface Quiz {
  id: string;
  title: string;
  description: string;
  created_at: string;
  share_code: string;
  _count?: {
    questions: number;
    results: number;
  }
}

const QuizList = ({ onQuizSelect }: { onQuizSelect: (quizId: string) => void }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [shareCode, setShareCode] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      console.log("No authenticated user");
      setQuizzes([]);
      return;
    }

    const { data, error } = await supabase
      .from("follower_quizzes")
      .select(`
        *,
        quiz_questions (count),
        quiz_results (count)
      `)
      .or('user_id.eq.' + session.session.user.id + ',share_code.not.is.null');

    if (error) {
      console.error("Error loading quizzes:", error);
      toast({
        title: "Hata",
        description: "Testler yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
      return;
    }

    if (data) {
      const formattedQuizzes = data.map(quiz => ({
        ...quiz,
        _count: {
          questions: quiz.quiz_questions[0]?.count || 0,
          results: quiz.quiz_results[0]?.count || 0
        }
      }));
      setQuizzes(formattedQuizzes);
    }
  };

  const handleJoinWithCode = async () => {
    if (!shareCode.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen bir davet kodu girin.",
        variant: "destructive",
      });
      return;
    }

    const { data, error } = await supabase
      .from("follower_quizzes")
      .select()
      .eq('share_code', shareCode.trim())
      .single();

    if (error || !data) {
      toast({
        title: "Hata",
        description: "Geçersiz davet kodu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Başarılı",
      description: "Teste katılıyorsunuz...",
    });
    onQuizSelect(data.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <List className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Testler</h2>
      </div>

      <div className="flex gap-2 items-center">
        <Input
          placeholder="Davet kodunu girin"
          value={shareCode}
          onChange={(e) => setShareCode(e.target.value)}
        />
        <Button onClick={handleJoinWithCode}>
          Katıl
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{quiz.title}</span>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{quiz.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {quiz._count?.results || 0} katılımcı
                  </span>
                </div>
                <Button onClick={() => onQuizSelect(quiz.id)}>
                  Teste Katıl
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizList;