import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const StatsOverview = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [usersCount, imagesCount, tweetsCount, creditsData, previousCreditsData] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('generated_images').select('*', { count: 'exact', head: true }),
        supabase.from('scheduled_tweets').select('*', { count: 'exact', head: true }),
        supabase.from('credits_log')
          .select('amount')
          .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('credits_log')
          .select('amount')
          .gt('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const totalCreditsUsed = creditsData.data?.reduce((sum, log) => sum + (log.amount < 0 ? Math.abs(log.amount) : 0), 0) || 0;
      const previousCreditsUsed = previousCreditsData.data?.reduce((sum, log) => sum + (log.amount < 0 ? Math.abs(log.amount) : 0), 0) || 0;
      
      const creditsTrend = previousCreditsUsed === 0 ? 0 : 
        ((totalCreditsUsed - previousCreditsUsed) / previousCreditsUsed) * 100;

      return {
        totalUsers: usersCount.count || 0,
        totalImages: imagesCount.count || 0,
        totalTweets: tweetsCount.count || 0,
        creditsUsed: totalCreditsUsed,
        creditsTrend
      };
    }
  });

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Oluşturulan Görseller</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalImages || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Planlanan Tweetler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.totalTweets || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Kullanılan Krediler (30 gün)</CardTitle>
          <div className="flex items-center space-x-1">
            {getTrendIcon(stats?.creditsTrend || 0)}
            <span className="text-xs text-muted-foreground">
              {stats?.creditsTrend ? `${Math.abs(stats.creditsTrend).toFixed(1)}%` : '-'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats?.creditsUsed || 0}</div>
        </CardContent>
      </Card>
    </div>
  );
};