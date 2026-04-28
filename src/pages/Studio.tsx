import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, LogOut, Pencil, Plus, Save, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { useSupabaseSession } from "@/hooks/useSupabaseSession";
import { useAdminPortfolioProjects } from "@/hooks/useAdminPortfolioProjects";
import type { PortfolioProject, PortfolioProjectInput } from "@/types/portfolio";

const emptyForm: PortfolioProjectInput = {
  slug: "",
  title: "",
  category: "Projeto",
  short_description: "",
  full_description: "",
  cover_media_url: "",
  media_type: "image",
  tags: [],
  project_url: "",
  repo_url: "",
  status: "draft",
  featured: false,
  display_order: 0,
  published_at: null,
};

const Studio = () => {
  const { session, loading: sessionLoading } = useSupabaseSession();
  const { projects, loading, createProject, updateProject, deleteProject, uploadMedia } =
    useAdminPortfolioProjects();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [form, setForm] = useState<PortfolioProjectInput>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");

  useEffect(() => {
    if (!session?.user?.id || !supabase) {
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      setCheckingAdmin(true);
      const { data, error } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        setIsAdmin(false);
        toast.error("Nao foi possivel validar acesso administrativo.");
      } else {
        setIsAdmin(Boolean(data));
      }
      setCheckingAdmin(false);
    };

    checkAdmin();
  }, [session?.user?.id]);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.display_order !== b.display_order) return a.display_order - b.display_order;
        return a.title.localeCompare(b.title);
      }),
    [projects],
  );

  const resetForm = () => {
    setEditingProjectId(null);
    setForm(emptyForm);
    setTagsInput("");
  };

  const fillForm = (project: PortfolioProject) => {
    setEditingProjectId(project.id);
    setForm({
      slug: project.slug,
      title: project.title,
      category: project.category,
      short_description: project.short_description,
      full_description: project.full_description ?? "",
      cover_media_url: project.cover_media_url,
      media_type: project.media_type,
      tags: project.tags ?? [],
      project_url: project.project_url ?? "",
      repo_url: project.repo_url ?? "",
      status: project.status,
      featured: project.featured,
      display_order: project.display_order,
      published_at: project.published_at,
    });
    setTagsInput((project.tags ?? []).join(", "));
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setEmail("");
    setPassword("");
    toast.success("Login realizado.");
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    toast.success("Sessao encerrada.");
    resetForm();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextTags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const payload: PortfolioProjectInput = {
      ...form,
      slug: form.slug.trim(),
      title: form.title.trim(),
      category: form.category.trim() || "Projeto",
      short_description: form.short_description.trim(),
      full_description: form.full_description?.trim() || null,
      cover_media_url: form.cover_media_url.trim(),
      project_url: form.project_url?.trim() || null,
      repo_url: form.repo_url?.trim() || null,
      tags: nextTags,
      published_at: form.status === "published" ? form.published_at ?? new Date().toISOString() : null,
    };

    if (!payload.slug || !payload.title || !payload.short_description || !payload.cover_media_url) {
      toast.error("Preencha os campos obrigatorios.");
      return;
    }

    setSaving(true);
    try {
      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        toast.success("Projeto atualizado.");
      } else {
        await createProject(payload);
        toast.success("Projeto criado.");
      }
      resetForm();
    } catch (error) {
      toast.error("Erro ao salvar projeto.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Deseja remover este projeto?");
    if (!confirmed) return;

    try {
      await deleteProject(id);
      if (editingProjectId === id) resetForm();
      toast.success("Projeto removido.");
    } catch {
      toast.error("Erro ao remover projeto.");
    }
  };

  const handleStatusToggle = async (project: PortfolioProject) => {
    try {
      const nextStatus = project.status === "published" ? "draft" : "published";
      await updateProject(project.id, {
        status: nextStatus,
        published_at: nextStatus === "published" ? new Date().toISOString() : null,
      });
      toast.success(nextStatus === "published" ? "Projeto publicado." : "Projeto movido para rascunho.");
    } catch {
      toast.error("Erro ao atualizar status.");
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    const isVideo = file.type.startsWith("video/");
    const isImage = file.type.startsWith("image/");
    if (!isVideo && !isImage) {
      toast.error("Envie apenas imagem ou video.");
      return;
    }

    setUploading(true);
    try {
      const publicUrl = await uploadMedia(file, session.user.id);
      setForm((prev) => ({
        ...prev,
        cover_media_url: publicUrl,
        media_type: isVideo ? "video" : "image",
      }));
      toast.success("Midia enviada com sucesso.");
    } catch {
      toast.error("Falha no upload.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-3xl rounded border border-border p-8">
          <h1 className="text-3xl font-display font-bold mb-4">Studio indisponivel</h1>
          <p className="text-muted-foreground">
            Configure <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> para ativar
            a area privada.
          </p>
        </div>
      </main>
    );
  }

  if (sessionLoading || checkingAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-primary px-6 py-16">
        <div className="mx-auto max-w-md rounded border border-primary-foreground/20 bg-primary p-8 text-primary-foreground">
          <h1 className="text-3xl font-display font-bold mb-2">Studio</h1>
          <p className="mb-8 text-primary-foreground/70">Acesso privado para gestao do portfolio.</p>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="bg-primary-foreground text-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                className="bg-primary-foreground text-primary"
              />
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-3xl rounded border border-border p-8">
          <h1 className="text-3xl font-display font-bold mb-4">Acesso negado</h1>
          <p className="text-muted-foreground mb-6">
            Seu usuario autenticado nao esta cadastrado na tabela <code>admin_users</code>.
          </p>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">(studio)</p>
            <h1 className="text-2xl font-display font-bold">Gestao de Portfolio</h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded border border-border p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-display font-semibold">
              {editingProjectId ? "Editar projeto" : "Novo projeto"}
            </h2>
            {editingProjectId ? (
              <Button variant="ghost" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" /> Novo
              </Button>
            ) : null}
          </div>

          <form className="space-y-4" onSubmit={handleSave}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Titulo *</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value.toLowerCase() }))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Input
                  id="category"
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (separadas por virgula)</Label>
                <Input id="tags" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descricao curta *</Label>
              <textarea
                id="shortDescription"
                value={form.short_description}
                onChange={(e) => setForm((prev) => ({ ...prev, short_description: e.target.value }))}
                rows={3}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Descricao completa</Label>
              <textarea
                id="fullDescription"
                value={form.full_description ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, full_description: e.target.value }))}
                rows={5}
                className="w-full rounded border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="projectUrl">URL do projeto</Label>
                <Input
                  id="projectUrl"
                  value={form.project_url ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, project_url: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repoUrl">URL do repositorio</Label>
                <Input
                  id="repoUrl"
                  value={form.repo_url ?? ""}
                  onChange={(e) => setForm((prev) => ({ ...prev, repo_url: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, status: e.target.value as PortfolioProject["status"] }))
                  }
                  className="h-10 w-full rounded border border-input bg-background px-3 text-sm"
                >
                  <option value="draft">Rascunho</option>
                  <option value="published">Publicado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayOrder">Ordem de exibicao</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={form.display_order}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, display_order: Number.parseInt(e.target.value || "0", 10) }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="coverMediaUrl">URL da capa *</Label>
                <Input
                  id="coverMediaUrl"
                  value={form.cover_media_url}
                  onChange={(e) => setForm((prev) => ({ ...prev, cover_media_url: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mediaType">Tipo de midia</Label>
                <select
                  id="mediaType"
                  value={form.media_type}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, media_type: e.target.value as PortfolioProject["media_type"] }))
                  }
                  className="h-10 w-full rounded border border-input bg-background px-3 text-sm"
                >
                  <option value="image">Imagem</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaUpload">Upload de midia</Label>
              <div className="flex items-center gap-3">
                <Input id="mediaUpload" type="file" accept="image/*,video/*" onChange={handleUpload} />
                <Button type="button" variant="outline" disabled={uploading}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm((prev) => ({ ...prev, featured: e.target.checked }))}
              />
              Projeto em destaque
            </label>

            <Button type="submit" disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : editingProjectId ? (
                <Save className="mr-2 h-4 w-4" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {editingProjectId ? "Salvar alteracoes" : "Criar projeto"}
            </Button>
          </form>
        </section>

        <section className="rounded border border-border p-6">
          <h2 className="mb-6 text-xl font-display font-semibold">Projetos cadastrados</h2>
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : sortedProjects.length === 0 ? (
            <p className="text-muted-foreground">Nenhum projeto cadastrado ainda.</p>
          ) : (
            <div className="space-y-4">
              {sortedProjects.map((project) => (
                <article key={project.id} className="rounded border border-border p-4">
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <h3 className="font-semibold">{project.title}</h3>
                    <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                      {project.status}
                    </span>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{project.short_description}</p>
                  <div className="mb-3 flex flex-wrap gap-2">
                    {(project.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded bg-secondary px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => fillForm(project)}>
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusToggle(project)}>
                      {project.status === "published" ? "Despublicar" : "Publicar"}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="mr-2 h-3.5 w-3.5" /> Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default Studio;
