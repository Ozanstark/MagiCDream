import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { Check, Plus, Trophy } from "lucide-react";

const FollowerQuiz = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<{
    question: string;
    correctAnswer: string;
    wrongAnswers: string[];
  }[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [wrongAnswer1, setWrongAnswer1] = useState("");
  const [wrongAnswer2, setWrongAnswer2] = useState("");
  const [wrongAnswer3, setWrongAnswer3] = useState("");
  const { toast } = useToast();

  const handleAddQuestion = () => {
    if (!currentQuestion || !correctAnswer || !wrongAnswer1) {
      toast({
        title: "Hata!",
        description: "Lütfen en az bir soru, doğru cevap ve bir yanlış cevap girin.",
        variant: "destructive",
      });
      return;
    }

    const wrongAnswers = [wrongAnswer1];
    if (wrongAnswer2) wrongAnswers.push(wrongAnswer2);
    if (wrongAnswer3) wrongAnswers.push(wrongAnswer3);

    setQuestions([...questions, {
      question: currentQuestion,
      correctAnswer,
      wrongAnswers,
    }]);

    // Reset form
    setCurrentQuestion("");
    setCorrectAnswer("");
    setWrongAnswer1("");
    setWrongAnswer2("");
    setWrongAnswer3("");

    toast({
      title: "Soru eklendi!",
      description: "Yeni soru başarıyla eklendi.",
    });
  };

  const handleCreateQuiz = async () => {
    if (questions.length === 0) {
      toast({
        title: "Hata!",
        description: "Lütfen en az bir soru ekleyin.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: quiz, error: quizError } = await supabase
        .from("follower_quizzes")
        .insert([
          {
            title,
            description,
          },
        ])
        .select()
        .single();

      if (quizError) throw quizError;

      // Add questions
      const { error: questionsError } = await supabase
        .from("quiz_questions")
        .insert(
          questions.map((q) => ({
            quiz_id: quiz.id,
            question: q.question,
            correct_answer: q.correctAnswer,
            wrong_answers: q.wrongAnswers,
          }))
        );

      if (questionsError) throw questionsError;

      toast({
        title: "Test oluşturuldu!",
        description: "Testiniz başarıyla oluşturuldu ve paylaşıma hazır.",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setQuestions([]);
      setIsCreating(false);
    } catch (error) {
      toast({
        title: "Hata!",
        description: "Test oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Takipçi Testi</CardTitle>
        </CardHeader>
        <CardContent>
          {!isCreating ? (
            <div className="space-y-4">
              <Button onClick={() => setIsCreating(true)}>Yeni Test Oluştur</Button>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Test listesi buraya gelecek */}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                <Input
                  placeholder="Test Başlığı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Test Açıklaması"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {questions.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Eklenen Sorular ({questions.length})
                  </h3>
                  <div className="space-y-2">
                    {questions.map((q, index) => (
                      <Card key={index}>
                        <CardContent className="pt-4">
                          <p className="font-medium">{index + 1}. {q.question}</p>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-green-600 flex items-center gap-1">
                              <Check className="h-4 w-4" /> {q.correctAnswer}
                            </p>
                            {q.wrongAnswers.map((wrong, idx) => (
                              <p key={idx} className="text-sm text-gray-600 ml-5">
                                {wrong}
                              </p>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Yeni Soru Ekle
                </h3>
                <div className="space-y-4">
                  <Textarea
                    placeholder="Sorunuz"
                    value={currentQuestion}
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                  />
                  <div className="space-y-4">
                    <div>
                      <Label>Doğru Cevap</Label>
                      <Input
                        placeholder="Doğru cevap"
                        value={correctAnswer}
                        onChange={(e) => setCorrectAnswer(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>Yanlış Cevaplar</Label>
                      <div className="space-y-2 mt-1">
                        <Input
                          placeholder="1. Yanlış cevap"
                          value={wrongAnswer1}
                          onChange={(e) => setWrongAnswer1(e.target.value)}
                        />
                        <Input
                          placeholder="2. Yanlış cevap (opsiyonel)"
                          value={wrongAnswer2}
                          onChange={(e) => setWrongAnswer2(e.target.value)}
                        />
                        <Input
                          placeholder="3. Yanlış cevap (opsiyonel)"
                          value={wrongAnswer3}
                          onChange={(e) => setWrongAnswer3(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <Button onClick={handleAddQuestion}>Soru Ekle</Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleCreateQuiz}>Testi Oluştur</Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  İptal
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerQuiz;