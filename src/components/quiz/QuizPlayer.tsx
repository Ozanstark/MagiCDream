import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Trophy } from "lucide-react";

interface Question {
  id: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
}

interface Quiz {
  id: string;
  title: string;
  description: string;
}

const QuizPlayer = ({ quizId, onFinish }: { quizId: string; onFinish: () => void }) => {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadQuizData();
  }, [quizId]);

  const loadQuizData = async () => {
    const { data: quizData } = await supabase
      .from("follower_quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (quizData) {
      setQuiz(quizData);

      const { data: questionsData } = await supabase
        .from("quiz_questions")
        .select("*")
        .eq("quiz_id", quizId);

      if (questionsData) {
        setQuestions(questionsData);
      }
    }
  };

  const handleAnswer = async () => {
    if (!selectedAnswer) {
      toast({
        title: "Hata!",
        description: "Lütfen bir cevap seçin.",
        variant: "destructive",
      });
      return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer("");
    } else {
      const finalScore = selectedAnswer === currentQuestion.correct_answer ? score + 1 : score;
      
      await supabase
        .from("quiz_results")
        .insert([{
          quiz_id: quizId,
          score: finalScore,
        }]);

      setIsFinished(true);
      setScore(finalScore);
    }
  };

  if (!quiz || questions.length === 0) {
    return <div>Yükleniyor...</div>;
  }

  if (isFinished) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Test Tamamlandı!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Toplam {questions.length} sorudan {score} tanesini doğru cevapladınız.
          </p>
          <p className="text-lg font-semibold">
            Başarı oranınız: {Math.round((score / questions.length) * 100)}%
          </p>
          <Button onClick={onFinish}>Ana Sayfaya Dön</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const answers = [currentQuestion.correct_answer, ...currentQuestion.wrong_answers]
    .sort(() => Math.random() - 0.5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{quiz.title}</CardTitle>
        <p className="text-sm text-gray-500">
          Soru {currentQuestionIndex + 1} / {questions.length}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{currentQuestion.question}</div>
        
        <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={answer} id={`answer-${index}`} />
              <Label htmlFor={`answer-${index}`}>{answer}</Label>
            </div>
          ))}
        </RadioGroup>

        <Button onClick={handleAnswer} className="w-full">
          {currentQuestionIndex === questions.length - 1 ? "Testi Bitir" : "Sonraki Soru"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuizPlayer;