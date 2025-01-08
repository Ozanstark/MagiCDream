import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "./ui/scroll-area";
import { Bell } from "lucide-react";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
}

export const AnnouncementsBanner = () => {
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
    <div className="bg-card p-4 rounded-lg shadow-lg border max-h-[200px]">
      <div className="flex items-center gap-2 mb-2">
        <Bell className="h-4 w-4" />
        <h3 className="font-semibold">Duyurular</h3>
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
  );
};