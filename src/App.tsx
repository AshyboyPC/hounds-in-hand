import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Adopt from "./pages/Adopt";
import VolunteerBoard from "./pages/VolunteerBoard";
import SupplyWishlist from "./pages/SupplyWishlist";
import ShelterStories from "./pages/ShelterStories";
import Donate from "./pages/Donate";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import CommunityDashboard from "./pages/CommunityDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import ShelterDashboard from "./pages/ShelterDashboard";
import MapPage from "./pages/MapPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Partnerships from "./pages/Partnerships";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import PawLoader from "./components/PawLoader";
import { usePageLoader } from "./hooks/usePageLoader";
import { AuthProvider } from "./contexts/AuthContext";
import DashboardRedirect from "./components/DashboardRedirect";

const queryClient = new QueryClient();

const AppContent = () => {
  const { showLoader, handleLoaderComplete } = usePageLoader();

  return (
    <>
      <PawLoader isVisible={showLoader} onComplete={handleLoaderComplete} />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/adopt" element={<Adopt />} />
        <Route path="/volunteer" element={<VolunteerBoard />} />
        <Route path="/volunteer-board" element={<VolunteerBoard />} />
        <Route path="/supply-wishlist" element={<SupplyWishlist />} />
        <Route path="/stories" element={<ShelterStories />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/partnerships" element={<Partnerships />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Dashboard Routes */}
        {/* Community dashboard is accessible by ALL logged-in users (everyone is a community member) */}
        <Route
          path="/dashboard/community"
          element={
            <ProtectedRoute allowedRoles={["volunteer", "community", "shelter", "admin"]}>
              <CommunityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/volunteer"
          element={
            <ProtectedRoute allowedRoles={["volunteer", "community", "shelter", "admin"]}>
              <CommunityDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/shelter"
          element={
            <ProtectedRoute allowedRoles={["shelter", "admin"]}>
              <ShelterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["shelter", "admin"]}>
              <ShelterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect generic dashboard to role-specific dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          }
        />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
