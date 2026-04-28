export type ProjectStatus = "draft" | "published";
export type ProjectMediaType = "image" | "video";

export interface PortfolioProject {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  full_description: string | null;
  cover_media_url: string;
  media_type: ProjectMediaType;
  tags: string[];
  project_url: string | null;
  repo_url: string | null;
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export type PortfolioProjectInput = Omit<
  PortfolioProject,
  "id" | "created_at" | "updated_at" | "published_at"
> & {
  published_at?: string | null;
};
