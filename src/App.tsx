import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import TrackingPage from "./pages/TrackingPage";
import About from "./pages/About";
import ServerStatus from "./pages/ServerStatus";
import NotFound from "./pages/NotFound";
import { useKeepAlive } from "@/hooks/useKeepAlive";

const queryClient = new QueryClient();

const AppContent = () => {
  // Initialize Keep-Alive system
  const { status } = useKeepAlive({
    enabled: true,
    interval: 10 * 60 * 1000, // 10 minutes
    endpoint: '/api/health/ping',
    onSuccess: (data) => {
      console.log('🔄 Keep-Alive ping successful:', data);
    },
    onError: (error) => {
      console.warn('⚠️ Keep-Alive ping failed:', error.message);
    },
    onStatusChange: (isActive) => {
      console.log(`🔄 Keep-Alive ${isActive ? 'started' : 'stopped'}`);
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/server-status" element={<ServerStatus />} />
          <Route path="/:barcode" element={<TrackingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
