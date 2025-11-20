import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-0 h-screen z-40">
        <Sidebar 
          isCollapsed={isSidebarCollapsed} 
          onCollapseChange={setIsSidebarCollapsed} 
        />
      </div>
      
      {/* Main content area */}
      <div className={cn(
        "flex-1 min-h-screen transition-all duration-300",
        isSidebarCollapsed ? "lg:pl-20" : "lg:pl-[280px]"
      )}>
        {/* Fixed Header */}
        <div className={cn(
          "fixed top-0 right-0 z-30 transition-all duration-300",
          isSidebarCollapsed ? "lg:left-20" : "lg:left-[280px]"
        )}>
          <Header 
            isSidebarCollapsed={isSidebarCollapsed}
            onSidebarToggle={handleSidebarToggle}
          />
        </div>
        
        {/* Main content with padding to account for fixed header */}
        <main className="pt-16 p-6 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};