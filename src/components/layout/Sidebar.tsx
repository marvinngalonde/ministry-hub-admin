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
} from "lucide-react";

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
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ isCollapsed, onCollapseChange, isMobileOpen, onMobileClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen z-50 transition-all duration-300 ease-in-out",
          "bg-card/95 backdrop-blur-xl border-r border-white/10 shadow-2xl",
          "flex flex-col",
          // Width logic
          isCollapsed ? "w-20" : "w-[280px]",
          // Mobile transform logic
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "h-16 flex items-center border-b border-white/10 transition-all duration-300",
          isCollapsed ? "justify-center px-0" : "px-6 gap-3"
        )}>
          <img
            src="/logo-transparent.png"
            alt="TFC"
            className="w-8 h-8 shrink-0 object-contain"
          />
          <div className={cn(
            "transition-all duration-300 overflow-hidden whitespace-nowrap",
            isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-yellow-200 bg-clip-text text-transparent">
              Ministry Hub
            </h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto py-6 space-y-6",
          "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20",
          isCollapsed ? "px-3" : "px-4"
        )}>
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-2">
              {/* Group Heading */}
              {!isCollapsed && (
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-4 mb-2">
                  {group.title}
                </h3>
              )}

              {/* Group Items */}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
                      isCollapsed ? "justify-center p-3" : "px-4 py-3",
                      isActive
                        ? "bg-primary/20 text-primary shadow-[0_0_20px_rgba(212,175,55,0.15)] border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                    )}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
                    )}
                    
                    <Icon className={cn(
                      "w-5 h-5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "group-hover:text-white"
                    )} />
                    
                    <span className={cn(
                      "font-medium transition-all duration-300",
                      isCollapsed ? "w-0 opacity-0 absolute left-full ml-2" : "w-auto opacity-100"
                    )}>
                      {item.label}
                    </span>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-4 px-3 py-1.5 bg-popover text-popover-foreground text-sm font-medium rounded-lg shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-[60] pointer-events-none">
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
          "p-4 border-t border-white/10 bg-black/20",
          isCollapsed && "px-2 text-center"
        )}>
          <div className={cn(
            "text-xs text-muted-foreground transition-all duration-300",
            isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          )}>
            <p>© 2025 TFC Ministry</p>
          </div>
          {isCollapsed && (
            <div className="text-[10px] text-muted-foreground font-mono">
              v1.0
            </div>
          )}
        </div>
      </aside>
    </>
  );
};