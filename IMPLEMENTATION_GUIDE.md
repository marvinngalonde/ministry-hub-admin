# Ministry Hub Admin - Complete Implementation Guide

This document contains all the code needed to complete the admin web app with full CRUD functionality.

## Status

✅ **Completed:**
- Sermons (List, Create, hooks with full CRUD)
- Dashboard
- Login/Auth
- UI Components (shadcn/ui)
- Base layouts
- Presentations hooks
- Materials hooks
- Documentaries hooks
- Users hooks

❌ **Missing Pages (Need to be created):**
1. `/sermons/[id]/edit` - Edit sermon page
2. `/documentaries` - List page
3. `/documentaries/new` - Create page
4. `/documentaries/[id]/edit` - Edit page
5. `/presentations` - List page
6. `/presentations/new` - Create page
7. `/presentations/[id]/edit` - Edit page
8. `/materials` - List page
9. `/materials/new` - Create page
10. `/materials/[id]/edit` - Edit page
11. `/community/posts` - Posts management page
12. `/community/groups` - Groups management page
13. `/users` - Users list page
14. `/users/[id]` - User detail/edit page
15. `/media` - Media library page
16. `/analytics` - Analytics dashboard
17. `/settings` - Settings page

❌ **Missing Hooks:**
1. `useCommunity.ts` - Community posts and groups
2. `useAnalytics.ts` - Analytics data

## Files Created

### Hooks
- ✅ `src/hooks/useSermons.ts` - Full CRUD for sermons
- ✅ `src/hooks/useDocumentaries.ts` - Full CRUD for documentaries
- ✅ `src/hooks/usePresentations.ts` - Full CRUD for presentations
- ✅ `src/hooks/useMaterials.ts` - Full CRUD for materials
- ✅ `src/hooks/useUsers.ts` - User management
- ❌ `src/hooks/useCommunity.ts` - **NEEDS TO BE CREATED**
- ❌ `src/hooks/useAnalytics.ts` - **NEEDS TO BE CREATED**

## Quick Start Implementation

### Step 1: Create Missing Hooks

#### src/hooks/useCommunity.ts
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type CommunityPost, type CommunityGroup } from '@/lib/supabase';
import { uploadFile, deleteFileFromUrl } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

// Community Posts
export interface PostFilters {
  search?: string;
  groupId?: string;
  status?: string;
  sortBy?: 'latest' | 'likes' | 'comments';
  page: number;
  perPage: number;
}

export function useCommunityPosts(filters: PostFilters) {
  return useQuery({
    queryKey: ['community-posts', filters],
    queryFn: async () => {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          user_profiles!community_posts_user_id_fkey (
            id,
            full_name,
            avatar_url
          ),
          community_groups (
            id,
            name
          )
        `, { count: 'exact' });

      if (filters.search) {
        query = query.ilike('content', `%${filters.search}%`);
      }

      if (filters.groupId) {
        query = query.eq('group_id', filters.groupId);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      query = query.order('created_at', { ascending: false });

      const from = (filters.page - 1) * filters.perPage;
      const to = from + filters.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return { posts: data || [], total: count || 0 };
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-posts'] });
      toast({ title: 'Success', description: 'Post deleted' });
    },
  });
}

// Community Groups
export function useCommunityGroups() {
  return useQuery({
    queryKey: ['community-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('community_groups')
        .select(`
          *,
          user_profiles!community_groups_created_by_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: {
      name: string;
      description?: string;
      image_file?: File;
      created_by: string;
    }) => {
      let imageUrl: string | undefined;

      if (formData.image_file) {
        imageUrl = await uploadFile(formData.image_file, 'community', 'groups');
      }

      const { data, error } = await supabase
        .from('community_groups')
        .insert({
          name: formData.name,
          description: formData.description,
          image_url: imageUrl,
          created_by: formData.created_by,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-groups'] });
      toast({ title: 'Success', description: 'Group created successfully!' });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (groupId: string) => {
      const { error } = await supabase
        .from('community_groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community-groups'] });
      toast({ title: 'Success', description: 'Group deleted' });
    },
  });
}
```

### Step 2: Create Page Templates

All pages follow the same pattern as `Sermons.tsx`. Here's a template you can adapt:

#### Template for List Pages (Documentaries, Presentations, Materials)

Copy `src/pages/Sermons.tsx` and adapt:
1. Change imports to use the correct hook
2. Change "sermons" to "documentaries/presentations/materials"
3. Adjust table columns based on content type
4. Update routes

#### Template for Create/Edit Pages

Copy `src/pages/SermonNew.tsx` and adapt based on content type.

### Step 3: Update App.tsx Routing

Replace the placeholder routes in `App.tsx`:

```typescript
// Replace "Coming Soon" placeholders with actual pages:
<Route path="sermons/:id/edit" element={<SermonEdit />} />
<Route path="documentaries" element={<Documentaries />} />
<Route path="documentaries/new" element={<DocumentaryNew />} />
<Route path="documentaries/:id/edit" element={<DocumentaryEdit />} />
<Route path="presentations" element={<Presentations />} />
<Route path="presentations/new" element={<PresentationNew />} />
<Route path="presentations/:id/edit" element={<PresentationEdit />} />
<Route path="materials" element={<Materials />} />
<Route path="materials/new" element={<MaterialNew />} />
<Route path="materials/:id/edit" element={<MaterialEdit />} />
<Route path="community/posts" element={<CommunityPosts />} />
<Route path="community/groups" element={<CommunityGroups />} />
<Route path="users" element={<Users />} />
<Route path="users/:id" element={<UserDetail />} />
<Route path="media" element={<MediaLibrary />} />
<Route path="analytics" element={<Analytics />} />
<Route path="settings" element={<Settings />} />
```

## Implementation Priority

1. **High Priority** (Core Content Management):
   - Sermon Edit page
   - Documentaries (List, Create, Edit)
   - Presentations (List, Create, Edit)
   - Materials (List, Create, Edit)

2. **Medium Priority** (Community):
   - Community Posts management
   - Community Groups management

3. **Low Priority** (Admin):
   - Users management
   - Media Library
   - Analytics
   - Settings

## Testing Checklist

- [ ] Can create sermons with video/thumbnail upload
- [ ] Can edit sermons and replace files
- [ ] Can delete sermons (files are cleaned up)
- [ ] Can bulk delete sermons
- [ ] Same for documentaries
- [ ] Same for presentations
- [ ] Same for materials
- [ ] Can view and delete community posts
- [ ] Can create and delete community groups
- [ ] Can manage users and roles
- [ ] Media library shows all uploaded files
- [ ] Analytics displays correct data

## Notes

- All hooks follow the same pattern
- All pages use the same UI components (shadcn/ui)
- File uploads use the shared `uploadFile` helper
- All mutations invalidate React Query cache correctly
- Error handling with toast notifications
- Loading states on all async operations
