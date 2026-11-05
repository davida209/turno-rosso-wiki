-- Public aggregate table: no privileged view and no public access to private runs.
begin;
revoke execute on function public.new_player_profile() from public,anon,authenticated;
drop view public.leaderboard;
create table public.leaderboard(
 player_id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null,
 best_score integer not null,
 played integer not null,
 wins integer not null
);
alter table public.leaderboard enable row level security;
revoke all on public.leaderboard from anon,authenticated;
grant select on public.leaderboard to anon,authenticated;
grant all on public.leaderboard to service_role;
create policy ranking_public_read on public.leaderboard for select to anon,authenticated using(true);
create policy push_no_client_access on public.push_subscriptions for all to anon,authenticated using(false) with check(false);
create or replace function public.refresh_public_ranking(player uuid) returns void
language plpgsql security definer set search_path='' as $$
begin
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(player::text,0));
 delete from public.leaderboard where player_id=player;
 insert into public.leaderboard(player_id,display_name,best_score,played,wins)
 select r.user_id,p.display_name,max(r.score),count(*)::integer,count(*) filter(where r.result='won')::integer
 from public.game_runs r join public.profiles p on p.id=r.user_id
 where r.verification='verified' and r.user_id=player group by r.user_id,p.display_name;
end;$$;
revoke execute on function public.refresh_public_ranking(uuid) from public,anon,authenticated;
create or replace function public.update_run_ranking() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if tg_op='DELETE' then perform public.refresh_public_ranking(old.user_id);return old;end if;
 if tg_op='UPDATE' and old.user_id<>new.user_id then perform public.refresh_public_ranking(old.user_id);end if;
 perform public.refresh_public_ranking(new.user_id);return new;
end;$$;
revoke execute on function public.update_run_ranking() from public,anon,authenticated;
create trigger ranking_from_run after insert or update or delete on public.game_runs for each row execute function public.update_run_ranking();
create or replace function public.update_profile_ranking() returns trigger
language plpgsql security definer set search_path='' as $$
begin perform public.refresh_public_ranking(new.id);return new;end;$$;
revoke execute on function public.update_profile_ranking() from public,anon,authenticated;
create trigger ranking_from_profile after update of display_name on public.profiles for each row execute function public.update_profile_ranking();
commit;
