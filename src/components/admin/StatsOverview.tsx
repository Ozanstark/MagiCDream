import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, TrendingDown, Minus, Users, Image, Twitter, CreditCard, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export const StatsOverview = () => {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [
        usersCount, 
        imagesCount, 
        tweetsCount, 
        creditsData, 
        previousCreditsData,
        premiumUsersCount,
        totalFeatureUsage
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('generated_images').select('*', { count: 'exact', head: true }),
        supabase.from('scheduled_tweets').select('*', { count: 'exact', head: true }),
        supabase.from('credits_log')
          .select('amount')
          .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('credits_log')
          .select('amount')
          .gt('created_at', new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString())
          .lt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('subscription_status', 'premium'),
        supabase.from('feature_usage')
          .select('feature_name, credits_used')
          .gt('used_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ]);

      const totalCreditsUsed = creditsData.data?.reduce((sum, log) => sum + (log.amount < 0 ? Math.abs(log.amount) : 0), 0) || 0;
      const previousCreditsUsed = previousCreditsData.data?.reduce((sum, log) => sum + (log.amount < 0 ? Math.abs(log.amount) : 0), 0) || 0;
      
      const creditsTrend = previousCreditsUsed === 0 ? 0 : 
        ((totalCreditsUsed - previousCreditsUsed) / previousCreditsUsed) * 100;

      // Calculate feature usage statistics
      const featureUsageStats = totalFeatureUsage.data?.reduce((acc: Record<string, number>, curr) => {
        acc[curr.feature_name] = (acc[curr.feature_name] || 0) + curr.credits_used;
        return acc;
      }, {});

      const totalFeatureCredits = Object.values(featureUsageStats || {}).reduce((sum, val) => sum + val, 0);

      // Calculate premium user percentage
      const premiumPercentage = (premiumUsersCount.count || 0) / (usersCount.count || 1) * 100;

      return {
        totalUsers: usersCount.count || 0,
        totalImages: imagesCount.count || 0,
        totalTweets: tweetsCount.count || 0,
        creditsUsed: totalCreditsUsed,
        creditsTrend,
        premiumUsers: premiumUsersCount.count || 0,
        premiumPercentage,
        featureUsageStats,
        totalFeatureCredits
      };
    }
  });

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Kullanıcı</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Premium: {stats?.premiumPercentage.toFixed(1)}%
            </div>
            <Progress value={stats?.premiumPercentage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oluşturulan Görseller</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalImages || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Kullanıcı başına: {stats?.totalUsers ? (stats.totalImages / stats.totalUsers).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planlanan Tweetler</CardTitle>
            <Twitter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalTweets || 0}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Kullanıcı başına: {stats?.totalUsers ? (stats.totalTweets / stats.totalUsers).toFixed(1) : 0}
            </div>
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
            <div className="text-xs text-muted-foreground mt-1">
              Kullanıcı başına: {stats?.totalUsers ? (stats.creditsUsed / stats.totalUsers).toFixed(1) : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Özellik Kullanımı</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.featureUsageStats && Object.entries(stats.featureUsageStats).map(([feature, credits]) => (
                <div key={feature} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{credits}</span>
                    <Progress 
                      value={(credits / (stats.totalFeatureCredits || 1)) * 100} 
                      className="w-24"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Premium Kullanıcılar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-4">
              {stats?.premiumUsers || 0}
              <span className="text-sm text-muted-foreground ml-2">kullanıcı</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Toplam Kullanıcılar</span>
                <span className="text-sm font-medium">{stats?.totalUsers || 0}</span>
              </div>
              <Progress value={stats?.premiumPercentage || 0} />
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Premium Oranı</span>
                <span className="text-sm font-medium">{stats?.premiumPercentage.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};