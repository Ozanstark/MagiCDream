import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AuthRequiredMessage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6 bg-card rounded-lg border border-border/20">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-primary" />
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Giriş Yapmanız Gerekiyor</h2>
        <p className="text-muted-foreground max-w-md">
          Bu özelliği kullanabilmek için giriş yapmanız gerekmektedir. Giriş yaparak tüm özelliklere erişebilir ve kişiselleştirilmiş deneyimden faydalanabilirsiniz.
        </p>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={() => navigate("/login")}
          className="min-w-[200px]"
        >
          Giriş Yap
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Hesabınız yok mu? Giriş sayfasından hemen ücretsiz hesap oluşturabilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default AuthRequiredMessage;