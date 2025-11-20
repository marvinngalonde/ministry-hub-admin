import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Video,
  Film,
  Presentation,
  BookOpen,
  Users,
  MessageSquare,
  Image as ImageIcon,
  BarChart3,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

// Grouped menu items
const menuGroups = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    ]
  },
  {
    title: "Content",
    items: [
      { icon: Video, label: "Sermons", path: "/sermons" },
      { icon: Film, label: "Documentaries", path: "/documentaries" },
      { icon: Presentation, label: "Presentations", path: "/presentations" },
      { icon: BookOpen, label: "Materials", path: "/materials" },
    ]
  },
  {
    title: "Community",
    items: [
      { icon: MessageSquare, label: "Community", path: "/community/posts" },
      { icon: Users, label: "Users", path: "/users" },
    ]
  },
  {
    title: "Media & Analytics",
    items: [
      { icon: ImageIcon, label: "Media Library", path: "/media" },
      { icon: BarChart3, label: "Analytics", path: "/analytics" },
    ]
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "Settings", path: "/settings" },
    ]
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onCollapseChange: (collapsed: boolean) => void;
}

export const Sidebar = ({ isCollapsed, onCollapseChange }: SidebarProps) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-card border-r border-border z-40 transition-all duration-300",
          "flex flex-col",
          isCollapsed ? "w-20" : "w-[280px]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "p-6 pt-2 pb-3 border-b border-border flex items-center gap-3 transition-all duration-300",
          isCollapsed && "justify-center px-2"
        )}>
          <img
            src="/logo-transparent.png"
            alt="The Final Conflict Ministry"
            className="w-10 h-10 shrink-0"
          />
          <div className={cn(
            "transition-all duration-300 overflow-hidden",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="text-lg font-bold whitespace-nowrap">The Final Conflict</h1>
            <p className="text-xs text-muted-foreground whitespace-nowrap">Ministry Admin</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto p-4 space-y-6 transition-all duration-300",
          "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/30",
          isCollapsed && "px-2"
        )}>
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {/* Group Heading - Hidden when collapsed */}
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
                  {group.title}
                </h3>
              )}

              {/* Group Items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg transition-all duration-200 group relative",
                      "hover:bg-secondary/50",
                      isActive
                        ? "bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm"
                        : "text-muted-foreground",
                      isCollapsed ? "px-3 py-3 justify-center" : "px-4 py-3"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className={cn(
                      "font-medium transition-all duration-300",
                      isCollapsed ? "w-0 opacity-0 absolute left-full ml-2" : "w-auto opacity-100"
                    )}>
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-foreground text-background text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className={cn(
          "p-4 border-t border-border transition-all duration-300",
          isCollapsed && "px-2 text-center"
        )}>
          <div className={cn(
            "text-xs text-muted-foreground transition-all duration-300 overflow-hidden",
            isCollapsed ? "h-0 opacity-0" : "h-auto opacity-100"
          )}>
            <p>Version 1.0.0</p>
            <p className="mt-1">© 2025 TFC Ministry</p>
          </div>
          {/* Mini version for collapsed state */}
          {isCollapsed && (
            <div className="text-xs text-muted-foreground">
              v1.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
};