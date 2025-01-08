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

const AdminPanel = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email === 'ozansurel@gmail.com') {
        setIsAdmin(true);
      }
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin) {
    return <div className="p-8">Yetkisiz erişim</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
      
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
              <CardDescription>Tüm kayıtlı kullanıcılar ve profilleri</CardDescription>
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
              <CardDescription>Son kullanıcı işlemleri ve kredi hareketleri</CardDescription>
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
              <CardDescription>Sistem hataları ve kullanıcı sorunları</CardDescription>
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
              <CardDescription>Sistem duyuruları ve bildirimler</CardDescription>
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