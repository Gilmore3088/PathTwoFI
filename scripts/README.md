# Database Sync Scripts

## Sync Production to Development

**Script:** `sync-prod-to-dev.sh`

### Usage

1. **Set your production database URL:**
   ```bash
   export PRODUCTION_DATABASE_URL="postgresql://user:pass@host/database"
   ```
   
   You can find this in your production Repl's Database tool → Commands tab → Environment variables

2. **Run the sync:**
   ```bash
   ./scripts/sync-prod-to-dev.sh
   ```

3. **Confirm the operation** when prompted

### What it does

- ✅ Exports your entire production database (schema + data)
- ✅ Creates a timestamped backup in `./db_backups/`
- ✅ Safely imports to your development database
- ✅ Handles permissions properly with `--no-owner --no-acl`
- ✅ Cleans existing data before import with `--clean --if-exists`
- ⚠️ Requires confirmation before proceeding

### Safety Features

- Prompts for confirmation before replacing data
- Creates local backups of production data
- Uses safe PostgreSQL flags to avoid permission errors
- Shows progress during export/import
- Exits on any error

### After Sync

Once synced, your development database will have:
- All production tables and data
- Current schema state
- Real user data (be careful with PII!)

You may need to:
- Run migrations: `npm run db:push` (if schema changed)
- Test thoroughly before making changes
- Be mindful of production data in development

### Troubleshooting

**"PRODUCTION_DATABASE_URL not set":**
```bash
export PRODUCTION_DATABASE_URL="your-url-here"
```

**Permission errors:**
The script already uses `--no-owner --no-acl` to avoid this, but if you still see errors, check your database user permissions.

**Connection timeout:**
Production databases on Replit sleep after 5 minutes of inactivity. The first query might wake it up. Try running the script again.

### Cleanup

To remove old backups:
```bash
rm -rf db_backups
```

Or keep only recent ones:
```bash
# Keep last 3 backups, delete older ones
ls -t db_backups/*.dump | tail -n +4 | xargs rm -f
```
