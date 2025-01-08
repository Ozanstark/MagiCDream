import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  subscription_status: string;
  credits: number;
  created_at: string;
  email?: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

// Create an admin client with service role
const adminAuthClient = createClient(
  "https://trglajrtkmquwnuxwckk.supabase.co",
  // Using service role key for admin operations
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZ2xhanJ0a21xdXdudXh3Y2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNjEyNDc4NywiZXhwIjoyMDUxNzAwNzg3fQ.vvYNzRx_6EXk6IQqUbHFVXs_zHJ2V1qYM6xGVkS8Yzw",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const UsersTable = () => {
  const { data: users } = useQuery<UserProfile[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch users from auth.users using admin client
      const { data: authData } = await adminAuthClient.auth.admin.listUsers();
      const authUsers = authData?.users as AuthUser[] || [];
      
      // Combine profile data with email addresses
      const usersWithEmail = profiles?.map(profile => {
        const authUser = authUsers.find(user => user.id === profile.id);
        return {
          ...profile,
          email: authUser?.email
        };
      });

      return usersWithEmail || [];
    }
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>E-posta</TableHead>
            <TableHead>Üyelik</TableHead>
            <TableHead>Krediler</TableHead>
            <TableHead>Kayıt Tarihi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.email || '-'}</TableCell>
              <TableCell>
                <Badge variant={user.subscription_status === 'premium' ? 'default' : 'secondary'}>
                  {user.subscription_status}
                </Badge>
              </TableCell>
              <TableCell>{user.credits}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleString('tr-TR')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};