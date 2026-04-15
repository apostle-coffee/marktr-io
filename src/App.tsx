import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { PaywallProvider } from "./contexts/PaywallContext";
import { AuthModalProvider } from "./contexts/AuthModalContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminRoute } from "./components/auth/AdminRoute";
import { Header, Footer } from "./components";
import Home from "./pages/Home";
import OnboardingBuild from "./pages/OnboardingBuild";
import GuestDashboardPreview from "./pages/GuestDashboardPreview";
import Dashboard from "./pages/Dashboard";
import ICPEditor from "./pages/ICPEditor";
import MyICPsPage from "./pages/MyICPs";
import Collections from "./pages/Collections";
import CollectionView from "./pages/CollectionView";
import PaywallDemo from "./pages/PaywallDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount";
import Admin from "./pages/Admin";
import Pricing from "./pages/Pricing";
import TeamSettings from "./pages/TeamSettings";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout";
import AuthCallback from "./pages/AuthCallback";
import CheckEmail from "./pages/CheckEmail";
import BetaSignup from "./pages/BetaSignup";
import MyBrands from "./pages/MyBrands";
import BrandEditor from "./pages/BrandEditor";
import GuestIcpPreview from "./pages/GuestIcpPreview";
import Resources from "./pages/Resources";
import ResourcePost from "./pages/ResourcePost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";

const GA_MEASUREMENT_ID = "G-9E3B7RFKGH";
let lastTrackedPath: string | null = null;

function GA4RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    const pagePath = `${location.pathname}${location.search}${location.hash}`;
    if (lastTrackedPath === pagePath) return;
    lastTrackedPath = pagePath;

    const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
    if (!gtag) return;

    gtag("event", "page_view", {
      send_to: GA_MEASUREMENT_ID,
      page_title: document.title,
      page_location: window.location.href,
      page_path: pagePath,
    });
  }, [location.pathname, location.search, location.hash]);

  return null;
}

function AuthRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? "/dashboard" : "/icp-results"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <PaywallProvider>
        <AuthModalProvider>
          <Router>
            <GA4RouteTracker />
            <div className="min-h-screen bg-background">
              <Routes>
            {/* Public Routes with Header/Footer */}
            <Route path="/" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />
            
            <Route path="/pricing" element={
              <>
                <Header />
                <Pricing />
                <Footer />
              </>
            } />

            <Route path="/resources" element={
              <>
                <Header />
                <Resources />
                <Footer />
              </>
            } />

            <Route path="/resources/:slug" element={
              <>
                <Header />
                <ResourcePost />
                <Footer />
              </>
            } />

            <Route path="/privacy-policy" element={
              <>
                <Header />
                <PrivacyPolicy />
                <Footer />
              </>
            } />
            <Route path="/privacy" element={<Navigate to="/privacy-policy" replace />} />

            <Route path="/terms-of-service" element={
              <>
                <Header />
                <TermsOfService />
                <Footer />
              </>
            } />
            <Route path="/terms" element={<Navigate to="/terms-of-service" replace />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<AuthRedirect />} />
            <Route path="/signup" element={<AuthRedirect />} />
            <Route path="/beta-signup" element={<BetaSignup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/check-email" element={<CheckEmail />} />
            
            {/* Public Routes without Header/Footer */}
            <Route path="/onboarding-build" element={<OnboardingBuild />} />
          <Route path="/icp-results" element={<GuestDashboardPreview />} />
          <Route path="/icp-preview/:index" element={<GuestIcpPreview />} />
            <Route path="/paywall-demo" element={<PaywallDemo />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/icp/:id" element={
              <ProtectedRoute>
                <ICPEditor />
              </ProtectedRoute>
            } />
            <Route path="/icps" element={
              <ProtectedRoute>
                <MyICPsPage />
              </ProtectedRoute>
            } />
            <Route path="/my-brands" element={
              <ProtectedRoute>
                <MyBrands />
              </ProtectedRoute>
            } />
            <Route path="/my-brands/:id" element={
              <ProtectedRoute>
                <BrandEditor />
              </ProtectedRoute>
            } />
            <Route path="/collections" element={
              <ProtectedRoute>
                <Collections />
              </ProtectedRoute>
            } />
            <Route path="/collections/:id" element={
              <ProtectedRoute>
                <CollectionView />
              </ProtectedRoute>
            } />
            <Route path="/account" element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute>
                <TeamSettings />
              </ProtectedRoute>
            } />
            
            {/* Catch-all route for preview and other unmatched routes */}
            <Route path="*" element={
              <>
                <Header />
                <Home />
                <Footer />
              </>
            } />
              </Routes>
            </div>
          </Router>
        </AuthModalProvider>
      </PaywallProvider>
    </AuthProvider>
  );
}
