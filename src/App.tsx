import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin imports
import AdminLayout from "./admin/components/AdminLayout";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/AdminDashboard";
import ToolsManagement from "./admin/pages/ToolsManagement";
import Analytics from "./admin/pages/Analytics";
import UserManagement from "./admin/pages/UserManagement";
import ContentManagement from "./admin/pages/ContentManagement";
import SystemSettings from "./admin/pages/SystemSettings";

const queryClient = new QueryClient();

// Debug component to log current route
const RouteDebugger = () => {
  const location = useLocation();
  useEffect(() => {
    console.log('Current route:', location.pathname, location.hash);
  }, [location]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <RouteDebugger />
        <Routes>
          {/* 前台路由 */}
          <Route path="/" element={<Index />} />
          
          {/* 后台路由 */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="tools" element={
              <ProtectedRoute requiredPermission="tools:read">
                <ToolsManagement />
              </ProtectedRoute>
            } />
            <Route path="analytics" element={
              <ProtectedRoute requiredPermission="analytics:read">
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="users" element={
              <ProtectedRoute requiredPermission="users:read">
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="content" element={
              <ProtectedRoute requiredPermission="content:read">
                <ContentManagement />
              </ProtectedRoute>
            } />
            <Route path="settings" element={
              <ProtectedRoute requiredPermission="settings:read">
                <SystemSettings />
              </ProtectedRoute>
            } />
            <Route index element={<AdminDashboard />} />
          </Route>
          
          {/* 404 页面 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
