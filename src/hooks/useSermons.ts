import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, type Sermon } from '@/lib/supabase';
import { uploadFile, deleteFileFromUrl } from '@/lib/storage';
import { toast } from '@/hooks/use-toast';
import type { SermonFormData } from '@/lib/validations';

export interface SermonFilters {
  search?: string;
  status?: 'all' | 'published' | 'draft';
  sortBy?: 'latest' | 'oldest' | 'title';
  page: number;
  perPage: number;
}

export function useSermons(filters: SermonFilters) {
  return useQuery({
    queryKey: ['sermons', filters],
    queryFn: async () => {
      let query = supabase
        .from('sermons')
        .select('*', { count: 'exact' });

      // Search
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,speaker.ilike.%${filters.search}%`);
      }

      // Filter by status
      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }

      // Sort
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
        default:
          query = query.order('created_at', { ascending: false });
      }

      // Pagination
      const from = (filters.page - 1) * filters.perPage;
      const to = from + filters.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      console.log('🔍 Sermons Query Result:', {
        data,
        error,
        count,
        filters,
        dataLength: data?.length
      });

      if (error) {
        console.error('❌ Sermons Query Error:', error);
        throw error;
      }

      return { sermons: data || [], total: count || 0 };
    },
  });
}

export function useSermon(id: string) {
  return useQuery({
    queryKey: ['sermon', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateSermon(onUploadProgress?: (progress: { video: number; thumbnail: number; audio?: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: SermonFormData & {
      video_file: File;
      thumbnail_file: File;
      audio_file?: File; // Optional audio file
    }) => {
      let videoProgress = 0;
      let thumbnailProgress = 0;
      let audioProgress = 0;

      const updateProgress = () => {
        onUploadProgress?.({ video: videoProgress, thumbnail: thumbnailProgress, audio: audioProgress });
      };

      // Upload video
      const videoUrl = await uploadFile(
        formData.video_file,
        'sermons',
        'videos',
        (progress) => {
          videoProgress = progress;
          updateProgress();
        }
      );

      // Upload thumbnail
      const thumbnailUrl = await uploadFile(
        formData.thumbnail_file,
        'sermons',
        'thumbnails',
        (progress) => {
          thumbnailProgress = progress;
          updateProgress();
        }
      );

      // Upload audio if provided
      let audioUrl: string | undefined;
      if (formData.audio_file) {
        audioUrl = await uploadFile(
          formData.audio_file,
          'sermons',
          'audio',
          (progress) => {
            audioProgress = progress;
            updateProgress();
          }
        );
      }

      // Insert sermon
      const { data, error } = await supabase
        .from('sermons')
        .insert({
          title: formData.title,
          speaker: formData.speaker,
          description: formData.description,
          duration: formData.duration,
          video_url: videoUrl,
          thumbnail_url: thumbnailUrl,
          audio_url: audioUrl, // Include audio URL
          featured: formData.featured,
          status: formData.status,
          date_preached: formData.date_preached || new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      toast({
        title: 'Success',
        description: 'Sermon uploaded successfully!',
      });
    },
    onError: (error) => {
      console.error('Upload error:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload sermon',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateSermon(sermonId: string, onUploadProgress?: (progress: { video: number; thumbnail: number; audio?: number }) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: Partial<SermonFormData> & {
      video_file?: File;
      thumbnail_file?: File;
      audio_file?: File; // Optional audio file
    }) => {
      let videoUrl: string | undefined;
      let thumbnailUrl: string | undefined;
      let audioUrl: string | undefined;
      let videoProgress = 100;
      let thumbnailProgress = 100;
      let audioProgress = 100;

      const updateProgress = () => {
        onUploadProgress?.({ video: videoProgress, thumbnail: thumbnailProgress, audio: audioProgress });
      };

      // Upload new video if provided
      if (formData.video_file) {
        videoProgress = 0;
        videoUrl = await uploadFile(
          formData.video_file,
          'sermons',
          'videos',
          (progress) => {
            videoProgress = progress;
            updateProgress();
          }
        );
      }

      // Upload new thumbnail if provided
      if (formData.thumbnail_file) {
        thumbnailProgress = 0;
        thumbnailUrl = await uploadFile(
          formData.thumbnail_file,
          'sermons',
          'thumbnails',
          (progress) => {
            thumbnailProgress = progress;
            updateProgress();
          }
        );
      }

      // Upload new audio if provided
      if (formData.audio_file) {
        audioProgress = 0;
        // Optionally, fetch existing sermon to delete old audio file
        const { data: existingSermon } = await supabase
          .from('sermons')
          .select('audio_url')
          .eq('id', sermonId)
          .single();
        if (existingSermon?.audio_url) {
          await deleteFileFromUrl(existingSermon.audio_url, 'sermons');
        }
        audioUrl = await uploadFile(
          formData.audio_file,
          'sermons',
          'audio',
          (progress) => {
            audioProgress = progress;
            updateProgress();
          }
        );
      }

      // Update sermon
      const updateData: any = {
        ...formData,
        updated_at: new Date().toISOString(),
      };

      if (videoUrl) updateData.video_url = videoUrl;
      if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl;
      if (audioUrl) updateData.audio_url = audioUrl; // Include audio URL

      // Remove file objects from update data
      delete updateData.video_file;
      delete updateData.thumbnail_file;
      delete updateData.audio_file; // Remove audio file object

      const { data, error } = await supabase
        .from('sermons')
        .update(updateData)
        .eq('id', sermonId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      queryClient.invalidateQueries({ queryKey: ['sermon', sermonId] });
      toast({
        title: 'Success',
        description: 'Sermon updated successfully!',
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update sermon',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sermonId: string) => {
      // Get sermon to access file URLs
      const { data: sermon } = await supabase
        .from('sermons')
        .select('video_url, thumbnail_url')
        .eq('id', sermonId)
        .single();

      // Delete sermon from database
      const { error } = await supabase.from('sermons').delete().eq('id', sermonId);

      if (error) throw error;

      // Delete files from storage
      if (sermon?.video_url) {
        await deleteFileFromUrl(sermon.video_url, 'sermons');
      }
      if (sermon?.thumbnail_url) {
        await deleteFileFromUrl(sermon.thumbnail_url, 'sermons');
      }

      return sermonId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      toast({
        title: 'Success',
        description: 'Sermon deleted successfully',
      });
    },
    onError: (error) => {
      console.error('Delete error:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete sermon',
        variant: 'destructive',
      });
    },
  });
}

export function useBulkDeleteSermons() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sermonIds: string[]) => {
      const { error } = await supabase.from('sermons').delete().in('id', sermonIds);

      if (error) throw error;
      return sermonIds;
    },
    onSuccess: (sermonIds) => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      toast({
        title: 'Success',
        description: `${sermonIds.length} sermons deleted`,
      });
    },
  });
}

export function useBulkUpdateStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sermonIds,
      status,
    }: {
      sermonIds: string[];
      status: 'published' | 'draft';
    }) => {
      const { error } = await supabase
        .from('sermons')
        .update({ status })
        .in('id', sermonIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sermons'] });
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      });
    },
  });
}
