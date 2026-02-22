import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ReactNode } from "react";
import LandingPage from "./pages/LandingPage";
import Index from "./pages/Index";
import NarrativeLP from "./pages/NarrativeLP";
import EbookIndex from "./pages/EbookIndex";
import EbookChapter from "./pages/EbookChapter";
import AppEbookIndex from "./pages/app/AppEbookIndex";
import EbookPDF from "./pages/EbookPDF";
import NotFound from "./pages/NotFound";
import AppLogin from "./pages/app/AppLogin";
import AppWelcome from "./pages/app/AppWelcome";
import AppInstall from "./pages/app/AppInstall";
import AppDashboard from "./pages/app/AppDashboard";
import AppHowItWorks from "./pages/app/AppHowItWorks";
import CoverCompare from "./pages/CoverCompare";
import AppEbookReader from "./pages/app/AppEbookReader";
import CrisisHub from "./pages/app/CrisisHub";
import AnchorDynamic from "./pages/app/dynamics/AnchorDynamic";
import BreathingDynamic from "./pages/app/dynamics/BreathingDynamic";
import BodyMapDynamic from "./pages/app/dynamics/BodyMapDynamic";
import ReleaseDynamic from "./pages/app/dynamics/ReleaseDynamic";
import InversionDynamic from "./pages/app/dynamics/InversionDynamic";
import DynamicsHistory from "./pages/app/dynamics/DynamicsHistory";
import AppCalendar from "./pages/app/AppCalendar";
import AppPulse from "./pages/app/AppPulse";
import AdminGuard from "./components/admin/AdminGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminMetrics from "./pages/admin/AdminMetrics";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminMessages from "./pages/admin/AdminMessages";
import AppInbox from "./pages/app/AppInbox";
import AppProfile from "./pages/app/AppProfile";
import FunilLigacao from "./pages/FunilLigacao";
import AccessPending from "./pages/app/AccessPending";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

/** Guard: requires auth + active access. Admins bypass access check. */
const AccessGuard = ({ children }: { children: ReactNode }) => {
  const { user, loading, accessStatus, accessLoading, isAdmin, adminLoading } = useAuth();
  const location = useLocation();

  if (loading || accessLoading || adminLoading) return null;

  if (!user) {
    sessionStorage.setItem("redirectAfterAuth", location.pathname);
    return <Navigate to="/" replace />;
  }

  // Admins always pass
  if (isAdmin) return <>{children}</>;

  if (accessStatus !== "active") {
    return <Navigate to="/app/acesso-pendente" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/venda" element={<LandingPage />} />
            <Route path="/ligacao" element={<FunilLigacao />} />
            <Route path="/lp-original" element={<Index />} />
            <Route path="/experiencia" element={<NarrativeLP />} />
            <Route path="/ebook" element={<EbookIndex />} />
            <Route path="/ebook/pdf" element={<EbookPDF />} />
            <Route path="/ebook/:parte" element={<EbookChapter />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app/login" element={<AppLogin />} />
            <Route path="/app/acesso-pendente" element={<AccessPending />} />
            <Route path="/app/bemvindo" element={<AccessGuard><AppWelcome /></AccessGuard>} />
            <Route path="/app/instalar" element={<AccessGuard><AppInstall /></AccessGuard>} />
            <Route path="/app/dashboard" element={<AccessGuard><AppDashboard /></AccessGuard>} />
            <Route path="/app/como-funciona" element={<AccessGuard><AppHowItWorks /></AccessGuard>} />
            <Route path="/app/ebook" element={<AccessGuard><AppEbookIndex /></AccessGuard>} />
            <Route path="/app/ebook/:parte" element={<AccessGuard><AppEbookReader /></AccessGuard>} />
            <Route path="/app/calendario" element={<AccessGuard><AppCalendar /></AccessGuard>} />
            <Route path="/app/pulso" element={<AccessGuard><AppPulse /></AccessGuard>} />
            <Route path="/app/dinamicas" element={<AccessGuard><CrisisHub /></AccessGuard>} />
            <Route path="/app/dinamicas/ancora" element={<AccessGuard><AnchorDynamic /></AccessGuard>} />
            <Route path="/app/dinamicas/respiracao" element={<AccessGuard><BreathingDynamic /></AccessGuard>} />
            <Route path="/app/dinamicas/mapa-corpo" element={<AccessGuard><BodyMapDynamic /></AccessGuard>} />
            <Route path="/app/dinamicas/soltar" element={<AccessGuard><ReleaseDynamic /></AccessGuard>} />
            <Route path="/app/dinamicas/inverter" element={<AccessGuard><InversionDynamic /></AccessGuard>} />
            <Route path="/app/dinamicas/historico" element={<AccessGuard><DynamicsHistory /></AccessGuard>} />
            <Route path="/app/inbox" element={<AccessGuard><AppInbox /></AccessGuard>} />
            <Route path="/app/perfil" element={<AccessGuard><AppProfile /></AccessGuard>} />
            <Route path="/cover-compare" element={<CoverCompare />} />

            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<AdminUsers />} />
              <Route path="metricas" element={<AdminMetrics />} />
              <Route path="mensagens" element={<AdminMessages />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
