import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserActivityTable } from "@/components/admin/UserActivityTable";
import { ErrorLogsTable } from "@/components/admin/ErrorLogsTable";
import { AnnouncementsManager } from "@/components/admin/AnnouncementsManager";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const AdminPanel = () => {
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email === 'ozansurel@gmail.com') {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Hata",
          description: "Admin durumu kontrol edilirken bir hata oluştu.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [toast]);

  const handleRefresh = () => {
    setLastUpdated(new Date());
    toast({
      title: "Yenilendi",
      description: "Veriler başarıyla güncellendi.",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-lg">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bu sayfaya erişim yetkiniz bulunmamaktadır.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sistem durumu ve kullanıcı istatistikleri
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-muted-foreground">
            Son güncelleme: {lastUpdated.toLocaleString('tr-TR')}
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>
      
      <div className="mb-8">
        <StatsOverview />
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Kullanıcılar</TabsTrigger>
          <TabsTrigger value="activities">Kullanıcı Hareketleri</TabsTrigger>
          <TabsTrigger value="errors">Hata Logları</TabsTrigger>
          <TabsTrigger value="announcements">Duyurular</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcılar</CardTitle>
              <CardDescription>
                Tüm kayıtlı kullanıcılar ve profil bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Kullanıcı Hareketleri</CardTitle>
              <CardDescription>
                Son kullanıcı işlemleri ve kredi hareketleri
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserActivityTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="errors">
          <Card>
            <CardHeader>
              <CardTitle>Hata Logları</CardTitle>
              <CardDescription>
                Sistem hataları ve kullanıcı sorunları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorLogsTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements">
          <Card>
            <CardHeader>
              <CardTitle>Duyurular</CardTitle>
              <CardDescription>
                Sistem duyuruları ve bildirimler
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnnouncementsManager />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;