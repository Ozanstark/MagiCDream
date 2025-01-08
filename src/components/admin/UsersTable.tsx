import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Coins } from "lucide-react";

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

export const UsersTable = () => {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [creditAmount, setCreditAmount] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const { data: users, isLoading, error, refetch } = useQuery<UserProfile[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      // Fetch profiles
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch users from auth.users using edge function
      const { data: authData } = await supabase.functions.invoke('list-users', {
        method: 'GET',
      });

      const authUsers = (authData?.users || []) as AuthUser[];
      
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

  const handleAddCredits = async () => {
    if (!selectedUser || !creditAmount) return;

    try {
      const amount = parseInt(creditAmount);
      
      const { data, error } = await supabase.rpc('update_user_credits', {
        user_id: selectedUser.id,
        amount: amount,
        action_type: 'admin_add',
        description: 'Admin tarafından manuel kredi yükleme'
      });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${amount} kredi başarıyla yüklendi.`,
      });

      // Reset form and close dialog
      setCreditAmount("");
      setIsOpen(false);
      setSelectedUser(null);
      refetch(); // Refresh the table data
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: "Hata",
        description: "Kredi yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    console.error('Error fetching users:', error);
    return <div>Kullanıcılar yüklenirken bir hata oluştu.</div>;
  }

  return (
    <>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Üyelik</TableHead>
              <TableHead>Krediler</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>İşlemler</TableHead>
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
                <TableCell>
                  <Dialog open={isOpen && selectedUser?.id === user.id} onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                      setSelectedUser(null);
                      setCreditAmount("");
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Coins className="h-4 w-4 mr-2" />
                        Kredi Yükle
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Kredi Yükle</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Kullanıcı: {user.email}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Mevcut Kredi: {user.credits}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Input
                            type="number"
                            placeholder="Yüklenecek kredi miktarı"
                            value={creditAmount}
                            onChange={(e) => setCreditAmount(e.target.value)}
                          />
                          <Button 
                            onClick={handleAddCredits}
                            className="w-full"
                          >
                            Kredi Yükle
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};