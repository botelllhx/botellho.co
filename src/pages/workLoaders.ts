import type { LoaderFunctionArgs } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { PortfolioProject } from "@/types/portfolio";

export interface WorksLoaderData {
  projects: PortfolioProject[];
  configured: boolean;
}

export interface WorkCaseLoaderData {
  project: PortfolioProject | null;
  configured: boolean;
}

// Roda no build (SSG) e no client (navegacao). Sem Supabase configurado, retorna vazio.
export async function worksLoader(): Promise<WorksLoaderData> {
  if (!isSupabaseConfigured || !supabase) {
    return { projects: [], configured: false };
  }
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .order("updated_at", { ascending: false });

  if (error) {
    return { projects: [], configured: true };
  }
  return { projects: (data ?? []) as PortfolioProject[], configured: true };
}

export async function workCaseLoader({ params }: LoaderFunctionArgs): Promise<WorkCaseLoaderData> {
  const slug = params.slug;
  if (!slug || !isSupabaseConfigured || !supabase) {
    return { project: null, configured: isSupabaseConfigured };
  }
  const { data, error } = await supabase
    .from("portfolio_projects")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return { project: null, configured: true };
  }
  return { project: (data as PortfolioProject | null) ?? null, configured: true };
}
