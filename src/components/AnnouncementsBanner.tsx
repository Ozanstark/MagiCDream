import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info, AlertCircle, Bell, AlertTriangle, RefreshCw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  is_active: boolean;
  created_at: string;
}

const getIcon = (type: string) => {
  switch (type) {
    case "important":
      return <AlertCircle className="h-5 w-5" />;
    case "maintenance":
      return <RefreshCw className="h-5 w-5" />;
    case "update":
      return <Bell className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getVariant = (type: string): "default" | "destructive" => {
  return type === "important" ? "destructive" : "default";
};

export const AnnouncementsBanner = () => {
  const { data: announcements } = useQuery<Announcement[]>({
    queryKey: ['active-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  if (!announcements?.length) return null;

  return (
    <ScrollArea className="h-auto max-h-[300px] w-full rounded-md">
      <div className="space-y-2 p-4">
        {announcements.map((announcement) => (
          <Alert
            key={announcement.id}
            variant={getVariant(announcement.type)}
            className="relative overflow-hidden"
          >
            <div className="flex items-start gap-3">
              {getIcon(announcement.type)}
              <div>
                <AlertTitle className="text-base">{announcement.title}</AlertTitle>
                <AlertDescription className="mt-1 text-sm">
                  {announcement.content}
                </AlertDescription>
                <div className="mt-2 text-xs text-muted-foreground">
                  {new Date(announcement.created_at).toLocaleString('tr-TR')}
                </div>
              </div>
            </div>
          </Alert>
        ))}
      </div>
    </ScrollArea>
  );
};