-- database/schema-actual.sql
--
-- This is the real schema, pulled directly from Neon on 2026-07-13 via:
--
--   SELECT table_name, string_agg(column_name || ' ' || data_type || ...)
--   FROM information_schema.columns
--   WHERE table_schema = 'public' AND table_name IN (...)
--   GROUP BY table_name
--
-- This replaces database/schema-core.sql, which was reconstructed by
-- guessing from how the app queries these tables rather than reading
-- the real definitions. Some of those guesses were wrong — see the
-- differences noted inline below. schema-core.sql is left in place for
-- now as a record of that, but this file is the one to trust.
--
-- CAVEAT: information_schema.columns only reports column-level info —
-- types, nullability, defaults. It does NOT report PRIMARY KEY or
-- UNIQUE constraints, or indexes. The `id` PRIMARY KEY and `slug`
-- UNIQUE markers below are inferred (every table uses `id` as its
-- gen_random_uuid() key, and `articles.slug` is used as a URL lookup
-- everywhere in the app, so it almost certainly has a unique
-- constraint) — but that's an inference, not confirmed by the query
-- that produced this file. Run this if you want to confirm for real:
--
--   SELECT tc.table_name, tc.constraint_type, kcu.column_name
--   FROM information_schema.table_constraints tc
--   JOIN information_schema.key_column_usage kcu
--     ON tc.constraint_name = kcu.constraint_name
--   WHERE tc.table_schema = 'public'
--     AND tc.table_name IN ('articles','charging_networks','incentives','tco_params');
--
-- Safe to run against the live DB: every statement is IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS articles (
  id                  TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  title_ar            TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,  -- UNIQUE inferred, not confirmed — see caveat above
  body_ar             TEXT,
  excerpt_ar          TEXT,
  category            TEXT,
  featured_image_url  TEXT,                  -- exists in the DB; no current page reads or writes this
  seo_title           TEXT,
  seo_description     TEXT,
  json_ld             JSONB,                 -- exists in the DB; no current page reads or writes this
  affiliate_links     JSONB,                 -- exists in the DB; no current page reads or writes this
  published           BOOLEAN NOT NULL DEFAULT false,
  views               INTEGER NOT NULL DEFAULT 0,  -- NOTE: column is "views", not "view_count"
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- no updated_at on this table
);


CREATE TABLE IF NOT EXISTS charging_networks (
  id                TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  name              TEXT NOT NULL,
  network_provider  TEXT NOT NULL,
  country           TEXT NOT NULL,
  city              TEXT NOT NULL,
  speed_kw          INTEGER NOT NULL,
  connector_type    TEXT NOT NULL,
  lat               DOUBLE PRECISION NOT NULL,
  lng               DOUBLE PRECISION NOT NULL,
  status            TEXT NOT NULL DEFAULT 'متاح',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS incentives (
  id                TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  country           TEXT NOT NULL,
  title_ar          TEXT NOT NULL,
  description_ar    TEXT NOT NULL,
  value             TEXT NOT NULL,
  valid_until       DATE,
  source_url        TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at       DATE DEFAULT CURRENT_DATE
);


CREATE TABLE IF NOT EXISTS tco_params (
  id                     TEXT PRIMARY KEY DEFAULT (gen_random_uuid())::text,
  country                TEXT UNIQUE NOT NULL,  -- UNIQUE inferred, not confirmed — see caveat above
  electricity_rate_kwh   DOUBLE PRECISION NOT NULL,
  avg_fuel_price         DOUBLE PRECISION NOT NULL,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
