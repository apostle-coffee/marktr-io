"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header, Footer } from "./components";
import Home from "./pages/Home";
import OnboardingBuild from "./pages/OnboardingBuild";
import ICPResults from "./pages/ICPResults";
import Dashboard from "./pages/Dashboard";
import ICPEditor from "./pages/ICPEditor";
import Collections from "./pages/Collections";
import CollectionView from "./pages/CollectionView";
import PaywallDemo from "./pages/PaywallDemo";
import PaymentSuccess from "./pages/PaymentSuccess";
import MyAccount from "./pages/MyAccount";
import Pricing from "./pages/Pricing";
import TeamSettings from "./pages/TeamSettings";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Routes with Header/Footer */}
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
          
          {/* Routes without Header/Footer */}
          <Route path="/onboarding-build" element={<OnboardingBuild />} />
          <Route path="/icp-results" element={<ICPResults />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/icp/:id" element={<ICPEditor />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:id" element={<CollectionView />} />
          <Route path="/paywall-demo" element={<PaywallDemo />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/team" element={<TeamSettings />} />
          
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
  );
}

