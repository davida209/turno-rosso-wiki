create table public.simulator_plans (
  browser_key text not null check (browser_key ~ '^[a-f0-9]{64}$'),
  id uuid not null,
  scenario text not null,
  title text not null check (char_length(trim(title)) between 1 and 60),
  actions text[] not null check (cardinality(actions) = 2 and actions[1] <> actions[2]),
  updated_at timestamptz not null default now(),
  primary key (browser_key, id)
);

create index simulator_plans_browser_updated on public.simulator_plans (browser_key, updated_at desc);
alter table public.simulator_plans enable row level security;
revoke all on public.simulator_plans from public, anon, authenticated;
grant select, insert, update, delete on public.simulator_plans to service_role;
