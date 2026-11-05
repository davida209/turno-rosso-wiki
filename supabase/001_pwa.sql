-- Turno Rosso PWA. Apply to its dedicated Supabase project.
begin;
create table if not exists public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null check(char_length(display_name) between 2 and 40),
 created_at timestamptz not null default now()
);
create table if not exists public.notes (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
 title text not null check(char_length(title) between 1 and 100),
 body text not null default '' check(char_length(body)<=4000),
 category text not null default 'general' check(category in ('general','inventario','limpieza','seguridad','clientes')),
 updated_at timestamptz not null default now()
);
create index if not exists notes_user on public.notes(user_id);
create table if not exists public.game_runs (
 id uuid primary key,
 user_id uuid not null references auth.users(id) on delete cascade,
 score integer not null check(score between 0 and 100000000),
 result text not null check(result in ('won','lost')),
 duration_seconds integer not null check(duration_seconds between 1 and 86400),
 verification text not null default 'pending' check(verification in ('pending','verified','offline','rejected')),
 game_version text not null,
 played_at timestamptz not null default now()
);
create index if not exists runs_user on public.game_runs(user_id);
create table if not exists public.push_subscriptions (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null references auth.users(id) on delete cascade,
 endpoint text not null unique,
 subscription jsonb not null,
 daily_reminder boolean not null default false,
 last_sent_date date,
 last_test_at timestamptz
);
alter table public.profiles enable row level security;
alter table public.notes enable row level security;
alter table public.game_runs enable row level security;
alter table public.push_subscriptions enable row level security;
revoke all on public.profiles,public.notes,public.game_runs,public.push_subscriptions from anon,authenticated;
grant select,insert,update on public.profiles to authenticated;
grant select,insert,update,delete on public.notes to authenticated;
grant select on public.game_runs to authenticated;
grant all on public.profiles,public.notes,public.game_runs,public.push_subscriptions to service_role;
create policy profile_own_read on public.profiles for select to authenticated using(id=auth.uid());
create policy profile_own_insert on public.profiles for insert to authenticated with check(id=auth.uid());
create policy profile_own_update on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
create policy notes_own_read on public.notes for select to authenticated using(user_id=auth.uid());
create policy notes_own_insert on public.notes for insert to authenticated with check(user_id=auth.uid());
create policy notes_own_update on public.notes for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy notes_own_delete on public.notes for delete to authenticated using(user_id=auth.uid());
create policy runs_own_read on public.game_runs for select to authenticated using(user_id=auth.uid());
create or replace function public.new_player_profile() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,display_name) values(new.id,left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),'Encargado'),40));
 return new;
end; $$;
create trigger new_player_profile after insert on auth.users for each row execute function public.new_player_profile();
create or replace view public.leaderboard as
 select r.user_id as player_id,p.display_name,max(r.score) as best_score,count(*)::integer as played,
 count(*) filter(where r.result='won')::integer as wins
 from public.game_runs r join public.profiles p on p.id=r.user_id
 where r.verification='verified' group by r.user_id,p.display_name;
grant select on public.leaderboard to anon,authenticated;
-- No client can write game_runs or change verification. Unity integration is a separate server task.
commit;
