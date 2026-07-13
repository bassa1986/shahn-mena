-- database/schema-core.sql
--
-- IMPORTANT: this is NOT a dump of your actual live Neon schema.
-- These four tables (articles, charging_networks, incentives,
-- tco_params) were created by hand in the Neon console early in this
-- project, before any schema file existed in source control. This
-- file was reconstructed by reading every SELECT/INSERT/UPDATE across
-- the app/ pages and scripts/ folder and inferring the columns that
-- must exist for those queries to work.
--
-- What this means practically:
--   - Column NAMES and that they exist at all: high confidence, since
--     the live site is currently working against them.
--   - Column TYPES, NOT NULL constraints, and DEFAULTs below: best
--     guess based on how each column is used, not confirmed against
--     the real table definitions.
--   - There may be real columns on your live tables that nothing in
--     the current code queries, and so aren't listed here at all.
--
-- Safe to run: every statement uses IF NOT EXISTS, so running this
-- against your existing live database does nothing if the tables
-- already exist correctly. It will NOT fix a table that exists but
-- has different column types than guessed here — it will just skip
-- creating it since a table with that name is already present.
--
-- The actual, trustworthy way to get your real schema into source
-- control is to run this once against Neon and commit the output:
--   pg_dump --schema-only --no-owner --no-privileges "$DATABASE_URL" > database/schema-actual.sql
-- Do that when you get a chance — it replaces the guesswork below
-- with the real thing.

CREATE TABLE IF NOT EXISTS articles (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title_ar          TEXT NOT NULL,
  slug              TEXT UNIQUE NOT NULL,
  excerpt_ar        TEXT,
  body_ar           TEXT NOT NULL,
  category          TEXT,
  seo_title         TEXT,
  seo_description   TEXT,
  published         BOOLEAN NOT NULL DEFAULT false,
  view_count        INT NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_articles_published_created ON articles (published, created_at DESC);


CREATE TABLE IF NOT EXISTS charging_networks (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name              TEXT NOT NULL,
  network_provider  TEXT NOT NULL,
  country           TEXT NOT NULL,
  city              TEXT NOT NULL,
  speed_kw          INT NOT NULL,
  connector_type    TEXT NOT NULL,
  status            TEXT NOT NULL DEFAULT 'متاح',
  lat               DOUBLE PRECISION,
  lng               DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS idx_charging_country_city ON charging_networks (country, city);


CREATE TABLE IF NOT EXISTS incentives (
  id                TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country           TEXT NOT NULL,
  title_ar          TEXT NOT NULL,
  description_ar    TEXT NOT NULL,
  value             TEXT NOT NULL,
  valid_until       DATE,
  source_url        TEXT,
  reviewed_at       DATE DEFAULT CURRENT_DATE  -- added 2026-07-12, see incentives-scraper.js
);

CREATE INDEX IF NOT EXISTS idx_incentives_country ON incentives (country);


CREATE TABLE IF NOT EXISTS tco_params (
  id                     TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  country                TEXT UNIQUE NOT NULL,
  electricity_rate_kwh   DOUBLE PRECISION NOT NULL,
  avg_fuel_price         DOUBLE PRECISION NOT NULL,
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()  -- added 2026-07-12, see tco-scraper.js
);
