import { toast } from '@/hooks/use-toast';
import { deleteFileFromUrl, uploadFile } from '@/lib/storage';
import { supabase } from '@/lib/supabase';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export interface MaterialFormData {
  title: string;
  type: 'book' | 'article' | 'study_guide';
  author?: string;
  description?: string;
  status: 'draft' | 'published';
}

export interface MaterialFilters {
  search?: string;
  type?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'latest' | 'oldest' | 'title';
  page: number;
  perPage: number;
}

export function useMaterials(filters: MaterialFilters) {
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => {
      let query = supabase
        .from('spiritual_materials')
        .select('*', { count: 'exact' });

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
      }

      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type);
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

      return { materials: data || [], total: count || 0 };
    },
  });
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['material', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('spiritual_materials')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateMaterial(onUploadProgress?: (progress: { file: number; thumbnail: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: MaterialFormData & {
      file: File;
      thumbnail_file: File;
    }) => {
      let fileProgress = 0;
      let thumbnailProgress = 0;

      const updateProgress = () => {
        onUploadProgress?.({ file: fileProgress, thumbnail: thumbnailProgress });
      };

      // Upload document file
      const fileUrl = await uploadFile(
        formData.file,
        'spiritual-materials',
        'documents',
        (progress) => {
          fileProgress = progress;
          updateProgress();
        }
      );

      // Upload thumbnail
      const thumbnailUrl = await uploadFile(
        formData.thumbnail_file,
        'spiritual-materials',
        'thumbnails',
        (progress) => {
          thumbnailProgress = progress;
          updateProgress();
        }
      );

      const { data, error } = await supabase
        .from('spiritual_materials')
        .insert({
          title: formData.title,
          type: formData.type,
          author: formData.author,
          description: formData.description,
          file_url: fileUrl,
          thumbnail_url: thumbnailUrl,
          status: formData.status,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({
        title: 'Success',
        description: 'Material uploaded successfully!',
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload material',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateMaterial(id: string, onUploadProgress?: (progress: { file: number; thumbnail: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<MaterialFormData> & {
      file?: File;
      thumbnail_file?: File;
    }) => {
      let fileUrl: string | undefined;
      let thumbnailUrl: string | undefined;
      let fileProgress = 100;
      let thumbnailProgress = 100;

      const updateProgress = () => {
        onUploadProgress?.({ file: fileProgress, thumbnail: thumbnailProgress });
      };

      if (formData.file) {
        fileProgress = 0;
        fileUrl = await uploadFile(
          formData.file,
          'spiritual-materials',
          'documents',
          (progress) => {
            fileProgress = progress;
            updateProgress();
          }
        );
      }

      if (formData.thumbnail_file) {
        thumbnailProgress = 0;
        thumbnailUrl = await uploadFile(
          formData.thumbnail_file,
          'spiritual-materials',
          'thumbnails',
          (progress) => {
            thumbnailProgress = progress;
            updateProgress();
          }
        );
      }

      const updateData: any = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (fileUrl) updateData.file_url = fileUrl;
      if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl;

      delete updateData.file;
      delete updateData.thumbnail_file;

      const { data, error } = await supabase
        .from('spiritual_materials')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      queryClient.invalidateQueries({ queryKey: ['material', id] });
      toast({
        title: 'Success',
        description: 'Material updated successfully!',
      });
    },
  });
}

export function useDeleteMaterial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: material } = await supabase
        .from('spiritual_materials')
        .select('file_url, thumbnail_url')
        .eq('id', id)
        .single();

      const { error } = await supabase.from('spiritual_materials').delete().eq('id', id);
      if (error) throw error;

      if (material?.file_url) {
        await deleteFileFromUrl(material.file_url, 'spiritual-materials');
      }
      if (material?.thumbnail_url) {
        await deleteFileFromUrl(material.thumbnail_url, 'spiritual-materials');
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({
        title: 'Success',
        description: 'Material deleted successfully',
      });
    },
  });
}

export function useBulkDeleteMaterials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('spiritual_materials').delete().in('id', ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ['materials'] });
      toast({
        title: 'Success',
        description: `${ids.length} materials deleted`,
      });
    },
  });
}
