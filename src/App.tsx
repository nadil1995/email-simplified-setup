
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

const queryClient = new QueryClient();

// Simple check for admin status - this should be replaced with proper auth logic
const isAdmin = false; // This should come from your auth system

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/platform-integration" element={<PlatformIntegration />} />
          <Route path="/manage-accounts" element={<ManageAccounts />} />
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
