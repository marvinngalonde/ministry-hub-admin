# Column Name Fix - Community Posts

## Issues Fixed

### Issue 1: Wrong column name in FK constraint
```
ERROR: 42703: column "user_id" referenced in foreign key constraint does not exist
```

### Issue 2: Query filtering on non-existent column
```
ERROR: 42703: column "status" does not exist
```

## Root Cause
There was a mismatch between:
- **Database schema**: Uses `author_id` for community_posts table
- **TypeScript types**: Was using `user_id` in CommunityPost interface
- **React hooks**: Was querying with `user_id`
- **Migration file**: Was trying to create FK on non-existent `user_id` column

## Database Schema (Actual)

### community_posts table
- Uses `author_id` (references user_profiles.id) - NOT `user_id`
- Has `group_id` (references community_groups.id)
- Has `is_published` (boolean) - NOT `status` (enum)
- Has `likes_count`, `comments_count`, `shares_count` (integers)
- Already has FK constraints from initial schema

### community_post_comments table
- Uses `author_id` (references user_profiles.id)
- Uses `post_id` (references community_posts.id)

### community_post_likes table
- Uses `user_id` (references user_profiles.id) ✓ This one is correct
- Uses `post_id` (references community_posts.id)

## Files Fixed

### 1. Migration File
**File**: `database-migrations/add-foreign-key-relationships.sql`

**Changes**:
- Changed `user_id` to `author_id` for community_posts
- Changed `user_id` to `author_id` for community_post_comments
- Changed table names from `post_comments` to `community_post_comments`
- Changed table names from `post_likes` to `community_post_likes`
- Updated index names to match

### 2. TypeScript Interface
**File**: `src/lib/supabase.ts`

**Changes**:
```typescript
export interface CommunityPost {
  id: string;
  author_id: string;  // Changed from user_id
  group_id?: string;
  content: string;
  image_url?: string;
  // REMOVED: status?: 'pending' | 'approved' | 'rejected';
  likes_count: number;  // Changed from optional to required
  comments_count: number;  // Changed from optional to required
  shares_count: number;  // Changed from optional to required
  is_published: boolean;  // Changed from optional to required (matches DB)
  created_at: string;
  updated_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  author_id: string;  // Changed from user_id
  content: string;  // Changed from comment
  created_at: string;
  updated_at: string;  // Added
}
```

### 3. React Hooks
**File**: `src/hooks/useCommunity.ts`

**Changes**:
- Changed FK reference from `community_posts_user_id_fkey` to `community_posts_author_id_fkey`
- Changed fallback query to use `author_id` instead of `user_id`
- Updated variable names: `userIds` → `authorIds`
- **REMOVED status filter**: Deleted `if (filters.status)` checks that queried non-existent column

## Running the Migration

Now you can run the corrected migration:

1. Go to Supabase Dashboard → SQL Editor
2. Open `studio/ministry-hub-admin/database-migrations/add-foreign-key-relationships.sql`
3. Copy and paste the entire file
4. Click **Run**

The migration will:
- Add/recreate foreign key constraints with correct column names
- Create performance indexes on all foreign keys
- Verify all relationships were created successfully

## Expected Behavior After Migration

### Before Migration (Current)
- Community Posts page uses fallback method (separate queries)
- Console shows: `Foreign key query failed, using fallback method`
- Works but slower (3+ database queries per page load)

### After Migration
- Community Posts page uses efficient FK joins
- Console shows: `✅ Posts loaded with relationships`
- Faster performance (1 database query with joins)

## Notes

- The migration is **safe to run** - it uses `DROP CONSTRAINT IF EXISTS` before adding
- The app currently works with the fallback method, so this is an optimization
- Some constraints may already exist from the original schema (will be recreated)
- All indexes use `IF NOT EXISTS` so they won't error if already present
