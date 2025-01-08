import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import QuizCreator from "./quiz/QuizCreator";
import QuizList from "./quiz/QuizList";
import QuizPlayer from "./quiz/QuizPlayer";

const FollowerQuiz = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);

  const handleQuizCreated = () => {
    setIsCreating(false);
  };

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuizId(quizId);
  };

  const handleQuizFinish = () => {
    setSelectedQuizId(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Takipçi Testi</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedQuizId ? (
            <QuizPlayer quizId={selectedQuizId} onFinish={handleQuizFinish} />
          ) : !isCreating ? (
            <div className="space-y-4">
              <Button onClick={() => setIsCreating(true)}>Yeni Test Oluştur</Button>
              <QuizList onQuizSelect={handleQuizSelect} />
            </div>
          ) : (
            <div className="space-y-4">
              <QuizCreator onQuizCreated={handleQuizCreated} />
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                İptal
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowerQuiz;