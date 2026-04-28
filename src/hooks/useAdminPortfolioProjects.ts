import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { PortfolioProject, PortfolioProjectInput } from "@/types/portfolio";

const ADMIN_PROJECTS_QUERY_KEY = ["portfolio-projects-admin"];

const fetchAllProjects = async (): Promise<PortfolioProject[]> => {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as PortfolioProject[];
};

export const useAdminPortfolioProjects = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ADMIN_PROJECTS_QUERY_KEY,
    queryFn: fetchAllProjects,
    staleTime: 10_000,
  });

  const refresh = async () => {
    await queryClient.invalidateQueries({ queryKey: ADMIN_PROJECTS_QUERY_KEY });
    await queryClient.invalidateQueries({ queryKey: ["portfolio-projects-public"] });
  };

  const createProject = async (payload: PortfolioProjectInput) => {
    if (!supabase) throw new Error("Supabase nao configurado.");
    const { error } = await supabase.from("portfolio_projects").insert(payload);
    if (error) throw error;
    await refresh();
  };

  const updateProject = async (id: string, payload: Partial<PortfolioProjectInput>) => {
    if (!supabase) throw new Error("Supabase nao configurado.");
    const { error } = await supabase.from("portfolio_projects").update(payload).eq("id", id);
    if (error) throw error;
    await refresh();
  };

  const deleteProject = async (id: string) => {
    if (!supabase) throw new Error("Supabase nao configurado.");
    const { error } = await supabase.from("portfolio_projects").delete().eq("id", id);
    if (error) throw error;
    await refresh();
  };

  const uploadMedia = async (file: File, userId: string) => {
    if (!supabase) throw new Error("Supabase nao configurado.");

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
    const path = `${userId}/${Date.now()}-${safeName}`;

    const { error } = await supabase.storage
      .from("portfolio-media")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data } = supabase.storage.from("portfolio-media").getPublicUrl(path);
    return data.publicUrl;
  };

  return {
    projects: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? "Erro ao carregar projetos do studio." : null,
    createProject,
    updateProject,
    deleteProject,
    uploadMedia,
    refresh,
  };
};
