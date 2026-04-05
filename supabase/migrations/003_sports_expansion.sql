-- Add sport and brand columns to products
ALTER TABLE products ADD COLUMN IF NOT EXISTS sport text DEFAULT 'general';
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_range text;

-- Update price_range on existing rows (trigger will handle new ones)
UPDATE products SET price_range =
  CASE
    WHEN price < 25  THEN 'under-25'
    WHEN price < 50  THEN '25-to-50'
    WHEN price < 100 THEN '50-to-100'
    ELSE 'over-100'
  END;

-- Trigger to keep price_range in sync
CREATE OR REPLACE FUNCTION update_price_range()
RETURNS TRIGGER AS $$
BEGIN
  NEW.price_range := CASE
    WHEN NEW.price < 25  THEN 'under-25'
    WHEN NEW.price < 50  THEN '25-to-50'
    WHEN NEW.price < 100 THEN '50-to-100'
    ELSE 'over-100'
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_price_range
  BEFORE INSERT OR UPDATE OF price ON products
  FOR EACH ROW EXECUTE FUNCTION update_price_range();

-- Sports table
CREATE TABLE IF NOT EXISTS sports (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  name        text not null,
  emoji       text,
  description text,
  is_active   boolean default true,
  sort_order  integer default 0
);

-- Programmatic pages table (the SEO engine)
CREATE TABLE IF NOT EXISTS programmatic_pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  page_type     text not null,
  sport         text,
  category      text,
  brand         text,
  price_range   text,
  title         text not null,
  description   text not null,
  product_count integer default 0,
  is_active     boolean default true,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

CREATE INDEX IF NOT EXISTS idx_prog_pages_slug   ON programmatic_pages(slug);
CREATE INDEX IF NOT EXISTS idx_prog_pages_type   ON programmatic_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_prog_pages_sport  ON programmatic_pages(sport);
CREATE INDEX IF NOT EXISTS idx_prog_pages_active ON programmatic_pages(is_active);
CREATE INDEX IF NOT EXISTS idx_products_sport    ON products(sport);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_sport_cat ON products(sport, category);

-- RLS for new tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE programmatic_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sports_public_read" ON sports FOR SELECT TO anon USING (true);
CREATE POLICY "prog_pages_public_read" ON programmatic_pages FOR SELECT TO anon USING (is_active = true);

-- Seed sports
INSERT INTO sports (slug, name, emoji, description, sort_order) VALUES
  ('football',   'Nebraska Football',   '🏈', 'Nebraska Cornhuskers football gear, jerseys, and fan apparel', 1),
  ('basketball', 'Nebraska Basketball', '🏀', 'Nebraska Cornhuskers basketball gear from the 2026 Sweet 16 run', 2),
  ('volleyball', 'Nebraska Volleyball', '🏐', 'Nebraska Cornhuskers volleyball gear — one of the nation''s elite programs', 3),
  ('wrestling',  'Nebraska Wrestling',  '🤼', 'Nebraska Cornhuskers wrestling fan gear and apparel', 4),
  ('baseball',   'Nebraska Baseball',   '⚾', 'Nebraska Cornhuskers baseball gear and fan merchandise', 5),
  ('softball',   'Nebraska Softball',   '🥎', 'Nebraska Cornhuskers softball fan apparel and gear', 6),
  ('track',      'Nebraska Track',      '🏃', 'Nebraska Cornhuskers track and field fan gear', 7),
  ('general',    'Nebraska Cornhuskers','🌽', 'General Nebraska Cornhuskers fan gear across all sports', 8)
ON CONFLICT (slug) DO NOTHING;
