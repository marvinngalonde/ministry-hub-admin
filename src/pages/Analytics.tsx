import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { BarChart3, Users, FileText, Film } from 'lucide-react';

export default function Analytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const [sermons, users, posts, documentaries, presentations, materials] = await Promise.all([
        supabase.from('sermons').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }),
        supabase.from('documentaries').select('*', { count: 'exact', head: true }),
        supabase.from('presentations').select('*', { count: 'exact', head: true }),
        supabase.from('spiritual_materials').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalSermons: sermons.count || 0,
        totalUsers: users.count || 0,
        totalPosts: posts.count || 0,
        totalDocumentaries: documentaries.count || 0,
        totalPresentations: presentations.count || 0,
        totalMaterials: materials.count || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Overview of your ministry's content and community</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
              <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">Total Sermons</h3>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{stats?.totalSermons || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
              <p className="text-3xl font-bold mt-1">{stats?.totalUsers || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Community Posts</h3>
              <p className="text-3xl font-bold mt-1">{stats?.totalPosts || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Film className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Documentaries</h3>
              <p className="text-3xl font-bold mt-1">{stats?.totalDocumentaries || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-100 dark:bg-pink-900 rounded-lg">
              <BarChart3 className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Presentations</h3>
              <p className="text-3xl font-bold mt-1">{stats?.totalPresentations || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Spiritual Materials</h3>
              <p className="text-3xl font-bold mt-1">{stats?.totalMaterials || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Content Distribution</h2>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Sermons</span>
              <span className="text-sm text-muted-foreground">{stats?.totalSermons || 0}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${((stats?.totalSermons || 0) / Math.max(stats?.totalSermons || 1, stats?.totalDocumentaries || 1, stats?.totalPresentations || 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Documentaries</span>
              <span className="text-sm text-muted-foreground">{stats?.totalDocumentaries || 0}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-orange-600 h-2 rounded-full"
                style={{
                  width: `${((stats?.totalDocumentaries || 0) / Math.max(stats?.totalSermons || 1, stats?.totalDocumentaries || 1, stats?.totalPresentations || 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Presentations</span>
              <span className="text-sm text-muted-foreground">{stats?.totalPresentations || 0}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-pink-600 h-2 rounded-full"
                style={{
                  width: `${((stats?.totalPresentations || 0) / Math.max(stats?.totalSermons || 1, stats?.totalDocumentaries || 1, stats?.totalPresentations || 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
