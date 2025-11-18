# Database Migrations

This folder contains SQL migration files to set up and maintain the database schema.

## How to Run Migrations

### Method 1: Supabase SQL Editor (Recommended)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Navigate to: **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the SQL from the migration file
5. Click **Run** or press `Ctrl+Enter`

### Method 2: Supabase CLI

```bash
# Connect to your project
supabase link --project-ref zfnbgszputqcclrxrhrd

# Run the migration
supabase db push
```

---

## Available Migrations

### 1. `add-foreign-key-relationships.sql`

**Purpose**: Adds proper foreign key relationships between tables for better query performance and data integrity.

**What it does**:
- Creates foreign keys for `community_posts` → `user_profiles`
- Creates foreign keys for `community_posts` → `community_groups`
- Creates foreign keys for `community_groups` → `user_profiles`
- Creates foreign keys for `post_comments` → `community_posts` and `user_profiles`
- Creates foreign keys for `post_likes` → `community_posts` and `user_profiles`
- Creates foreign keys for `user_saved_content` → `user_profiles`
- Adds performance indexes on frequently queried columns

**Benefits**:
- ✅ Faster queries with proper JOINs
- ✅ Data integrity (prevents orphaned records)
- ✅ Automatic cleanup on delete (CASCADE)
- ✅ Better query planning by database

**When to run**: Run this after setting up your initial database schema

**How to run**:
```sql
-- Copy the contents of add-foreign-key-relationships.sql
-- Paste into Supabase SQL Editor
-- Click Run
```

**Verification**:
After running, the last query in the file will show all created foreign keys.

---

## Migration Order

Run migrations in this order:

1. `add-foreign-key-relationships.sql` - Core relationships

---

## Troubleshooting

### Error: "foreign key constraint already exists"
This is safe to ignore. The migration uses `DROP CONSTRAINT IF EXISTS` to handle this.

### Error: "column does not exist"
Ensure your base tables exist first. Check that:
- `community_posts` table exists
- `community_groups` table exists
- `user_profiles` table exists
- `post_comments` table exists
- `post_likes` table exists
- `user_saved_content` table exists

### Error: "violates foreign key constraint"
You have orphaned data (e.g., posts referencing non-existent users). Either:
1. Clean up the orphaned data first
2. Or temporarily disable the foreign key check during migration

---

## After Running Migrations

The admin web app will automatically:
1. Try to use foreign key relationships for efficient queries
2. Fall back to separate queries if relationships aren't available
3. Log to console which method is being used

Check the browser console for messages like:
- `✅ Posts loaded with relationships` - Using efficient FK joins
- `Foreign key query failed, using fallback method` - Using separate queries

---

## Best Practices

1. **Always backup** before running migrations in production
2. **Test migrations** on development/staging environment first
3. **Read the migration** before running to understand what it does
4. **Check the verification query** at the end to confirm success
5. **Monitor performance** after adding indexes

---

## Rolling Back

If you need to remove the relationships:

```sql
-- Remove foreign keys
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_user_id_fkey;
ALTER TABLE community_posts DROP CONSTRAINT IF EXISTS community_posts_group_id_fkey;
ALTER TABLE community_groups DROP CONSTRAINT IF EXISTS community_groups_created_by_fkey;
-- ... etc

-- Remove indexes
DROP INDEX IF EXISTS idx_community_posts_user_id;
DROP INDEX IF EXISTS idx_community_posts_group_id;
-- ... etc
```

---

## Questions?

- Check Supabase docs: https://supabase.com/docs/guides/database
- Foreign keys: https://supabase.com/docs/guides/database/joins
- Indexes: https://supabase.com/docs/guides/database/indexes
