create table if not exists site_settings (
  id bigint generated always as identity primary key,
  hero_kicker text not null,
  hero_title text not null,
  hero_body text not null,
  hero_image_url text not null,
  primary_cta text not null default 'Köp biljett',
  primary_cta_url text not null default '/butik',
  event_heading text not null,
  event_date_label text not null,
  event_location text not null,
  event_description text not null,
  artists text[] not null default '{}',
  updated_at timestamptz not null default now()
);

do $$
begin
  create type sponsor_tier as enum (
    'main',
    'platinum',
    'gold',
    'silver',
    'bronze'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists sponsors (
  id bigint generated always as identity primary key,
  name text not null,
  tier sponsor_tier not null,
  description text not null default '',
  website text,
  logo_url text,
  sort_order integer not null default 100,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists program_items (
  id bigint generated always as identity primary key,
  time_label text not null,
  title text not null,
  description text not null default '',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists gallery_images (
  id bigint generated always as identity primary key,
  image_url text not null,
  alt text not null default 'Bild från Åseda Truckmeet',
  sort_order integer not null default 100,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table site_settings enable row level security;
alter table sponsors enable row level security;
alter table program_items enable row level security;
alter table gallery_images enable row level security;

create policy "public read site settings"
  on site_settings for select using (true);

create policy "public read active sponsors"
  on sponsors for select using (is_active = true);

create policy "public read active program"
  on program_items for select using (is_active = true);

create policy "public read active gallery"
  on gallery_images for select using (is_active = true);

insert into site_settings (
  hero_kicker,
  hero_title,
  hero_body,
  hero_image_url,
  primary_cta,
  primary_cta_url,
  event_heading,
  event_date_label,
  event_location,
  event_description,
  artists
) values (
  '26-28 juni 2026 · Åseda Folkets Park',
  'Upplev magin med Åseda Truckmeet - 10 år',
  'Årets upplaga blir en maxad helg med lastbilar, festival, familjedag, branschutställare och scenprogram.',
  'https://asedatruckmeet.se/web/image/3834-8ed0e93c/A7400342.webp',
  'Köp biljett',
  '/butik',
  'En helg för lastbilsfolk, publik och familjer',
  '26-28 juni',
  'Åseda Folkets Park',
  'Åseda Truckmeet arrangeras helgen efter midsommar och samlar utställande lastbilar, branschutställare, mat, musik och familjeaktiviteter.',
  array['Pipex', 'Da Buzz', 'Maskinen', '2 Blyga läppar', 'J.O.X', 'LBSB']
) on conflict do nothing;
