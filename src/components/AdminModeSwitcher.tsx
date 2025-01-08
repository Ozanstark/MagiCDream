import { Image, MessageSquareText, BookOpen, PenTool } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminModeSwitcherProps {
  mode: 'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt';
  onModeChange: (mode: 'image' | 'text' | 'tweet' | 'instagram' | 'email' | 'humanizer' | 'translator' | 'blog' | 'essay' | 'twitter-bio' | 'linkedin' | 'wedding-speech' | 'diet' | 'workout' | 'encrypt' | 'photo-encrypt') => void;
}

const AdminModeSwitcher = ({ mode, onModeChange }: AdminModeSwitcherProps) => {
  const [isAdmin, setIsAdmin] = useState(false);

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

  const modes = [
    { id: 'image', icon: Image, label: 'Admin Image Generator', showWow: true, isPremium: true },
    { id: 'text', icon: MessageSquareText, label: 'Admin Text Generator', showWow: false, isPremium: false },
    { id: 'blog', icon: BookOpen, label: 'Admin Blog Generator', showWow: false, isPremium: false },
    { id: 'essay', icon: PenTool, label: 'Admin Essay Generator', showWow: false, isPremium: false },
  ] as const;

  return (
    <div className="flex flex-col gap-2 bg-card p-4 rounded-lg shadow-lg border-2 border-red-500">
      <div className="text-sm font-semibold text-red-500 mb-2">Admin Panel</div>
      {modes.map((item) => (
        <Button
          key={item.id}
          variant={mode === item.id ? 'default' : 'outline'}
          onClick={() => onModeChange(item.id)}
          className="flex items-center justify-between w-full relative group"
        >
          <div className="flex items-center gap-2">
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </div>
          {item.isPremium && (
            <img 
              src="/lovable-uploads/6e858f00-7860-4b5f-b35a-7a25c98a71ff.png"
              alt="WOW effect"
              className="w-12 h-12 transform rotate-12 opacity-90 group-hover:scale-110 transition-transform"
            />
          )}
        </Button>
      ))}
    </div>
  );
};

export default AdminModeSwitcher;