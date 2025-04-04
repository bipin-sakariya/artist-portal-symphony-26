
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Artists from "./pages/Artists";
import EditArtist from "./pages/EditArtist";
import Bookings from "./pages/Bookings";
import Analytics from "./pages/Analytics";
import ArtistDashboard from "./pages/ArtistDashboard";
import ArtistProfile from "./pages/ArtistProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/edit/:id" element={<EditArtist />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/artist-dashboard" element={<ArtistDashboard />} />
            <Route path="/artist-profile" element={<ArtistProfile />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
