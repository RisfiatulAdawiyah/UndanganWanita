import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Wedding from "./pages/Wedding.tsx";
import Login from "./pages/Login.tsx";
import NotFound from "./pages/NotFound.tsx";
import RSVPView from "./pages/RSVPView.tsx";
import ProtectedRoute from "./components/admin/ProtectedRoute.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import RSVPManagement from "./pages/admin/RSVPManagement.tsx";
import Settings from "./pages/admin/Settings.tsx";
import WeddingInfoEditor from "./pages/admin/WeddingInfoEditor.tsx";
import GalleryManagement from "./pages/admin/GalleryManagement.tsx";
import GiftRegistryManagement from "./pages/admin/GiftRegistryManagement.tsx";
import GuestListManagement from "./pages/admin/GuestListManagement.tsx";
import LoveStoryManagement from "./pages/admin/LoveStoryManagement.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/undangan/:slug" element={<Wedding />} />
          <Route path="/rsvp-view" element={<RSVPView />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="wedding-info" element={<WeddingInfoEditor />} />
                    <Route path="love-story" element={<LoveStoryManagement />} />
                    <Route path="gallery" element={<GalleryManagement />} />
                    <Route path="gift-registry" element={<GiftRegistryManagement />} />
                    <Route path="guest-list" element={<GuestListManagement />} />
                    <Route path="rsvp" element={<RSVPManagement />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
