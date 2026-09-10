import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BlockchainProvider } from "@/contexts/BlockchainContext";
import { AppProvider } from "@/contexts/AppContext";
import { PageTransition } from "@/components/PageTransition";
import { ScrollToTop } from "@/components/ScrollToTop";
import { CredivirPreloader } from "@/components/CredivirPreloader";
import Index from "./pages/Index";
import AdminPortal from "./pages/AdminPortal";
import StudentPortal from "./pages/StudentPortal";
import VerifyCertificate from "./pages/VerifyCertificate";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BlockchainProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <CredivirPreloader />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <Index />
                  </PageTransition>
                }
              />
              <Route
                path="/admin"
                element={
                  <PageTransition>
                    <AdminPortal />
                  </PageTransition>
                }
              />
              <Route
                path="/student"
                element={
                  <PageTransition>
                    <StudentPortal />
                  </PageTransition>
                }
              />
              <Route
                path="/verify"
                element={
                  <PageTransition>
                    <VerifyCertificate />
                  </PageTransition>
                }
              />
              <Route
                path="*"
                element={
                  <PageTransition>
                    <NotFound />
                  </PageTransition>
                }
              />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </BlockchainProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
