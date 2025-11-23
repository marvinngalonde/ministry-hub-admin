import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Film, Loader2, MessageSquare, Plus, Radio, TrendingUp, Users, Video } from "lucide-react";
import { Link } from "react-router-dom";

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
      gradient: "from-blue-500 to-blue-600",
      link: "/sermons",
      description: "Spiritual teachings",
    },
    {
      title: "Total Users",
      value: stats?.users || 0,
      icon: Users,
      gradient: "from-green-500 to-green-600",
      link: "/users",
      description: "Community members",
    },
    {
      title: "Community Posts",
      value: stats?.posts || 0,
      icon: MessageSquare,
      gradient: "from-purple-500 to-purple-600",
      link: "/community/posts",
      description: "Active discussions",
    },
    {
      title: "Total Content",
      value: stats?.totalContent || 0,
      icon: FileText,
      gradient: "from-orange-500 to-orange-600",
      link: "/analytics",
      description: "All media items",
    },
  ];

  const contentBreakdown = [
    {
      title: "Sermons",
      count: stats?.sermons || 0,
      icon: Video,
      color: "bg-blue-500/10 text-blue-500",
      link: "/sermons",
      description: "Spiritual teachings and messages"
    },
    {
      title: "Documentaries",
      count: stats?.documentaries || 0,
      icon: Film,
      color: "bg-purple-500/10 text-purple-500",
      link: "/documentaries",
      description: "Educational documentaries"
    },
    {
      title: "Presentations",
      count: stats?.presentations || 0,
      icon: Radio,
      color: "bg-green-500/10 text-green-500",
      link: "/presentations",
      description: "Slides and presentations"
    },
    {
      title: "Materials",
      count: stats?.materials || 0,
      icon: BookOpen,
      color: "bg-orange-500/10 text-orange-500",
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
      color: "hover:border-blue-500/50 hover:bg-blue-500/5"
    },
    {
      title: "Upload Documentary",
      link: "/documentaries/new",
      icon: Film,
      description: "Add educational content",
      color: "hover:border-purple-500/50 hover:bg-purple-500/5"
    },
    {
      title: "Upload Presentation",
      link: "/presentations/new",
      icon: Radio,
      description: "Add slides or talk",
      color: "hover:border-green-500/50 hover:bg-green-500/5"
    },
    {
      title: "Upload Material",
      link: "/materials/new",
      icon: BookOpen,
      description: "Add study resources",
      color: "hover:border-orange-500/50 hover:bg-orange-500/5"
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gradient">Dashboard</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Welcome back! Here's an overview of your ministry's content and activity.
          </p>
        </div>
        <Badge variant="outline" className="w-fit px-4 py-2 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          Real-time Analytics
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link key={stat.title} to={stat.link}>
              <div className="premium-card rounded-2xl p-6 relative overflow-hidden group cursor-pointer">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity group-hover:opacity-20`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-full border border-white/5">
                      +2.5%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                    <div className="text-3xl font-bold text-foreground tracking-tight">
                      {stat.value.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground/80">{stat.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content Breakdown */}
        <div className="lg:col-span-2">
          <div className="glass-panel rounded-2xl p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">Content Breakdown</h2>
            </div>

            <div className="grid gap-4">
              {contentBreakdown.map((content) => {
                const Icon = content.icon;
                return (
                  <Link key={content.title} to={content.link}>
                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${content.color} flex items-center justify-center shadow-inner`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{content.title}</p>
                          <p className="text-sm text-muted-foreground">{content.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{content.count.toLocaleString()}</div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-panel rounded-2xl p-6 h-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Plus className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </div>

          <div className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.title} to={action.link} className="block">
                  <div className={`p-4 rounded-xl border border-white/5 bg-white/5 transition-all duration-300 group ${action.color}`}>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-background/50 group-hover:scale-110 transition-transform">
                        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Platform Overview */}
          <div className="mt-8 p-5 rounded-xl bg-gradient-to-br from-card to-card/50 border border-white/5">
            <h4 className="font-medium text-sm mb-4 text-muted-foreground uppercase tracking-wider">Platform Overview</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Media Items</span>
                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10">{stats?.totalContent || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Community Members</span>
                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10">{stats?.users || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Discussions</span>
                <Badge variant="secondary" className="bg-white/5 hover:bg-white/10">{stats?.posts || 0}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {stats?.totalContent === 0 && (
        <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-white/10">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <FileText className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Welcome to Your Ministry Dashboard</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Get started by uploading your first piece of content. Share sermons, documentaries, presentations, and study materials with your community.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/sermons/new">
                <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                  <Video className="w-5 h-5" />
                  Upload Sermon
                </Button>
              </Link>
              <Link to="/documentaries/new">
                <Button variant="outline" size="lg" className="gap-2">
                  <Film className="w-5 h-5" />
                  Upload Documentary
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;