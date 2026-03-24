-- ============================================================
-- Nebrasketball – initial schema
-- ============================================================

-- ---------- tables ----------

create table products (
  id              uuid primary key default gen_random_uuid(),
  external_id     text not null,
  source          text not null,          -- 'amazon'|'ebay'|'etsy'|'fanatics'|'manual'
  title           text not null,
  description     text,
  price           numeric(10,2),
  original_price  numeric(10,2),
  image_url       text,
  affiliate_url   text not null default '#',
  slug            text unique not null,
  category        text,                   -- 'tees'|'hoodies'|'hats'|'jerseys'|'womens'|'youth'|'accessories'
  tags            text[],
  is_featured     boolean default false,
  is_active       boolean default true,
  click_count     integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  constraint products_external_id_source_key unique (external_id, source)
);

create table categories (
  id               uuid primary key default gen_random_uuid(),
  slug             text unique not null,
  name             text not null,
  description      text,
  meta_title       text,
  meta_description text,
  product_count    integer default 0
);

create table news_posts (
  id             uuid primary key default gen_random_uuid(),
  slug           text unique not null,
  title          text not null,
  content        text not null,
  excerpt        text,
  hero_image_url text,
  published_at   timestamptz default now(),
  is_published   boolean default true,
  created_at     timestamptz default now()
);

create table click_events (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid references products(id) on delete cascade,
  source_page text,
  referrer    text,
  user_agent  text,
  created_at  timestamptz default now()
);

-- ---------- updated_at trigger ----------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row
  execute function set_updated_at();

-- ---------- indexes ----------

create index idx_products_source       on products (source);
create index idx_products_category     on products (category);
create index idx_products_slug         on products (slug);
create index idx_products_is_active    on products (is_active);
create index idx_products_is_featured  on products (is_featured);
create index idx_products_click_count  on products (click_count desc);

create index idx_news_posts_slug         on news_posts (slug);
create index idx_news_posts_published_at on news_posts (published_at desc);

-- ---------- RLS ----------

alter table products     enable row level security;
alter table categories   enable row level security;
alter table news_posts   enable row level security;
alter table click_events enable row level security;

create policy "products: anon select"
  on products for select
  to anon
  using (true);

create policy "categories: anon select"
  on categories for select
  to anon
  using (true);

create policy "news_posts: anon select published"
  on news_posts for select
  to anon
  using (is_published = true);

create policy "click_events: anon insert"
  on click_events for insert
  to anon
  with check (true);
