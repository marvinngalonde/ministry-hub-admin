import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type CommunityPost, type CommunityGroup } from '@/lib/supabase';
import { uploadFile, deleteFileFromUrl } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

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
      // First get posts
      let query = supabase
        .from('community_posts')
        .select('*', { count: 'exact' });

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

      const { data: posts, error, count } = await query;

      console.log('🔍 Community Posts Query Result:', { posts, error, count });

      if (error) {
        console.error('❌ Community Posts Error:', error);
        throw error;
      }

      if (!posts || posts.length === 0) {
        return { posts: [], total: count || 0 };
      }

      // Get unique user IDs and group IDs
      const userIds = [...new Set(posts.map(p => p.user_id).filter(Boolean))];
      const groupIds = [...new Set(posts.map(p => p.group_id).filter(Boolean))];

      // Fetch user profiles
      const { data: users } = await supabase
        .from('user_profiles')
        .select('id, full_name, avatar_url')
        .in('id', userIds);

      // Fetch groups
      const { data: groups } = groupIds.length > 0
        ? await supabase
            .from('community_groups')
            .select('id, name')
            .in('id', groupIds)
        : { data: [] };

      // Combine data
      const enrichedPosts = posts.map(post => ({
        ...post,
        user_profiles: users?.find(u => u.id === post.user_id) || null,
        community_groups: groups?.find(g => g.id === post.group_id) || null,
      }));

      console.log('✅ Enriched Posts:', enrichedPosts);

      return { posts: enrichedPosts, total: count || 0 };
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

export function useCommunityGroups() {
  return useQuery({
    queryKey: ['community-groups'],
    queryFn: async () => {
      // Get groups
      const { data: groups, error } = await supabase
        .from('community_groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!groups || groups.length === 0) {
        return [];
      }

      // Get unique creator IDs
      const creatorIds = [...new Set(groups.map(g => g.created_by).filter(Boolean))];

      // Fetch creators
      const { data: creators } = await supabase
        .from('user_profiles')
        .select('id, full_name')
        .in('id', creatorIds);

      // Combine data
      const enrichedGroups = groups.map(group => ({
        ...group,
        user_profiles: creators?.find(c => c.id === group.created_by) || null,
      }));

      return enrichedGroups;
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
