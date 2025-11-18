import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Presentation } from '@/lib/supabase';
import { uploadFile, deleteFileFromUrl } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';

export interface PresentationFormData {
  title: string;
  type: 'podcast' | 'family_foundations' | 'spiritual_health' | 'bible_studies';
  speaker?: string;
  description?: string;
  duration: number;
  status: 'draft' | 'published';
}

export interface PresentationFilters {
  search?: string;
  type?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'latest' | 'oldest' | 'title';
  page: number;
  perPage: number;
}

export function usePresentations(filters: PresentationFilters) {
  return useQuery({
    queryKey: ['presentations', filters],
    queryFn: async () => {
      let query = supabase
        .from('presentations')
        .select('*', { count: 'exact' });

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,speaker.ilike.%${filters.search}%`);
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

      return { presentations: data || [], total: count || 0 };
    },
  });
}

export function usePresentation(id: string) {
  return useQuery({
    queryKey: ['presentation', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('presentations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreatePresentation(onUploadProgress?: (progress: { video: number; thumbnail: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: PresentationFormData & {
      video_file: File;
      thumbnail_file: File;
    }) => {
      let videoProgress = 0;
      let thumbnailProgress = 0;

      const updateProgress = () => {
        onUploadProgress?.({ video: videoProgress, thumbnail: thumbnailProgress });
      };

      // Upload video
      const videoUrl = await uploadFile(
        formData.video_file,
        'presentations',
        'videos',
        (progress) => {
          videoProgress = progress;
          updateProgress();
        }
      );

      // Upload thumbnail
      const thumbnailUrl = await uploadFile(
        formData.thumbnail_file,
        'presentations',
        'thumbnails',
        (progress) => {
          thumbnailProgress = progress;
          updateProgress();
        }
      );

      const { data, error } = await supabase
        .from('presentations')
        .insert({
          title: formData.title,
          type: formData.type,
          speaker: formData.speaker,
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
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
      toast({
        title: 'Success',
        description: 'Presentation uploaded successfully!',
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload presentation',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdatePresentation(id: string, onUploadProgress?: (progress: { video: number; thumbnail: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<PresentationFormData> & {
      video_file?: File;
      thumbnail_file?: File;
    }) => {
      let videoUrl: string | undefined;
      let thumbnailUrl: string | undefined;
      let videoProgress = 100;
      let thumbnailProgress = 100;

      const updateProgress = () => {
        onUploadProgress?.({ video: videoProgress, thumbnail: thumbnailProgress });
      };

      if (formData.video_file) {
        videoProgress = 0;
        videoUrl = await uploadFile(
          formData.video_file,
          'presentations',
          'videos',
          (progress) => {
            videoProgress = progress;
            updateProgress();
          }
        );
      }

      if (formData.thumbnail_file) {
        thumbnailProgress = 0;
        thumbnailUrl = await uploadFile(
          formData.thumbnail_file,
          'presentations',
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

      if (videoUrl) updateData.video_url = videoUrl;
      if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl;

      delete updateData.video_file;
      delete updateData.thumbnail_file;

      const { data, error } = await supabase
        .from('presentations')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
      queryClient.invalidateQueries({ queryKey: ['presentation', id] });
      toast({
        title: 'Success',
        description: 'Presentation updated successfully!',
      });
    },
  });
}

export function useDeletePresentation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: presentation } = await supabase
        .from('presentations')
        .select('video_url, thumbnail_url')
        .eq('id', id)
        .single();

      const { error } = await supabase.from('presentations').delete().eq('id', id);
      if (error) throw error;

      if (presentation?.video_url) {
        await deleteFileFromUrl(presentation.video_url, 'presentations');
      }
      if (presentation?.thumbnail_url) {
        await deleteFileFromUrl(presentation.thumbnail_url, 'presentations');
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
      toast({
        title: 'Success',
        description: 'Presentation deleted successfully',
      });
    },
  });
}

export function useBulkDeletePresentations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from('presentations').delete().in('id', ids);
      if (error) throw error;
      return ids;
    },
    onSuccess: (ids) => {
      queryClient.invalidateQueries({ queryKey: ['presentations'] });
      toast({
        title: 'Success',
        description: `${ids.length} presentations deleted`,
      });
    },
  });
}
