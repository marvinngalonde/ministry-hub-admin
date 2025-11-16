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
import SermonEdit from "./pages/SermonEdit";
import Documentaries from "./pages/Documentaries";
import DocumentaryNew from "./pages/DocumentaryNew";
import DocumentaryEdit from "./pages/DocumentaryEdit";
import Presentations from "./pages/Presentations";
import PresentationNew from "./pages/PresentationNew";
import PresentationEdit from "./pages/PresentationEdit";
import Materials from "./pages/Materials";
import MaterialNew from "./pages/MaterialNew";
import MaterialEdit from "./pages/MaterialEdit";
import CommunityPosts from "./pages/CommunityPosts";
import CommunityGroups from "./pages/CommunityGroups";
import Users from "./pages/Users";
import MediaLibrary from "./pages/MediaLibrary";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import DebugDatabase from "./pages/DebugDatabase";

const queryClient = new QueryClient();

const App = () => {
  console.log('🚀 Ministry Admin App Loading...');
  console.log('📍 Current URL:', window.location.href);
  console.log('🔐 Authenticated:', localStorage.getItem('isAuthenticated'));

  return (
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

            {/* Sermons */}
            <Route path="sermons" element={<Sermons />} />
            <Route path="sermons/new" element={<SermonNew />} />
            <Route path="sermons/:id/edit" element={<SermonEdit />} />

            {/* Documentaries */}
            <Route path="documentaries" element={<Documentaries />} />
            <Route path="documentaries/new" element={<DocumentaryNew />} />
            <Route path="documentaries/:id/edit" element={<DocumentaryEdit />} />

            {/* Presentations */}
            <Route path="presentations" element={<Presentations />} />
            <Route path="presentations/new" element={<PresentationNew />} />
            <Route path="presentations/:id/edit" element={<PresentationEdit />} />

            {/* Materials */}
            <Route path="materials" element={<Materials />} />
            <Route path="materials/new" element={<MaterialNew />} />
            <Route path="materials/:id/edit" element={<MaterialEdit />} />

            {/* Community */}
            <Route path="community/posts" element={<CommunityPosts />} />
            <Route path="community/groups" element={<CommunityGroups />} />

            {/* Users */}
            <Route path="users" element={<Users />} />

            {/* Media Library */}
            <Route path="media" element={<MediaLibrary />} />

            {/* Analytics */}
            <Route path="analytics" element={<Analytics />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Debug */}
            <Route path="debug" element={<DebugDatabase />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
