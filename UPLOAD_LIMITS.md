# File Upload Limits

## Current Configuration

### Video Files (Sermons, Documentaries, Presentations)
- **Maximum Size**: 10 GB (10,737,418,240 bytes)
- **Allowed Formats**: .mp4, .mov, .avi
- **MIME Types**: video/*

### Image Files (Thumbnails)
- **Maximum Size**: 5 MB (5,242,880 bytes)
- **Allowed Formats**: .jpg, .jpeg, .png
- **MIME Types**: image/*

### Document Files (Materials)
- **Maximum Size**: 50 MB (52,428,800 bytes)
- **Allowed Formats**: .pdf, .doc, .docx
- **MIME Types**: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document

---

## Files Updated

All upload pages have been updated to support 10GB video uploads:

- `SermonNew.tsx` ✅
- `SermonEdit.tsx` ✅
- `DocumentaryNew.tsx` ✅
- `DocumentaryEdit.tsx` ✅
- `PresentationNew.tsx` ✅
- `PresentationEdit.tsx` ✅
- `FileUpload.tsx` (default changed to 10GB) ✅

---

## Supabase Storage Considerations

**Important**: While the admin panel now allows 10GB uploads, you need to ensure your Supabase storage configuration supports this:

### 1. Check Storage Bucket Settings

Go to Supabase Dashboard → Storage → Your Bucket → Settings

- Verify the upload size limit in Supabase is set appropriately
- Default Supabase free tier has limits - may need to upgrade plan

### 2. Upload Performance

Large files (5GB+) may take significant time to upload depending on:
- User's internet connection speed
- Server processing time
- Network latency

### 3. Storage Costs

10GB videos will consume significant storage space. Monitor your:
- Total storage usage
- Bandwidth usage
- Supabase plan limits

---

## Changing Limits in the Future

To adjust upload limits, modify these files:

**For Videos:**
```typescript
// In SermonNew.tsx, DocumentaryNew.tsx, PresentationNew.tsx (and Edit versions)
maxSize={10 * 1024 * 1024 * 1024} // 10GB

// Change to desired size, e.g., for 5GB:
maxSize={5 * 1024 * 1024 * 1024} // 5GB
```

**For Images:**
```typescript
// Thumbnail uploads
maxSize={5 * 1024 * 1024} // 5MB

// Change to desired size, e.g., for 10MB:
maxSize={10 * 1024 * 1024} // 10MB
```

**For Documents:**
```typescript
// Material uploads
maxSize={50 * 1024 * 1024} // 50MB

// Change to desired size, e.g., for 100MB:
maxSize={100 * 1024 * 1024} // 100MB
```

---

## Default Settings

The `FileUpload` component default is now **10GB**, so new upload implementations will automatically support large files unless explicitly overridden.

---

**Last Updated**: 2025-11-17
**Upload Limit**: 10 GB for videos
