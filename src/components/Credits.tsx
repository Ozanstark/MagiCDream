import { Coins, LogOut, LogIn } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import { Button } from "./ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Credits = () => {
  const { credits, isLoading, refreshCredits } = useCredits();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsAuthenticated(!!session);
        if (!session) {
          // Oturum yoksa credits'i sıfırla
          refreshCredits();
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      if (event === 'SIGNED_OUT') {
        refreshCredits();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [refreshCredits]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Başarılı",
        description: "Başarıyla çıkış yapıldı",
      });
      
      // Çıkış yapıldıktan sonra ana sayfaya yönlendir
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
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