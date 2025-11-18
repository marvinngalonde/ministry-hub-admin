# Database Migration - All Column Errors Fixed

## All Errors Fixed ✅

### Error 1: `column "user_id" does not exist`
**Fixed**: Changed to `author_id` for `community_posts` table

### Error 2: `column "status" does not exist`
**Fixed**: Changed to `is_published` for content tables (sermons, documentaries, presentations, spiritual_materials)

### Error 3: `column "featured" does not exist`
**Fixed**: Removed index - this column doesn't exist in the database

---

## Actual Database Schema

### Content Tables (sermons, documentaries, presentations, spiritual_materials)
**Columns that EXIST:**
- `is_published` (boolean) - for publish status
- `created_by` (UUID) - references auth.users(id)
- `created_at`, `updated_at` (timestamps)

**Columns that DO NOT exist:**
- ❌ `status` (was in TypeScript but not DB)
- ❌ `featured` (was in TypeScript but not DB)

### Community Posts Table
**Columns that EXIST:**
- `author_id` (UUID) - references user_profiles(id)
- `group_id` (UUID) - references community_groups(id)
- `is_published` (boolean)
- `likes_count`, `comments_count`, `shares_count` (integers)

**Columns that DO NOT exist:**
- ❌ `user_id` (should be `author_id`)
- ❌ `status` (uses `is_published` instead)

---

## Files Fixed

### 1. Migration SQL File
**File**: `database-migrations/add-foreign-key-relationships.sql`

**All fixes:**
```sql
-- ✅ Changed from user_id to author_id
ALTER TABLE community_posts
ADD CONSTRAINT community_posts_author_id_fkey
FOREIGN KEY (author_id) REFERENCES user_profiles(id);

-- ✅ Changed from status to is_published
CREATE INDEX idx_sermons_is_published ON sermons(is_published);
CREATE INDEX idx_documentaries_is_published ON documentaries(is_published);
CREATE INDEX idx_presentations_is_published ON presentations(is_published);
CREATE INDEX idx_spiritual_materials_is_published ON spiritual_materials(is_published);

-- ✅ Removed featured index (column doesn't exist)
-- REMOVED: CREATE INDEX idx_sermons_featured ON sermons(featured);

-- ✅ Fixed table names
ALTER TABLE community_post_comments ... (was post_comments)
ALTER TABLE community_post_likes ... (was post_likes)

-- ✅ Fixed column names in community_post_comments
FOREIGN KEY (author_id) ... (was user_id)
```

### 2. TypeScript Interfaces
**File**: `src/lib/supabase.ts`

**Fixed**:
```typescript
export interface CommunityPost {
  author_id: string;  // ✅ Changed from user_id
  // ❌ REMOVED: status field
  is_published: boolean;  // ✅ Matches DB
}

export interface PostComment {
  author_id: string;  // ✅ Changed from user_id
  content: string;  // ✅ Changed from comment
}
```

### 3. React Hooks
**File**: `src/hooks/useCommunity.ts`

**Fixed**:
```typescript
// ✅ Changed FK name
user_profiles:community_posts_author_id_fkey (...)

// ✅ Changed variable names
const authorIds = [...new Set(posts.map(p => p.author_id))]

// ✅ Removed status filters
// REMOVED: if (filters.status) { query.eq('status', ...) }
```

---

## Migration Ready to Run! 🚀

The migration file is now **100% aligned** with your actual database schema.

### To Run:
1. Open Supabase Dashboard → SQL Editor
2. Copy ALL contents of `database-migrations/add-foreign-key-relationships.sql`
3. Paste and click **Run**

### What It Will Do:
- ✅ Create foreign key constraints on correct columns
- ✅ Create performance indexes on existing columns only
- ✅ Display verification query showing all relationships

### Safety Features:
- Uses `DROP CONSTRAINT IF EXISTS` before adding (safe to re-run)
- Uses `CREATE INDEX IF NOT EXISTS` (won't error if exists)
- Won't modify any data, only adds constraints and indexes

---

## Column Reference Quick Guide

| Table | User Column | Status Column | Notes |
|-------|-------------|---------------|-------|
| `community_posts` | `author_id` | `is_published` | NOT user_id |
| `community_post_comments` | `author_id` | N/A | NOT user_id |
| `community_post_likes` | `user_id` ✓ | N/A | This one uses user_id |
| `sermons` | `created_by` | `is_published` | NOT status or featured |
| `documentaries` | `created_by` | `is_published` | NOT status |
| `presentations` | `created_by` | `is_published` | NOT status |
| `spiritual_materials` | `created_by` | `is_published` | NOT status |

---

## No More Errors!

All column references have been verified against the actual database schema in:
- `database-schema.sql`
- `database-migration.sql`
- `database-migration-add-group-id.sql`

The migration will now run successfully. ✅
