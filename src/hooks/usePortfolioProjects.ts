import { useQuery } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { PortfolioProject } from "@/types/portfolio";

const PORTFOLIO_QUERY_KEY = ["portfolio-projects-public"];

const fetchPublishedProjects = async (): Promise<PortfolioProject[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as PortfolioProject[];
};

export const usePortfolioProjects = () => {
  const query = useQuery({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: fetchPublishedProjects,
    staleTime: 30_000,
  });

  return {
    projects: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Erro ao carregar projetos curados." : null,
    isConfigured: isSupabaseConfigured,
    refetch: query.refetch,
  };
};
