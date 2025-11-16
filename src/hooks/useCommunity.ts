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
