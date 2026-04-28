-- Portfolio Studio schema (V1)
-- Run in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null default 'Projeto',
  short_description text not null,
  full_description text,
  cover_media_url text not null,
  media_type text not null check (media_type in ('image', 'video')),
  tags text[] not null default '{}',
  project_url text,
  repo_url text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  display_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_portfolio_projects_status
  on public.portfolio_projects(status);

create index if not exists idx_portfolio_projects_display_order
  on public.portfolio_projects(display_order, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_portfolio_projects_updated_at on public.portfolio_projects;
create trigger trg_portfolio_projects_updated_at
before update on public.portfolio_projects
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "Admins can read admin_users" on public.admin_users;
create policy "Admins can read admin_users"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read published projects" on public.portfolio_projects;
create policy "Public can read published projects"
on public.portfolio_projects
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all projects" on public.portfolio_projects;
create policy "Admins can read all projects"
on public.portfolio_projects
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can insert projects" on public.portfolio_projects;
create policy "Admins can insert projects"
on public.portfolio_projects
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update projects" on public.portfolio_projects;
create policy "Admins can update projects"
on public.portfolio_projects
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete projects" on public.portfolio_projects;
create policy "Admins can delete projects"
on public.portfolio_projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  104857600,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
)
on conflict (id) do nothing;

drop policy if exists "Public can view portfolio media" on storage.objects;
create policy "Public can view portfolio media"
on storage.objects
for select
to public
using (bucket_id = 'portfolio-media');

drop policy if exists "Admins can upload portfolio media" on storage.objects;
create policy "Admins can upload portfolio media"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can update portfolio media" on storage.objects;
create policy "Admins can update portfolio media"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
)
with check (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

drop policy if exists "Admins can delete portfolio media" on storage.objects;
create policy "Admins can delete portfolio media"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-media'
  and exists (
    select 1
    from public.admin_users admins
    where admins.user_id = auth.uid()
  )
);

-- After creating your first auth user, register it as admin:
-- insert into public.admin_users (user_id) values ('YOUR_AUTH_USER_UUID');
