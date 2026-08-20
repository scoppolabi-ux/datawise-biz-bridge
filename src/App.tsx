import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CookiePolicy from "./pages/CookiePolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AICommerceLabPage from "./pages/AICommerceLabPage";
import WcmMissionControl from "./pages/WcmMissionControl";
import WcmProjectsPage from "./pages/WcmProjectsPage";
import WcmNeedsPage from "./pages/WcmNeedsPage";
import WcmDocumentsToReadPage from "./pages/WcmDocumentsToReadPage";
import WcmProjectDetail from "./pages/WcmProjectDetail";
import WcmLearningPage from "./pages/WcmLearningPage";
import WcmDocumentationPage from "./pages/WcmDocumentationPage";
import WcmAuthGate from "./components/wcm/WcmAuthGate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/ai-commerce-lab" element={<AICommerceLabPage />} />
            <Route path="/wcm" element={<WcmAuthGate><WcmMissionControl /></WcmAuthGate>} />
            <Route path="/wcm/projects" element={<WcmAuthGate><WcmProjectsPage /></WcmAuthGate>} />
            <Route path="/wcm/needs" element={<WcmAuthGate><WcmNeedsPage /></WcmAuthGate>} />
            <Route path="/wcm/documents" element={<WcmAuthGate><WcmDocumentsToReadPage /></WcmAuthGate>} />
            <Route path="/wcm/learning" element={<WcmAuthGate><WcmLearningPage /></WcmAuthGate>} />
            <Route path="/wcm/:projectId" element={<WcmAuthGate><WcmProjectDetail /></WcmAuthGate>} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
