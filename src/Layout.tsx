import { Outlet, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import CursorSystem from "@/system/CursorSystem";
import RouteTransition from "@/system/RouteTransition";
import BootOverlay from "@/system/BootOverlay";
import CommandBar from "@/system/CommandBar";
import StatusBar from "@/system/StatusBar";
import SiteFooter from "@/system/SiteFooter";

const queryClient = new QueryClient();

// O terminal do estudio: barra de comando em cima, programa (rota) no meio,
// barra de status embaixo. A area /admin roda sem o chrome publico.
const Layout = () => {
  useSmoothScroll();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <CursorSystem />
        {isAdmin ? (
          <Outlet />
        ) : (
          <>
            <BootOverlay />
            <RouteTransition />
            <CommandBar />
            <main className="pt-[var(--bar-h)]">
              <Outlet />
            </main>
            <SiteFooter />
            <StatusBar />
          </>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default Layout;
