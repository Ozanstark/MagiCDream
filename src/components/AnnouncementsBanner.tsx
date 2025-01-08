import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { Bell, MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

export const AnnouncementsBanner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: announcements } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Announcement[];
    }
  });

  if (!announcements?.length) return null;

  return (
    <div className="relative">
      {!isOpen && (
        <Button
          size="sm"
          className="relative animate-glow bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle className="h-4 w-4 animate-sparkle" />
          <span className="ml-2">{announcements.length} Yeni Mesaj</span>
        </Button>
      )}

      {isOpen && (
        <div className="bg-card p-4 rounded-lg shadow-lg border max-h-[200px] min-w-[300px]">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <h3 className="font-semibold">Duyurular</h3>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </Button>
          </div>
          <ScrollArea className="h-[140px]">
            <div className="space-y-3">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="space-y-1">
                  <h4 className="font-medium text-sm">{announcement.title}</h4>
                  <p className="text-sm text-muted-foreground">{announcement.content}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(announcement.created_at).toLocaleDateString('tr-TR')}</span>
                    <span className="capitalize">{announcement.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};