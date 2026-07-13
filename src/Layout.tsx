import { Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useCustomCursor } from "@/hooks/useCustomCursor";
import ExitIntentModal from "@/components/ExitIntentModal";

const queryClient = new QueryClient();

const Layout = () => {
  useCustomCursor();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <ExitIntentModal />
        <Outlet />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Layout;
