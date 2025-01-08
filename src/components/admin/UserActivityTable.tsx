import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

export const UserActivityTable = () => {
  const { data: activities } = useQuery({
    queryKey: ['user-activities'],
    queryFn: async () => {
      const { data: creditLogs } = await supabase
        .from('credits_log')
        .select(`
          *,
          profiles:profiles(subscription_status)
        `)
        .order('created_at', { ascending: false })
        .limit(100);
      return creditLogs;
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
              <TableCell>{activity.action_type}</TableCell>
              <TableCell>{activity.amount}</TableCell>
              <TableCell>{new Date(activity.created_at).toLocaleString('tr-TR')}</TableCell>
              <TableCell>{activity.profiles?.subscription_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};