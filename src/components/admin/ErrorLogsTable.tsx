import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ErrorLog {
  id: string;
  error_message: string;
  error_stack: string | null;
  user_id: string | null;
  created_at: string;
}

export const ErrorLogsTable = () => {
  const { data: errorLogs } = useQuery<ErrorLog[]>({
    queryKey: ['error-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('error_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error fetching error logs:', error);
        throw error;
      }

      return data;
    }
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tarih</TableHead>
            <TableHead>Kullanıcı ID</TableHead>
            <TableHead>Hata Mesajı</TableHead>
            <TableHead>Stack Trace</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {errorLogs?.map((log) => (
            <TableRow key={log.id}>
              <TableCell>{new Date(log.created_at).toLocaleString('tr-TR')}</TableCell>
              <TableCell>{log.user_id || '-'}</TableCell>
              <TableCell className="max-w-md truncate">{log.error_message}</TableCell>
              <TableCell className="max-w-md truncate">{log.error_stack || '-'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};