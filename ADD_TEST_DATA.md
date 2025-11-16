# Adding Test Data to Your Admin Panel

The admin panel is working correctly, but your database is currently empty. Here's how to add test data to see the admin panel in action.

---

## Method 1: Use the Admin Panel Upload Forms (Recommended)

This is the easiest way to add real content:

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Login** to the admin panel

3. **Upload Content** using the upload forms:
   - Click "Upload Sermon" → Fill form → Upload video/thumbnail
   - Click "Upload Documentary" → Fill form → Upload video/thumbnail
   - Click "Upload Presentation" → Select type → Upload files
   - Click "Upload Material" → Select type → Upload PDF/DOC

The forms handle everything automatically!

---

## Method 2: Add Data via Supabase SQL Editor

If you want to quickly add test data without uploading files:

### 1. Go to Supabase Dashboard
https://app.supabase.com → Your Project → SQL Editor

### 2. Run this SQL to add test sermons:

```sql
INSERT INTO sermons (title, speaker, description, video_url, thumbnail_url, duration, status, featured)
VALUES
  (
    'The Power of Faith',
    'Pastor John',
    'A powerful message about faith in difficult times',
    'https://example.com/sermon1.mp4',
    'https://example.com/sermon1.jpg',
    45,
    'published',
    true
  ),
  (
    'Walking in the Spirit',
    'Pastor Sarah',
    'Understanding how to live led by the Holy Spirit',
    'https://example.com/sermon2.mp4',
    'https://example.com/sermon2.jpg',
    38,
    'published',
    false
  ),
  (
    'End Times Prophecy',
    'Dr. Michael',
    'Biblical insights into the end times',
    'https://example.com/sermon3.mp4',
    'https://example.com/sermon3.jpg',
    52,
    'draft',
    false
  );
```

### 3. Add test documentaries:

```sql
INSERT INTO documentaries (title, description, video_url, thumbnail_url, duration, status)
VALUES
  (
    'The Book of Revelation Explained',
    'A comprehensive documentary on the book of Revelation',
    'https://example.com/doc1.mp4',
    'https://example.com/doc1.jpg',
    90,
    'published'
  ),
  (
    'Biblical Archaeology',
    'Archaeological evidence supporting biblical history',
    'https://example.com/doc2.mp4',
    'https://example.com/doc2.jpg',
    75,
    'published'
  );
```

### 4. Add test presentations:

```sql
INSERT INTO presentations (title, type, speaker, description, video_url, thumbnail_url, duration, status)
VALUES
  (
    'Family Foundations: Episode 1',
    'family_foundations',
    'Dr. James',
    'Building strong family relationships on biblical principles',
    'https://example.com/pres1.mp4',
    'https://example.com/pres1.jpg',
    30,
    'published'
  ),
  (
    'Spiritual Health Check',
    'spiritual_health',
    'Pastor Mary',
    'Assessing your spiritual well-being',
    'https://example.com/pres2.mp4',
    'https://example.com/pres2.jpg',
    25,
    'published'
  ),
  (
    'The Final Conflict Podcast #1',
    'podcast',
    'Ministry Team',
    'Discussing current events from a biblical perspective',
    'https://example.com/podcast1.mp4',
    'https://example.com/podcast1.jpg',
    60,
    'published'
  );
```

### 5. Add test materials:

```sql
INSERT INTO spiritual_materials (title, type, author, description, content_url, thumbnail_url, status)
VALUES
  (
    'Understanding Biblical Prophecy',
    'book',
    'Dr. Thomas Wright',
    'A comprehensive guide to understanding biblical prophecy',
    'https://example.com/book1.pdf',
    'https://example.com/book1.jpg',
    'published'
  ),
  (
    'Prayer and Fasting Guide',
    'study_guide',
    'Pastor Elizabeth',
    'A practical guide to effective prayer and fasting',
    'https://example.com/guide1.pdf',
    'https://example.com/guide1.jpg',
    'published'
  ),
  (
    'The Coming Kingdom',
    'article',
    'Ministry Team',
    'An article about the prophesied kingdom of God',
    'https://example.com/article1.pdf',
    'https://example.com/article1.jpg',
    'published'
  );
```

### 6. Refresh the admin panel

After running the SQL, refresh your browser. You should now see:
- Dashboard showing real counts
- Sermons page with 3 sermons
- Documentaries page with 2 documentaries
- Presentations page with 3 presentations
- Materials page with 3 materials

---

## Method 3: Use Your Mobile App Data

If you already have data in your mobile app's database, the admin panel will show it automatically since they share the same Supabase database!

Just make sure the tables exist and have the correct schema.

---

## Current State Explanation

When you see:
- **Dashboard showing "0"** → No data in database yet
- **Sermons page showing "No sermons found"** → Database table exists but is empty
- **"Getting Started" card on Dashboard** → Helpful when there's no content

This is **CORRECT** behavior - it means the app is working properly and just waiting for you to add content!

---

## Next Steps

1. **Add test data** using one of the methods above
2. **Refresh the admin panel** to see your data
3. **Try the CRUD operations**:
   - Edit a sermon
   - Delete a documentary
   - Search and filter content
   - Bulk delete items
4. **Upload real files** using the upload forms

---

## Storage Buckets Setup

If you want to upload real files (videos, PDFs, images), make sure these storage buckets exist in Supabase:

1. Go to Supabase Dashboard → Storage
2. Create these buckets (if they don't exist):
   - `sermons` (Public)
   - `documentaries` (Public)
   - `presentations` (Public)
   - `materials` (Public)
   - `community` (Public)
   - `avatars` (Public)

Set all buckets to **Public** so files can be accessed.

---

## Troubleshooting

**Dashboard still shows 0 after adding data**
- Refresh the page (the query is cached for performance)
- Check browser console for errors
- Verify data was inserted successfully in Supabase Table Editor

**"No items found" on content pages**
- Verify the table name matches: `sermons`, `documentaries`, `presentations`, `spiritual_materials`
- Check the browser console for database errors
- Ensure your admin user has access to read the tables

**Upload forms not working**
- Create the storage buckets first
- Verify buckets are set to Public
- Check the browser console for upload errors

---

## Summary

Your admin panel is **working correctly**! It's just waiting for content. Choose one of the methods above to add test data and see it in action.

The empty states you're seeing are intentional and user-friendly - they guide you to add your first content.

Happy content managing! 🎉
