# Ministry Hub Admin - Setup Guide

## ✅ Setup Complete!

The `.env` file has been created with your Supabase credentials. The admin panel is now configured to connect to the same database as your mobile app.

---

## 🚀 Running the Application

### Development Mode

```bash
cd c:/arvip/TFC/tfc/studio/ministry-hub-admin
npm run dev
```

The app will start at `http://localhost:5173` (or another port if 5173 is busy).

**IMPORTANT**: If you see Supabase errors, restart the dev server to load the new `.env` file:
1. Stop the dev server (Ctrl+C)
2. Run `npm run dev` again

### Production Build

```bash
npm run build
```

The build output will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## 🔑 Supabase Configuration

**Current Configuration:**
- **URL**: `https://zfnbgszputqcclrxrhrd.supabase.co`
- **Anon Key**: Configured ✅
- **Database**: Shared with mobile app ✅

The admin panel connects to the same Supabase database as your React Native mobile app.

---

## 📝 Default Admin Login

You'll need to create an admin user in Supabase:

1. Go to Supabase Dashboard: https://app.supabase.com
2. Navigate to Authentication → Users
3. Create a new user with an email/password
4. Go to Table Editor → `user_profiles`
5. Find the user and set their `role` to `'admin'`

Then login to the admin panel with those credentials.

---

## 🗂️ Project Structure

```
ministry-hub-admin/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── layout/         # Layout components (Sidebar, DashboardLayout)
│   │   ├── ui/             # shadcn/ui components
│   │   ├── FileUpload.tsx  # File upload component
│   │   └── RichTextEditor.tsx
│   ├── hooks/              # React Query hooks for data fetching
│   │   ├── useSermons.ts
│   │   ├── useDocumentaries.ts
│   │   ├── usePresentations.ts
│   │   ├── useMaterials.ts
│   │   ├── useCommunity.ts
│   │   └── useUsers.ts
│   ├── lib/                # Utilities and config
│   │   ├── supabase.ts     # Supabase client
│   │   ├── storage.ts      # File upload helpers
│   │   ├── auth.ts         # Authentication helpers
│   │   └── validations.ts  # Form validation schemas
│   ├── pages/              # Page components (17 total)
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Sermons*.tsx (3 files)
│   │   ├── Documentaries*.tsx (3 files)
│   │   ├── Presentations*.tsx (3 files)
│   │   ├── Materials*.tsx (3 files)
│   │   └── ... (Community, Users, Media, Analytics, Settings)
│   └── App.tsx             # Main app with routing
├── .env                    # Environment variables (created)
├── .env.example            # Example env file
└── package.json
```

---

## 🎯 Features Available

### Content Management
- ✅ **Sermons**: Create, edit, delete sermons with video uploads
- ✅ **Documentaries**: Full CRUD for documentary content
- ✅ **Presentations**: Manage podcasts, family foundations, spiritual health, bible studies
- ✅ **Materials**: Upload books, articles, study guides (PDF/DOC)

### Community Moderation
- ✅ **Posts**: View and moderate user posts
- ✅ **Groups**: Manage community groups

### Administration
- ✅ **Users**: View all users and their information
- ✅ **Media Library**: Browse all uploaded files
- ✅ **Analytics**: View statistics dashboard
- ✅ **Settings**: Configure app settings

---

## 🔧 Troubleshooting

### Supabase Connection Issues

**Error**: "supabaseUrl is required"
**Solution**: Restart the dev server to load the `.env` file

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Build Errors

**Error**: Missing exports in hooks
**Solution**: Already fixed! All hooks have complete exports.

### File Upload Issues

**Error**: Bucket not found (404)
**Solution**: Create storage buckets in Supabase:

1. Go to Supabase Dashboard → Storage
2. Create these buckets:
   - `sermons`
   - `documentaries`
   - `presentations`
   - `materials`
   - `community`
   - `avatars`
3. Set all buckets to **Public** for read access

### Authentication Issues

**Error**: Can't login
**Solution**:
1. Make sure user exists in Supabase Auth
2. Verify user has `role = 'admin'` in `user_profiles` table
3. Check that email/password are correct

---

## 📚 Database Tables Required

The following tables should exist in your Supabase database:

- `sermons`
- `documentaries`
- `presentations`
- `spiritual_materials`
- `user_profiles`
- `community_posts`
- `community_groups`
- `user_saved_content`
- `post_comments`
- `post_likes`

These match your mobile app's database schema.

---

## 🌐 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Deploy to Netlify

```bash
npm run build
netlify deploy --prod --dir=dist
```

Add environment variables in Netlify dashboard.

---

## 📞 Support

For issues:
1. Check the console for error messages
2. Verify Supabase credentials in `.env`
3. Ensure all database tables exist
4. Check that storage buckets are created

---

## ✅ Checklist

Before first run:
- [x] `.env` file created
- [x] Supabase credentials configured
- [ ] Storage buckets created in Supabase
- [ ] Admin user created in Supabase
- [ ] Admin user's role set to 'admin' in user_profiles table

**You're all set! Run `npm run dev` to start the admin panel. 🚀**
