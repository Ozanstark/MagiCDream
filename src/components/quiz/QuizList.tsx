import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { supabase } from "@/integrations/supabase/client";
import { List, Trophy, Users } from "lucide-react";

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

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    const { data, error } = await supabase
      .from("follower_quizzes")
      .select(`
        *,
        quiz_questions (count),
        quiz_results (count)
      `);

    if (!error && data) {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <List className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Mevcut Testler</h2>
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