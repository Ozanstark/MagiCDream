import { Shield } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminModeSwitcher = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'ozansurel@gmail.com') {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin) return null;

  return (
    <div className="bg-card p-2 rounded-lg shadow-lg border-2 border-red-500">
      <Button
        variant="outline"
        className="flex items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
        onClick={() => navigate('/admin')}
      >
        <Shield className="h-5 w-5" />
        <span>Admin Panel</span>
      </Button>
    </div>
  );
};

export default AdminModeSwitcher;