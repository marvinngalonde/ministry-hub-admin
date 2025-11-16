import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { uploadFile } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import type { UserFormData } from '@/lib/validations';

export interface UserFilters {
  search?: string;
  role?: string;
  sortBy?: 'name' | 'date' | 'email';
  page: number;
  perPage: number;
}

export function useUsers(filters: UserFilters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      let query = supabase.from('user_profiles').select('*', { count: 'exact' });

      if (filters.search) {
        query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`);
      }

      if (filters.role && filters.role !== 'all') {
        query = query.eq('role', filters.role);
      }

      switch (filters.sortBy) {
        case 'name':
          query = query.order('full_name', { ascending: true });
          break;
        case 'email':
          query = query.order('email', { ascending: true });
          break;
        case 'date':
          query = query.order('created_at', { ascending: false });
          break;
      }

      const from = (filters.page - 1) * filters.perPage;
      const to = from + filters.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return { users: data || [], total: count || 0 };
    },
  });
}

export function useUpdateUser(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: Partial<UserFormData> & { avatar_file?: File }) => {
      let avatarUrl;
      if (userData.avatar_file) {
        avatarUrl = await uploadFile(userData.avatar_file, 'avatars', 'users');
      }

      const updateData: any = {
        ...userData,
        updated_at: new Date().toISOString(),
      };

      if (avatarUrl) updateData.avatar_url = avatarUrl;
      delete updateData.avatar_file;

      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User updated successfully',
      });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: 'Success',
        description: 'User deleted successfully',
      });
    },
  });
}
