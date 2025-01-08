import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CreditLog {
  id: string;
  user_id: string;
  action_type: string;
  amount: number;
  created_at: string;
  description: string | null;
  profiles: {
    subscription_status: string;
  } | null;
}

const getActionLabel = (actionType: string): string => {
  const actionLabels: Record<string, string> = {
    'image': 'Image Generator',
    'text': 'Text Generator',
    'blog': 'Blog Intro Generator',
    'essay': 'Essay Humanizer',
    'twitter-bio': 'Twitter Bio Generator',
    'linkedin': 'LinkedIn Headline Generator',
    'wedding-speech': 'Wedding Speech Generator',
    'diet': 'Diet Plan Generator',
    'workout': 'Workout Plan Generator',
    'tweet': 'Tweet Generator',
    'instagram': 'Instagram Analysis',
    'email': 'Email Generator',
    'humanizer': 'AI Paragraph Humanizer',
    'translator': 'AI Translator',
    'encrypt': 'Message Encryption',
    'photo-encrypt': 'Photo Encryption',
    'admin_bulk_add': 'Admin Kredi Yükleme',
    'signup_bonus': 'Kayıt Bonusu',
  };

  return actionLabels[actionType] || actionType;
};

export const UserActivityTable = () => {
  const { data: activities } = useQuery<CreditLog[]>({
    queryKey: ['user-activities'],
    queryFn: async () => {
      const { data: creditLogs, error } = await supabase
        .from('credits_log')
        .select(`
          id,
          user_id,
          action_type,
          amount,
          created_at,
          description,
          profiles:profiles(subscription_status)
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching credit logs:', error);
        throw error;
      }

      return (creditLogs || []) as CreditLog[];
    }
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kullanıcı ID</TableHead>
            <TableHead>İşlem</TableHead>
            <TableHead>Miktar</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Üyelik</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.user_id}</TableCell>
              <TableCell>{getActionLabel(activity.action_type)}</TableCell>
              <TableCell>{activity.amount}</TableCell>
              <TableCell>{new Date(activity.created_at).toLocaleString('tr-TR')}</TableCell>
              <TableCell>{activity.profiles?.subscription_status || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};