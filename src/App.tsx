
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import PlatformIntegration from "./pages/PlatformIntegration";
import ManageAccounts from "./pages/ManageAccounts";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Pricing from "./pages/Pricing";

const queryClient = new QueryClient();

// Simple check for admin status - this should be replaced with proper auth logic
const isAdmin = false;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected routes - require authentication */}
          <Route path="/setup" element={
            <ProtectedRoute>
              <Setup />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/platform-integration" element={
            <ProtectedRoute>
              <PlatformIntegration />
            </ProtectedRoute>
          } />
          <Route path="/manage-accounts" element={
            <ProtectedRoute>
              <ManageAccounts />
            </ProtectedRoute>
          } />
          
          {/* Admin route */}
          <Route 
            path="/admin" 
            element={isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />} 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
