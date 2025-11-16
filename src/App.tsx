import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./lib/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sermons from "./pages/Sermons";
import SermonNew from "./pages/SermonNew";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="sermons" element={<Sermons />} />
            <Route path="sermons/new" element={<SermonNew />} />
            <Route path="documentaries" element={<div className="text-2xl">Documentaries - Coming Soon</div>} />
            <Route path="presentations" element={<div className="text-2xl">Presentations - Coming Soon</div>} />
            <Route path="materials" element={<div className="text-2xl">Materials - Coming Soon</div>} />
            <Route path="community" element={<div className="text-2xl">Community - Coming Soon</div>} />
            <Route path="users" element={<div className="text-2xl">Users - Coming Soon</div>} />
            <Route path="media" element={<div className="text-2xl">Media Library - Coming Soon</div>} />
            <Route path="analytics" element={<div className="text-2xl">Analytics - Coming Soon</div>} />
            <Route path="settings" element={<div className="text-2xl">Settings - Coming Soon</div>} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
