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
  users: {
    email: string;
  } | null;
}

const getActionLabel = (actionType: string): string => {
  const actionLabels: Record<string, string> = {
    'image': 'Görsel Oluşturma',
    'text': 'Metin Oluşturma',
    'blog': 'Blog Giriş Yazısı',
    'essay': 'Makale İnsanlaştırma',
    'twitter-bio': 'Twitter Profil Yazısı',
    'linkedin': 'LinkedIn Başlık',
    'wedding-speech': 'Düğün Konuşması',
    'diet': 'Diyet Planı',
    'workout': 'Antrenman Planı',
    'tweet': 'Tweet Oluşturma',
    'instagram': 'Instagram Analizi',
    'email': 'E-posta Oluşturma',
    'humanizer': 'Metin İnsanlaştırma',
    'translator': 'Çeviri',
    'encrypt': 'Mesaj Şifreleme',
    'photo-encrypt': 'Fotoğraf Şifreleme',
    'admin_bulk_add': 'Toplu Kredi Yükleme',
    'admin_add': 'Admin Kredi Yükleme',
    'signup_bonus': 'Kayıt Bonusu',
    'credit_consumption': 'Kredi Kullanımı'
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
          profiles (subscription_status),
          users:profiles!credits_log_user_id_profiles_fkey (email)
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
            <TableHead>E-posta</TableHead>
            <TableHead>İşlem</TableHead>
            <TableHead>Miktar</TableHead>
            <TableHead>Tarih</TableHead>
            <TableHead>Üyelik</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.users?.email || activity.user_id}</TableCell>
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