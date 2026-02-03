import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// @ts-ignore
import BlogPage from "./pages/legacy/BlogPage";
// @ts-ignore
import BlogPostPage from "./pages/legacy/BlogPostPage";
// @ts-ignore
import ServicePage from "./pages/legacy/ServicePage";

import { useCustomCursor } from "@/hooks/useCustomCursor";
import ExitIntentModal from "@/components/ExitIntentModal";

const queryClient = new QueryClient();

const App = () => {
  useCustomCursor();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ExitIntentModal />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />

            {/* Legacy Routes */}
            {/* @ts-ignore */}
            <Route path="/blog" element={<BlogPage />} />
            {/* @ts-ignore */}
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            {/* @ts-ignore */}
            <Route path="/services/:slug" element={<ServicePage />} />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
