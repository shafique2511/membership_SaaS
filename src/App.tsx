import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BusinessProvider } from "./context/BusinessContext";
import LandingPage from "./pages/LandingPage";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import BusinessOverview from "./pages/BusinessOverview";
import BookingManagement from "./pages/BookingManagement";
import MembershipManagement from "./pages/MembershipManagement";
import POSModule from "./pages/POSModule";
import StaffManagement from "./pages/StaffManagement";
import ServicesManagement from "./pages/ServicesManagement";
import CustomerManagement from "./pages/CustomerManagement";
import SettingsPage from "./pages/SettingsPage";
import ReportsPage from "./pages/ReportsPage";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import CustomerPortal from "./pages/CustomerPortal";
import InventoryManagement from "./pages/InventoryManagement";
import LoyaltyManagement from "./pages/LoyaltyManagement";
import { ModuleGuard } from "./components/ModuleGuard";
import { Toaster } from "@/components/ui/sonner";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
}

function BusinessRoutesWrapper({ children }: { children: React.ReactNode }) {
  const { businessId } = useParams();
  return (
    <BusinessProvider>
      {children}
    </BusinessProvider>
  );
}

function DashboardRedirect() {
  const { user, loading } = useAuth();
  const [redirectPath, setRedirectPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && user) {
      fetch("/api/businesses/my-businesses")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setRedirectPath(`/dashboard/${data[0].business.id}`);
          } else {
            setRedirectPath("/onboarding");
          }
        })
        .catch(() => setRedirectPath("/onboarding"));
    }
  }, [user, loading]);

  if (loading || !redirectPath) return <div>Loading...</div>;
  return <Navigate to={redirectPath} />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/b/:slug" element={<CustomerPortal />} />

          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardRedirect />
            </ProtectedRoute>
          } />
          
          <Route path="/admin" element={
            <ProtectedRoute>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } />

          <Route path="/dashboard/:businessId" element={
            <ProtectedRoute>
              <BusinessRoutesWrapper>
                <DashboardLayout />
              </BusinessRoutesWrapper>
            </ProtectedRoute>
          }>
            <Route index element={<BusinessOverview />} />
            
            <Route path="bookings" element={
              <ModuleGuard moduleId="booking">
                <BookingManagement />
              </ModuleGuard>
            } />
            
            <Route path="pos" element={
              <ModuleGuard moduleId="pos">
                <POSModule />
              </ModuleGuard>
            } />
            
            <Route path="staff" element={
              <ModuleGuard moduleId="staff">
                <StaffManagement />
              </ModuleGuard>
            } />
            
            <Route path="services" element={<ServicesManagement />} />
            <Route path="customers" element={<CustomerManagement />} />
            
            <Route path="reports" element={
              <ModuleGuard moduleId="reports">
                <ReportsPage />
              </ModuleGuard>
            } />
            
            <Route path="memberships" element={
              <ModuleGuard moduleId="membership">
                <MembershipManagement />
              </ModuleGuard>
            } />

            <Route path="inventory" element={
              <ModuleGuard moduleId="inventory">
                <InventoryManagement />
              </ModuleGuard>
            } />

            <Route path="loyalty" element={
              <ModuleGuard moduleId="loyalty">
                <LoyaltyManagement />
              </ModuleGuard>
            } />

            <Route path="settings" element={<SettingsPage />} />
            
            <Route path="*" element={<div>Coming Soon</div>} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}
