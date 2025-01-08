import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthRequiredMessage = () => {
  const navigate = useNavigate();

  return (
    <Card className="p-8 max-w-2xl mx-auto mt-8 text-center space-y-6 bg-card/50 backdrop-blur-sm border border-primary/20">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Ücretsiz Hesap Oluşturun</h2>
        <p className="text-muted-foreground">
          Bu özelliği kullanmak için ücretsiz bir hesap oluşturmanız veya giriş yapmanız gerekiyor. 
          Magic Dream'in tüm özelliklerini ücretsiz kullanabilirsiniz!
        </p>
        <div className="flex flex-col gap-2">
          <Button 
            onClick={() => navigate("/login")} 
            size="lg"
            className="w-full sm:w-auto mx-auto"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Ücretsiz Giriş Yap
          </Button>
          <p className="text-sm text-muted-foreground">
            Hesabınız yok mu? Giriş sayfasından hemen ücretsiz hesap oluşturabilirsiniz.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default AuthRequiredMessage;