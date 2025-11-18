-- Migration: Add Foreign Key Relationships
-- This creates proper relationships between tables for better query performance
-- and data integrity

-- =====================================================
-- COMMUNITY POSTS RELATIONSHIPS
-- =====================================================

-- Add foreign key from community_posts.author_id to user_profiles.id
-- Note: This constraint may already exist from the schema, we'll add it if not
ALTER TABLE community_posts
DROP CONSTRAINT IF EXISTS community_posts_author_id_fkey;

ALTER TABLE community_posts
ADD CONSTRAINT community_posts_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES user_profiles(id)
ON DELETE CASCADE;

-- Add foreign key from community_posts.group_id to community_groups.id
ALTER TABLE community_posts
DROP CONSTRAINT IF EXISTS community_posts_group_id_fkey;

ALTER TABLE community_posts
ADD CONSTRAINT community_posts_group_id_fkey
FOREIGN KEY (group_id)
REFERENCES community_groups(id)
ON DELETE SET NULL;

-- =====================================================
-- COMMUNITY GROUPS RELATIONSHIPS
-- =====================================================

-- Add foreign key from community_groups.created_by to user_profiles.id
ALTER TABLE community_groups
DROP CONSTRAINT IF EXISTS community_groups_created_by_fkey;

ALTER TABLE community_groups
ADD CONSTRAINT community_groups_created_by_fkey
FOREIGN KEY (created_by)
REFERENCES user_profiles(id)
ON DELETE CASCADE;

-- =====================================================
-- POST COMMENTS RELATIONSHIPS
-- =====================================================

-- Add foreign key from community_post_comments.post_id to community_posts.id
-- Note: This constraint may already exist from the schema
ALTER TABLE community_post_comments
DROP CONSTRAINT IF EXISTS community_post_comments_post_id_fkey;

ALTER TABLE community_post_comments
ADD CONSTRAINT community_post_comments_post_id_fkey
FOREIGN KEY (post_id)
REFERENCES community_posts(id)
ON DELETE CASCADE;

-- Add foreign key from community_post_comments.author_id to user_profiles.id
ALTER TABLE community_post_comments
DROP CONSTRAINT IF EXISTS community_post_comments_author_id_fkey;

ALTER TABLE community_post_comments
ADD CONSTRAINT community_post_comments_author_id_fkey
FOREIGN KEY (author_id)
REFERENCES user_profiles(id)
ON DELETE CASCADE;

-- =====================================================
-- POST LIKES RELATIONSHIPS
-- =====================================================

-- Add foreign key from community_post_likes.post_id to community_posts.id
-- Note: This constraint may already exist from the schema
ALTER TABLE community_post_likes
DROP CONSTRAINT IF EXISTS community_post_likes_post_id_fkey;

ALTER TABLE community_post_likes
ADD CONSTRAINT community_post_likes_post_id_fkey
FOREIGN KEY (post_id)
REFERENCES community_posts(id)
ON DELETE CASCADE;

-- Add foreign key from community_post_likes.user_id to user_profiles.id
ALTER TABLE community_post_likes
DROP CONSTRAINT IF EXISTS community_post_likes_user_id_fkey;

ALTER TABLE community_post_likes
ADD CONSTRAINT community_post_likes_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES user_profiles(id)
ON DELETE CASCADE;

-- =====================================================
-- USER SAVED CONTENT RELATIONSHIPS
-- =====================================================

-- Add foreign key from user_saved_content.user_id to user_profiles.id
ALTER TABLE user_saved_content
DROP CONSTRAINT IF EXISTS user_saved_content_user_id_fkey;

ALTER TABLE user_saved_content
ADD CONSTRAINT user_saved_content_user_id_fkey
FOREIGN KEY (user_id)
REFERENCES user_profiles(id)
ON DELETE CASCADE;

-- Note: content_id references multiple tables depending on content_type
-- This is a polymorphic relationship and cannot have a single foreign key
-- We handle this at the application level

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Indexes for community_posts
CREATE INDEX IF NOT EXISTS idx_community_posts_author_id ON community_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_group_id ON community_posts(group_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at DESC);

-- Indexes for community_groups
CREATE INDEX IF NOT EXISTS idx_community_groups_created_by ON community_groups(created_by);
CREATE INDEX IF NOT EXISTS idx_community_groups_created_at ON community_groups(created_at DESC);

-- Indexes for community_post_comments
CREATE INDEX IF NOT EXISTS idx_community_post_comments_post_id ON community_post_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_author_id ON community_post_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_community_post_comments_created_at ON community_post_comments(created_at DESC);

-- Indexes for community_post_likes
CREATE INDEX IF NOT EXISTS idx_community_post_likes_post_id ON community_post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_community_post_likes_user_id ON community_post_likes(user_id);

-- Indexes for user_saved_content
CREATE INDEX IF NOT EXISTS idx_user_saved_content_user_id ON user_saved_content(user_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_content_id ON user_saved_content(content_id);
CREATE INDEX IF NOT EXISTS idx_user_saved_content_content_type ON user_saved_content(content_type);

-- Indexes for sermons (uses is_published, not status; no featured column)
CREATE INDEX IF NOT EXISTS idx_sermons_is_published ON sermons(is_published);
CREATE INDEX IF NOT EXISTS idx_sermons_created_at ON sermons(created_at DESC);

-- Indexes for documentaries (uses is_published, not status)
CREATE INDEX IF NOT EXISTS idx_documentaries_is_published ON documentaries(is_published);
CREATE INDEX IF NOT EXISTS idx_documentaries_created_at ON documentaries(created_at DESC);

-- Indexes for presentations (uses is_published, not status)
CREATE INDEX IF NOT EXISTS idx_presentations_type ON presentations(type);
CREATE INDEX IF NOT EXISTS idx_presentations_is_published ON presentations(is_published);
CREATE INDEX IF NOT EXISTS idx_presentations_created_at ON presentations(created_at DESC);

-- Indexes for spiritual_materials (uses is_published, not status)
CREATE INDEX IF NOT EXISTS idx_spiritual_materials_type ON spiritual_materials(type);
CREATE INDEX IF NOT EXISTS idx_spiritual_materials_is_published ON spiritual_materials(is_published);
CREATE INDEX IF NOT EXISTS idx_spiritual_materials_created_at ON spiritual_materials(created_at DESC);

-- =====================================================
-- VERIFY RELATIONSHIPS
-- =====================================================

-- Run this to verify all foreign keys were created:
SELECT
    tc.table_name,
    tc.constraint_name,
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_name IN (
        'community_posts',
        'community_groups',
        'community_post_comments',
        'community_post_likes',
        'user_saved_content'
    )
ORDER BY tc.table_name, tc.constraint_name;
