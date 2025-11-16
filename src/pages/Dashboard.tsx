import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, MessageSquare, FileText, Film, BookOpen, Radio, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  // Fetch real data from Supabase
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [sermons, documentaries, presentations, materials, users, posts] = await Promise.all([
        supabase.from('sermons').select('*', { count: 'exact', head: true }),
        supabase.from('documentaries').select('*', { count: 'exact', head: true }),
        supabase.from('presentations').select('*', { count: 'exact', head: true }),
        supabase.from('spiritual_materials').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }),
      ]);

      return {
        sermons: sermons.count || 0,
        documentaries: documentaries.count || 0,
        presentations: presentations.count || 0,
        materials: materials.count || 0,
        users: users.count || 0,
        posts: posts.count || 0,
        totalContent: (sermons.count || 0) + (documentaries.count || 0) + (presentations.count || 0) + (materials.count || 0),
      };
    },
  });

  const statCards = [
    {
      title: "Total Sermons",
      value: stats?.sermons || 0,
      icon: Video,
      color: "text-blue-500",
      link: "/sermons",
    },
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "text-green-500",
      link: "/users",
    },
    {
      title: "Community Posts",
      value: stats?.posts || 0,
      icon: MessageSquare,
      color: "text-purple-500",
      link: "/community/posts",
    },
    {
      title: "Total Content",
      value: stats?.totalContent || 0,
      icon: FileText,
      color: "text-orange-500",
      link: "/analytics",
    },
  ];

  const contentBreakdown = [
    { title: "Sermons", count: stats?.sermons || 0, icon: Video, color: "bg-blue-500", link: "/sermons" },
    { title: "Documentaries", count: stats?.documentaries || 0, icon: Film, color: "bg-purple-500", link: "/documentaries" },
    { title: "Presentations", count: stats?.presentations || 0, icon: Radio, color: "bg-green-500", link: "/presentations" },
    { title: "Materials", count: stats?.materials || 0, icon: BookOpen, color: "bg-orange-500", link: "/materials" },
  ];

  const quickActions = [
    { title: "Upload Sermon", link: "/sermons/new", icon: Video },
    { title: "Upload Documentary", link: "/documentaries/new", icon: Film },
    { title: "Upload Presentation", link: "/presentations/new", icon: Radio },
    { title: "Upload Material", link: "/materials/new", icon: BookOpen },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your ministry's content.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link key={stat.title} to={stat.link}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click to view details
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Content Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contentBreakdown.map((content) => {
                const Icon = content.icon;
                return (
                  <Link key={content.title} to={content.link}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full ${content.color} flex items-center justify-center`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{content.title}</p>
                          <p className="text-xs text-muted-foreground">View all items</p>
                        </div>
                      </div>
                      <div className="text-2xl font-bold">{content.count}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.link}>
                    <Button variant="outline" className="w-full justify-start h-auto py-4">
                      <Icon className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">Create new content</p>
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started - Only show if no content */}
      {stats?.totalContent === 0 && (
        <Card className="border-dashed border-2">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No content yet</h3>
              <p className="text-muted-foreground mb-6">
                Start by uploading your first sermon, documentary, presentation, or material.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/sermons/new">
                  <Button>Upload Sermon</Button>
                </Link>
                <Link to="/documentaries/new">
                  <Button variant="outline">Upload Documentary</Button>
                </Link>
                <Link to="/presentations/new">
                  <Button variant="outline">Upload Presentation</Button>
                </Link>
                <Link to="/materials/new">
                  <Button variant="outline">Upload Material</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
