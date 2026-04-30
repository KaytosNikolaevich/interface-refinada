-- =====================================================================
-- ABC Aventura — Schema completo do banco de dados (PostgreSQL/Supabase)
-- =====================================================================
-- Execute este arquivo no SQL Editor do Supabase / Lovable Cloud.
-- Ele cria: extensões, enums, tabelas, índices, RLS, funções e triggers.
-- Idempotente: pode ser executado múltiplas vezes sem erro.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Extensões
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 2. Enums
-- ---------------------------------------------------------------------
do $$ begin
  create type public.app_role as enum ('admin', 'user');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.exercise_type as enum (
    'multiple_choice', 'matching', 'spelling', 'listening', 'speaking', 'drag_drop'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.difficulty_level as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- 3. Função utilitária: updated_at automático
-- ---------------------------------------------------------------------
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 4. Tabela: profiles (dados públicos da criança)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null default 'Aventureiro',
  avatar text not null default '🧑',
  age int check (age between 3 and 15),
  total_score int not null default 0,
  current_streak int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles públicos para leitura" on public.profiles;
create policy "Profiles públicos para leitura"
  on public.profiles for select
  using (true);

drop policy if exists "Usuário cria seu profile" on public.profiles;
create policy "Usuário cria seu profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza seu profile" on public.profiles;
create policy "Usuário atualiza seu profile"
  on public.profiles for update
  using (auth.uid() = user_id);

drop policy if exists "Usuário deleta seu profile" on public.profiles;
create policy "Usuário deleta seu profile"
  on public.profiles for delete
  using (auth.uid() = user_id);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------
-- 5. Tabela: user_roles (controle de acesso, separado do profile)
-- ---------------------------------------------------------------------
create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- Security definer: evita recursão em policies
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  );
$$;

drop policy if exists "Usuário vê seus papéis" on public.user_roles;
create policy "Usuário vê seus papéis"
  on public.user_roles for select
  using (auth.uid() = user_id or public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins gerenciam papéis" on public.user_roles;
create policy "Admins gerenciam papéis"
  on public.user_roles for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ---------------------------------------------------------------------
-- 6. Catálogo de conteúdo: modules → lessons → exercises
-- ---------------------------------------------------------------------
create table if not exists public.modules (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon text,
  color text,
  order_index int not null default 0,
  difficulty public.difficulty_level not null default 'easy',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  slug text not null,
  title text not null,
  content jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (module_id, slug)
);

create table if not exists public.exercises (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  module_id uuid references public.modules(id) on delete cascade,
  type public.exercise_type not null,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_answer jsonb not null,
  hint text,
  points int not null default 10,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.stories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  cover_image text,
  pages jsonb not null default '[]'::jsonb,
  difficulty public.difficulty_level not null default 'easy',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.modules   enable row level security;
alter table public.lessons   enable row level security;
alter table public.exercises enable row level security;
alter table public.stories   enable row level security;

-- Catálogo é público para leitura; admin gerencia.
do $$
declare t text;
begin
  foreach t in array array['modules','lessons','exercises','stories'] loop
    execute format('drop policy if exists "Catálogo público leitura" on public.%I;', t);
    execute format(
      'create policy "Catálogo público leitura" on public.%I for select using (true);', t
    );
    execute format('drop policy if exists "Admin gerencia catálogo" on public.%I;', t);
    execute format(
      'create policy "Admin gerencia catálogo" on public.%I for all
        using (public.has_role(auth.uid(), ''admin''))
        with check (public.has_role(auth.uid(), ''admin''));', t
    );
  end loop;
end $$;

-- Triggers updated_at
do $$
declare t text;
begin
  foreach t in array array['modules','lessons','exercises','stories'] loop
    execute format('drop trigger if exists trg_%s_updated_at on public.%I;', t, t);
    execute format(
      'create trigger trg_%s_updated_at before update on public.%I
        for each row execute function public.update_updated_at_column();', t, t
    );
  end loop;
end $$;

create index if not exists idx_lessons_module on public.lessons(module_id);
create index if not exists idx_exercises_lesson on public.exercises(lesson_id);
create index if not exists idx_exercises_module on public.exercises(module_id);

-- ---------------------------------------------------------------------
-- 7. Conquistas (achievements) e desbloqueios por usuário
-- ---------------------------------------------------------------------
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon text,
  points int not null default 0,
  criteria jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

alter table public.achievements      enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "Conquistas públicas" on public.achievements;
create policy "Conquistas públicas"
  on public.achievements for select using (true);

drop policy if exists "Admin gerencia conquistas" on public.achievements;
create policy "Admin gerencia conquistas"
  on public.achievements for all
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Usuário vê suas conquistas" on public.user_achievements;
create policy "Usuário vê suas conquistas"
  on public.user_achievements for select
  using (auth.uid() = user_id);

drop policy if exists "Usuário desbloqueia conquista" on public.user_achievements;
create policy "Usuário desbloqueia conquista"
  on public.user_achievements for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário remove sua conquista" on public.user_achievements;
create policy "Usuário remove sua conquista"
  on public.user_achievements for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------
-- 8. Progresso do usuário
-- ---------------------------------------------------------------------
create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid,                 -- pode ser id de lesson OU exercise (livre)
  module_id uuid references public.modules(id) on delete set null,
  completed boolean not null default false,
  score int not null default 0,
  attempts int not null default 1,
  last_access timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

alter table public.user_progress enable row level security;

drop policy if exists "Usuário lê seu progresso" on public.user_progress;
create policy "Usuário lê seu progresso"
  on public.user_progress for select
  using (auth.uid() = user_id);

drop policy if exists "Usuário cria seu progresso" on public.user_progress;
create policy "Usuário cria seu progresso"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuário atualiza seu progresso" on public.user_progress;
create policy "Usuário atualiza seu progresso"
  on public.user_progress for update
  using (auth.uid() = user_id);

drop policy if exists "Usuário apaga seu progresso" on public.user_progress;
create policy "Usuário apaga seu progresso"
  on public.user_progress for delete
  using (auth.uid() = user_id);

drop trigger if exists trg_user_progress_updated_at on public.user_progress;
create trigger trg_user_progress_updated_at
  before update on public.user_progress
  for each row execute function public.update_updated_at_column();

create index if not exists idx_user_progress_user on public.user_progress(user_id);
create index if not exists idx_user_progress_module on public.user_progress(module_id);

-- ---------------------------------------------------------------------
-- 9. Trigger: cria profile + role 'user' automaticamente no signup
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name, avatar)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', 'Aventureiro'),
    coalesce(new.raw_user_meta_data->>'avatar', '🧑')
  )
  on conflict (user_id) do nothing;

  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id, role) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- FIM DO SCHEMA
-- =====================================================================
