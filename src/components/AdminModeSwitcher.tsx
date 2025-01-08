import { Image, MessageSquareText, Twitter, Instagram, Mail, FileText, Globe, Crown, BookOpen, PenTool, UserCircle, Linkedin, Heart, Salad, Dumbbell, Lock } from "lucide-react";
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
    <div className="fixed right-4 top-4 flex flex-col gap-2 bg-card p-4 rounded-lg shadow-lg border-2 border-red-500">
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
            <Crown className="h-4 w-4 text-yellow-500" />
          )}
        </Button>
      ))}
    </div>
  );
};

export default AdminModeSwitcher;