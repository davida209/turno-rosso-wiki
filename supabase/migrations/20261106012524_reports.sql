create table public.wiki_reports (
  browser_key text not null check (browser_key ~ '^[a-f0-9]{64}$'),
  id uuid not null,
  area text not null check (area in ('guia', 'juego')),
  section text not null check (char_length(section) between 1 and 80),
  title text not null check (char_length(trim(title)) between 1 and 100),
  description text not null check (char_length(trim(description)) between 1 and 3000),
  status text not null default 'nuevo' check (status in ('nuevo', 'revision', 'resuelto')),
  updated_at timestamptz not null default now(),
  primary key (browser_key, id),
  unique (id)
);
create index wiki_reports_browser_updated on public.wiki_reports (browser_key, updated_at desc);
create index wiki_reports_updated on public.wiki_reports (updated_at desc);
alter table public.wiki_reports enable row level security;
revoke all on public.wiki_reports from public, anon, authenticated;
grant select, insert, update, delete on public.wiki_reports to service_role;
