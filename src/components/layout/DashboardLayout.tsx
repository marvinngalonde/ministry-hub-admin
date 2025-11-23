import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onCollapseChange={setIsSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className={cn(
        "flex-1 min-h-screen transition-all duration-300 ease-in-out",
        // Desktop margins
        isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]",
        // Mobile: no margin
        "ml-0"
      )}>
        {/* Header */}
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Main content */}
        <main className="p-6 min-h-[calc(100vh-4rem)] animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};