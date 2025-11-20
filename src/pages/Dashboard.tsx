import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, MessageSquare, FileText, Film, BookOpen, Radio, Loader2, Plus, TrendingUp, Eye, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950/20",
      borderColor: "border-blue-200 dark:border-blue-800",
      link: "/sermons",
      description: "Spiritual teachings",
    },
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950/20",
      borderColor: "border-green-200 dark:border-green-800",
      link: "/users",
      description: "Community members",
    },
    {
      title: "Community Posts",
      value: stats?.posts || 0,
      icon: MessageSquare,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950/20",
      borderColor: "border-purple-200 dark:border-purple-800",
      link: "/community/posts",
      description: "Active discussions",
    },
    {
      title: "Total Content",
      value: stats?.totalContent || 0,
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950/20",
      borderColor: "border-orange-200 dark:border-orange-800",
      link: "/analytics",
      description: "All media items",
    },
  ];

  const contentBreakdown = [
    { 
      title: "Sermons", 
      count: stats?.sermons || 0, 
      icon: Video, 
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      textColor: "text-blue-600",
      link: "/sermons",
      description: "Spiritual teachings and messages"
    },
    { 
      title: "Documentaries", 
      count: stats?.documentaries || 0, 
      icon: Film, 
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      textColor: "text-purple-600",
      link: "/documentaries",
      description: "Educational documentaries"
    },
    { 
      title: "Presentations", 
      count: stats?.presentations || 0, 
      icon: Radio, 
      color: "bg-gradient-to-br from-green-500 to-green-600",
      textColor: "text-green-600",
      link: "/presentations",
      description: "Slides and presentations"
    },
    { 
      title: "Materials", 
      count: stats?.materials || 0, 
      icon: BookOpen, 
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      textColor: "text-orange-600",
      link: "/materials",
      description: "Study materials and resources"
    },
  ];

  const quickActions = [
    { 
      title: "Upload Sermon", 
      link: "/sermons/new", 
      icon: Video,
      description: "Add new spiritual teaching",
      color: "hover:border-blue-300 dark:hover:border-blue-700"
    },
    { 
      title: "Upload Documentary", 
      link: "/documentaries/new", 
      icon: Film,
      description: "Add educational content",
      color: "hover:border-purple-300 dark:hover:border-purple-700"
    },
    { 
      title: "Upload Presentation", 
      link: "/presentations/new", 
      icon: Radio,
      description: "Add slides or talk",
      color: "hover:border-green-300 dark:hover:border-green-700"
    },
    { 
      title: "Upload Material", 
      link: "/materials/new", 
      icon: BookOpen,
      description: "Add study resources",
      color: "hover:border-orange-300 dark:hover:border-orange-700"
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's an overview of your ministry's content and activity.
          </p>
        </div>
        <Badge variant="secondary" className="w-fit">
          <TrendingUp className="w-3 h-3 mr-1" />
          Real-time Analytics
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link key={stat.title} to={stat.link}>
              <Card className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border ${stat.borderColor} hover:scale-[1.02]`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">
                        {stat.title}
                      </p>
                      <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Breakdown */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Content Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentBreakdown.map((content) => {
                  const Icon = content.icon;
                  return (
                    <Link key={content.title} to={content.link}>
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:shadow-md transition-all duration-200 cursor-pointer group hover:bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl ${content.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{content.title}</p>
                            <p className="text-sm text-muted-foreground">{content.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{content.count.toLocaleString()}</div>
                          <div className={`text-xs font-medium ${content.textColor}`}>
                            View all →
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.title} to={action.link}>
                    <Button 
                      variant="outline" 
                      className={`w-full justify-start h-auto py-4 px-4 border-2 group transition-all duration-200 ${action.color} hover:shadow-sm`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="p-2 rounded-lg bg-muted group-hover:scale-110 transition-transform">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">{action.title}</p>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </div>
                        <Plus className="w-4 h-4 text-muted-foreground group-hover:scale-110 transition-transform" />
                      </div>
                    </Button>
                  </Link>
                );
              })}
            </div>

            {/* Additional Stats */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-3">Platform Overview</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Media Items</span>
                  <span className="font-medium">{stats?.totalContent || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Community Members</span>
                  <span className="font-medium">{stats?.users || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Discussions</span>
                  <span className="font-medium">{stats?.posts || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State */}
      {stats?.totalContent === 0 && (
        <Card className="border-dashed border-2 bg-muted/20">
          <CardContent className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Your Ministry Dashboard</h3>
              <p className="text-muted-foreground mb-6">
                Get started by uploading your first piece of content. Share sermons, documentaries, presentations, and study materials with your community.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/sermons/new">
                  <Button className="gap-2">
                    <Video className="w-4 h-4" />
                    Upload Sermon
                  </Button>
                </Link>
                <Link to="/documentaries/new">
                  <Button variant="outline" className="gap-2">
                    <Film className="w-4 h-4" />
                    Upload Documentary
                  </Button>
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