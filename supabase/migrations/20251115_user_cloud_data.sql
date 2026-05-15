-- Migration: user cloud data for offline-first sync.
--
-- One row per (user, dexie_table_name). The full table payload is stored as
-- JSONB. This intentionally trades granularity for simplicity: it lets the
-- client push/pull a whole Dexie table at once with a single round-trip and
-- keeps conflict resolution to a simple updated_at comparison.

create table if not exists public.user_cloud_data (
  user_id      uuid        not null references auth.users(id) on delete cascade,
  table_name   text        not null check (table_name in (
    'favorites', 'livingDex', 'outbreaks', 'inventory'
  )),
  payload      jsonb       not null default '[]'::jsonb,
  updated_at   timestamptz not null default now(),
  primary key (user_id, table_name)
);

create index if not exists user_cloud_data_user_idx
  on public.user_cloud_data (user_id);

-- Enable Row Level Security so users can only see and modify their own rows.
alter table public.user_cloud_data enable row level security;

-- Drop the policies first so the migration is idempotent.
drop policy if exists "user can read own cloud data"  on public.user_cloud_data;
drop policy if exists "user can write own cloud data" on public.user_cloud_data;
drop policy if exists "user can update own cloud data" on public.user_cloud_data;
drop policy if exists "user can delete own cloud data" on public.user_cloud_data;

create policy "user can read own cloud data"
  on public.user_cloud_data
  for select
  using (auth.uid() = user_id);

create policy "user can write own cloud data"
  on public.user_cloud_data
  for insert
  with check (auth.uid() = user_id);

create policy "user can update own cloud data"
  on public.user_cloud_data
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "user can delete own cloud data"
  on public.user_cloud_data
  for delete
  using (auth.uid() = user_id);

-- Convenience trigger to keep updated_at honest server-side too.
create or replace function public.touch_user_cloud_data_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists user_cloud_data_touch_updated_at on public.user_cloud_data;
create trigger user_cloud_data_touch_updated_at
  before update on public.user_cloud_data
  for each row execute function public.touch_user_cloud_data_updated_at();
