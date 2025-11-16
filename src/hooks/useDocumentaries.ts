import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { uploadFile, deleteFileFromUrl } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import type { DocumentaryFormData } from '@/lib/validations';

export interface DocumentaryFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'latest' | 'oldest' | 'title';
  page: number;
  perPage: number;
}

export function useDocumentaries(filters: DocumentaryFilters) {
  return useQuery({
    queryKey: ['documentaries', filters],
    queryFn: async () => {
      let query = supabase.from('documentaries').select('*', { count: 'exact' });

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      switch (filters.sortBy) {
        case 'latest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'title':
          query = query.order('title', { ascending: true });
          break;
      }

      const from = (filters.page - 1) * filters.perPage;
      const to = from + filters.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;
      if (error) throw error;

      return { documentaries: data || [], total: count || 0 };
    },
  });
}

export function useCreateDocumentary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: DocumentaryFormData & {
      video_file: File;
      thumbnail_file: File;
    }) => {
      const videoUrl = await uploadFile(formData.video_file, 'documentaries', 'videos');
      const thumbnailUrl = await uploadFile(formData.thumbnail_file, 'documentaries', 'thumbnails');

      const { data, error } = await supabase
        .from('documentaries')
        .insert({
          title: formData.title,
          description: formData.description,
          duration: formData.duration,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          status: formData.status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentaries'] });
      toast({
        title: 'Success',
        description: 'Documentary uploaded successfully!',
      });
    },
  });
}

export function useDocumentary(id: string) {
  return useQuery({
    queryKey: ['documentary', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('documentaries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateDocumentary(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<DocumentaryFormData> & {
      video_file?: File;
      thumbnail_file?: File;
    }) => {
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        status: formData.status,
      };

      if (formData.video_file) {
        const { data: doc } = await supabase
          .from('documentaries')
          .select('video_url')
          .eq('id', id)
          .single();

        if (doc?.video_url) {
          await deleteFileFromUrl(doc.video_url, 'documentaries');
        }

        updateData.video_url = await uploadFile(formData.video_file, 'documentaries', 'videos');
      }

      if (formData.thumbnail_file) {
        const { data: doc } = await supabase
          .from('documentaries')
          .select('thumbnail_url')
          .eq('id', id)
          .single();

        if (doc?.thumbnail_url) {
          await deleteFileFromUrl(doc.thumbnail_url, 'documentaries');
        }

        updateData.thumbnail_url = await uploadFile(formData.thumbnail_file, 'documentaries', 'thumbnails');
      }

      const { data, error } = await supabase
        .from('documentaries')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentaries'] });
      queryClient.invalidateQueries({ queryKey: ['documentary', id] });
      toast({
        title: 'Success',
        description: 'Documentary updated successfully!',
      });
    },
  });
}

export function useDeleteDocumentary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: doc } = await supabase
        .from('documentaries')
        .select('video_url, thumbnail_url')
        .eq('id', id)
        .single();

      const { error } = await supabase.from('documentaries').delete().eq('id', id);
      if (error) throw error;

      if (doc?.video_url) await deleteFileFromUrl(doc.video_url, 'documentaries');
      if (doc?.thumbnail_url) await deleteFileFromUrl(doc.thumbnail_url, 'documentaries');

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentaries'] });
      toast({
        title: 'Success',
        description: 'Documentary deleted successfully',
      });
    },
  });
}

export function useBulkDeleteDocumentaries() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { data: docs } = await supabase
        .from('documentaries')
        .select('id, video_url, thumbnail_url')
        .in('id', ids);

      const { error } = await supabase.from('documentaries').delete().in('id', ids);
      if (error) throw error;

      if (docs) {
        for (const doc of docs) {
          if (doc.video_url) await deleteFileFromUrl(doc.video_url, 'documentaries');
          if (doc.thumbnail_url) await deleteFileFromUrl(doc.thumbnail_url, 'documentaries');
        }
      }

      return ids;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentaries'] });
      toast({
        title: 'Success',
        description: 'Documentaries deleted successfully',
      });
    },
  });
}
