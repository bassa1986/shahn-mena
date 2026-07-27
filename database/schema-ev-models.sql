CREATE TABLE IF NOT EXISTS ev_models (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug             TEXT UNIQUE NOT NULL,
  brand            TEXT NOT NULL,
  name_ar          TEXT NOT NULL,
  badge_ar         TEXT,
  range_km         INT NOT NULL,
  range_hot_km     INT NOT NULL,
  charge_speed_kw  INT NOT NULL,
  heat_loss_pct    INT NOT NULL,
  price_sar        INT NOT NULL,
  pros_ar          TEXT[] NOT NULL DEFAULT '{}',
  cons_ar          TEXT[] NOT NULL DEFAULT '{}',
  syarah_url       TEXT,
  dubizzle_url     TEXT,
  image_url        TEXT,
  display_order    INT NOT NULL DEFAULT 0,
  active           BOOLEAN NOT NULL DEFAULT true,
  reviewed_at      DATE DEFAULT CURRENT_DATE,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ev_models_active_order ON ev_models (active, display_order);
