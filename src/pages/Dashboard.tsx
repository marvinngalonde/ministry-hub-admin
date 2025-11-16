import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Users, MessageSquare, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";

const stats = [
  {
    title: "Total Sermons",
    value: "247",
    change: "+12 this week",
    trend: "up",
    icon: Video,
  },
  {
    title: "Total Users",
    value: "1,482",
    change: "+23 this week",
    trend: "up",
    icon: Users,
  },
  {
    title: "Community Posts",
    value: "3,291",
    change: "+145 this week",
    trend: "up",
    icon: MessageSquare,
  },
  {
    title: "Total Engagement",
    value: "12.5K",
    change: "-2% from last week",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentActivity = [
  {
    type: "sermon",
    title: "New sermon uploaded: 'Faith in Trials'",
    user: "Admin User",
    time: "2 hours ago",
  },
  {
    type: "user",
    title: "New user registered: John Smith",
    user: "System",
    time: "3 hours ago",
  },
  {
    type: "post",
    title: "Community post reported",
    user: "Sarah Johnson",
    time: "5 hours ago",
  },
  {
    type: "sermon",
    title: "Sermon edited: 'The Power of Prayer'",
    user: "Admin User",
    time: "1 day ago",
  },
];

const popularContent = [
  { title: "The End Times Prophecy", views: "2,341", type: "Sermon" },
  { title: "Biblical Marriage", views: "1,892", type: "Documentary" },
  { title: "Prayer & Fasting", views: "1,654", type: "Presentation" },
  { title: "Book of Revelation Study", views: "1,432", type: "Study Guide" },
  { title: "Family Foundations", views: "1,287", type: "Podcast" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your ministry.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUp : ArrowDown;
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs flex items-center gap-1 mt-1 ${
                  stat.trend === "up" ? "text-success" : "text-destructive"
                }`}>
                  <TrendIcon className="w-3 h-3" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Content */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularContent.map((content, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{content.title}</p>
                    <p className="text-xs text-muted-foreground">{content.type}</p>
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {content.views} views
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
