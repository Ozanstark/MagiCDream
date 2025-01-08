import { Coins, LogOut, LogIn } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Credits = () => {
  const { credits, isLoading } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);

      supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(!!session);
      });
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Başarılı",
        description: "Başarıyla çıkış yapıldı",
      });
    } catch (error) {
      toast({
        title: "Hata",
        description: "Çıkış yapılırken bir hata oluştu",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 bg-card p-2 rounded-lg animate-pulse">
          <Coins className="h-4 w-4" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {isAuthenticated ? (
        <>
          <div className="flex items-center gap-2 bg-card p-2 rounded-lg transition-all duration-300">
            <Coins className="h-4 w-4" />
            <span>{credits?.toLocaleString() ?? 0} credits</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Çıkış Yap
          </Button>
        </>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/login")}
          className="w-full"
        >
          <LogIn className="h-4 w-4 mr-2" />
          Giriş Yap
        </Button>
      )}
    </div>
  );
};

export default Credits;