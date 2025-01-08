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
import { Coins, Power, PowerOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface UserProfile {
  id: string;
  subscription_status: string;
  credits: number;
  created_at: string;
  email?: string;
  is_active?: boolean;
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
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [bulkCreditAmount, setBulkCreditAmount] = useState<string>("");
  const [isBulkDialogOpen, setIsBulkDialogOpen] = useState(false);

  const { data: users, isLoading, error, refetch } = useQuery<UserProfile[]>({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: authData } = await supabase.functions.invoke('list-users', {
        method: 'GET',
      });

      const authUsers = (authData?.users || []) as AuthUser[];
      
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

      setCreditAmount("");
      setIsOpen(false);
      setSelectedUser(null);
      refetch();
    } catch (error) {
      console.error('Error adding credits:', error);
      toast({
        title: "Hata",
        description: "Kredi yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleBulkAddCredits = async () => {
    if (selectedUsers.length === 0 || !bulkCreditAmount) return;

    try {
      const amount = parseInt(bulkCreditAmount);
      
      const { data, error } = await supabase.rpc('bulk_credit_update', {
        user_ids: selectedUsers,
        credit_amount: amount
      });

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `${selectedUsers.length} kullanıcıya ${amount} kredi başarıyla yüklendi.`,
      });

      setBulkCreditAmount("");
      setIsBulkDialogOpen(false);
      setSelectedUsers([]);
      refetch();
    } catch (error) {
      console.error('Error adding bulk credits:', error);
      toast({
        title: "Hata",
        description: "Toplu kredi yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: "Başarılı",
        description: `Kullanıcı durumu ${!currentStatus ? 'aktif' : 'pasif'} olarak güncellendi.`,
      });

      refetch();
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Hata",
        description: "Kullanıcı durumu güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
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
      <div className="mb-4 flex justify-end">
        <Dialog open={isBulkDialogOpen} onOpenChange={setIsBulkDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline"
              disabled={selectedUsers.length === 0}
            >
              <Coins className="h-4 w-4 mr-2" />
              Toplu Kredi Yükle ({selectedUsers.length})
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Toplu Kredi Yükle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {selectedUsers.length} kullanıcı seçildi
                </p>
              </div>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder="Yüklenecek kredi miktarı"
                  value={bulkCreditAmount}
                  onChange={(e) => setBulkCreditAmount(e.target.value)}
                />
                <Button 
                  onClick={handleBulkAddCredits}
                  className="w-full"
                >
                  Kredi Yükle
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[400px] w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedUsers.length === users?.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedUsers(users?.map(user => user.id) || []);
                    } else {
                      setSelectedUsers([]);
                    }
                  }}
                />
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>E-posta</TableHead>
              <TableHead>Üyelik</TableHead>
              <TableHead>Krediler</TableHead>
              <TableHead>Durum</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => toggleUserSelection(user.id)}
                  />
                </TableCell>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>
                  <Badge variant={user.subscription_status === 'premium' ? 'default' : 'secondary'}>
                    {user.subscription_status}
                  </Badge>
                </TableCell>
                <TableCell>{user.credits}</TableCell>
                <TableCell>
                  <Badge variant={user.is_active ? 'default' : 'destructive'}>
                    {user.is_active ? 'Aktif' : 'Pasif'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(user.created_at).toLocaleString('tr-TR')}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
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

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserStatus(user.id, user.is_active || false)}
                    >
                      {user.is_active ? (
                        <PowerOff className="h-4 w-4 mr-2 text-red-500" />
                      ) : (
                        <Power className="h-4 w-4 mr-2 text-green-500" />
                      )}
                      {user.is_active ? 'Pasif Yap' : 'Aktif Yap'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};