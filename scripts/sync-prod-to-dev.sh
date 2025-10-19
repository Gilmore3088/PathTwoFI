#!/bin/bash

# Sync Production Database to Development
# This script exports data from production and imports it to development

set -e  # Exit on error

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Production → Development Database Sync"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if production DB URL is provided
if [ -z "$PRODUCTION_DATABASE_URL" ]; then
  echo "⚠️  PRODUCTION_DATABASE_URL environment variable not set."
  echo ""
  echo "Please set it first:"
  echo "  export PRODUCTION_DATABASE_URL='your-production-db-url'"
  echo ""
  echo "You can find this in your production Repl's Database tool → Commands tab"
  exit 1
fi

# Check if development DB URL exists
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not found (development database)"
  exit 1
fi

# Confirm before proceeding
echo "📊 Source (Production): ${PRODUCTION_DATABASE_URL:0:30}..."
echo "🎯 Target (Development): ${DATABASE_URL:0:30}..."
echo ""
echo "⚠️  WARNING: This will REPLACE all data in your development database!"
echo ""
read -p "Continue? (yes/no): " -r
echo ""

if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
  echo "❌ Cancelled"
  exit 0
fi

# Create backup directory
BACKUP_DIR="./db_backups"
mkdir -p "$BACKUP_DIR"

# Generate timestamp for backup file
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/prod_backup_$TIMESTAMP.dump"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Exporting Production Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Export from production with progress
pg_dump -Fc --no-owner --no-acl --verbose "$PRODUCTION_DATABASE_URL" > "$BACKUP_FILE" 2>&1 | grep -E "processing|dumping|completed" || true

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Export failed - backup file not created"
  exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo ""
echo "✅ Export complete! ($BACKUP_SIZE)"
echo "📁 Saved to: $BACKUP_FILE"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Importing to Development Database"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Import to development with progress
pg_restore -d "$DATABASE_URL" \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --verbose \
  "$BACKUP_FILE" 2>&1 | grep -E "processing|creating|completed" || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Sync Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Development database now matches production"
echo "💾 Backup saved at: $BACKUP_FILE"
echo ""
echo "Next steps:"
echo "  • Test your app with production data"
echo "  • Run migrations if needed: npm run db:push"
echo "  • Clean up old backups: rm -rf $BACKUP_DIR"
echo ""
