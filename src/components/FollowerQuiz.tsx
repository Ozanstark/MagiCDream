import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FollowerQuiz = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const { toast } = useToast();

  const handleCreateQuiz = async () => {
    try {
      const { data: quiz, error } = await supabase
        .from("follower_quizzes")
        .insert([
          {
            title,
            description,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Test oluşturuldu!",
        description: "Şimdi sorularınızı ekleyebilirsiniz.",
      });

      // Reset form
      setTitle("");
      setDescription("");
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
              <div className="flex gap-2">
                <Button onClick={handleCreateQuiz}>Oluştur</Button>
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