#!/usr/bin/env bash
# apply-and-seed.sh
#
# Run this from the PARENT folder that contains both:
#   - shahn-mena-seo-content-ready.zip   (the fixed project I gave you)
#   - your existing project folder (e.g. shahn-mena/)
#
# It will:
#   1. Back up your current project folder (just in case)
#   2. Unzip the fixed version, replacing old files
#   3. Restore your real .env.local (the zip doesn't contain your real secrets)
#   4. Install dependencies
#   5. Run the new, safe article seed script against your real database
#
# Usage:
#   chmod +x apply-and-seed.sh
#   ./apply-and-seed.sh

set -e  # stop immediately if any step fails

ZIP_FILE="shahn-mena-seo-content-ready.zip"
PROJECT_DIR="shahn-mena"
BACKUP_DIR="shahn-mena-backup-$(date +%Y%m%d-%H%M%S)"

if [ ! -f "$ZIP_FILE" ]; then
  echo "❌ Can't find $ZIP_FILE in this folder. Put it here first."
  exit 1
fi

if [ ! -d "$PROJECT_DIR" ]; then
  echo "❌ Can't find $PROJECT_DIR folder in this location."
  exit 1
fi

echo "▶ Backing up current project to $BACKUP_DIR ..."
cp -r "$PROJECT_DIR" "$BACKUP_DIR"

echo "▶ Saving your real .env.local ..."
ENV_BACKUP=$(mktemp)
if [ -f "$PROJECT_DIR/.env.local" ]; then
  cp "$PROJECT_DIR/.env.local" "$ENV_BACKUP"
fi

echo "▶ Unzipping fixed project (this will overwrite matching files) ..."
unzip -o -q "$ZIP_FILE" -d .

echo "▶ Restoring your real .env.local ..."
if [ -s "$ENV_BACKUP" ]; then
  cp "$ENV_BACKUP" "$PROJECT_DIR/.env.local"
else
  echo "⚠️  No .env.local was found in your original project."
  echo "   Copy $PROJECT_DIR/.env.example to $PROJECT_DIR/.env.local and fill in real values before continuing."
  exit 1
fi

cd "$PROJECT_DIR"

echo "▶ Installing dependencies ..."
npm install

echo "▶ Installing scraper/script dependencies ..."
cd scripts && npm install && cd ..

echo "▶ Running the new article seed script against your real database ..."
node scripts/seed-articles.js

echo ""
echo "✅ Done."
echo "   - Old project backed up at: ../$BACKUP_DIR"
echo "   - Fabricated-content script (never run) is safely quarantined at:"
echo "     scripts/seed-articles.OLD-DO-NOT-RUN-fabricated-stats.js.bak"
echo "   - New safe articles have been inserted into your database (or skipped if already present)."
echo ""
echo "Next: run 'npm run build' to confirm everything compiles, then deploy."
