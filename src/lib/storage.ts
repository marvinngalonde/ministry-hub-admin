import { supabase } from './supabase';
import { toast } from '@/hooks/use-toast';

export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'complete' | 'error';
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: string,
  folder: string = '',
  onProgress?: (progress: number) => void
): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Simulate progress if callback provided
    if (onProgress) {
      onProgress(0);
      const progressInterval = setInterval(() => {
        onProgress(Math.min(90, Math.random() * 100));
      }, 500);

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      clearInterval(progressInterval);
      onProgress(100);

      if (error) throw error;
    } else {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;
    }

    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    toast({
      title: 'Upload failed',
      description: error instanceof Error ? error.message : 'Failed to upload file',
      variant: 'destructive',
    });
    throw error;
  }
}

/**
 * Delete a file from Supabase Storage using its URL
 */
export async function deleteFileFromUrl(url: string, bucket: string): Promise<void> {
  try {
    // Extract file path from URL
    const urlParts = url.split(`/storage/v1/object/public/${bucket}/`);
    if (urlParts.length < 2) {
      console.warn('Could not extract file path from URL:', url);
      return;
    }

    const filePath = urlParts[1];

    const { error } = await supabase.storage.from(bucket).remove([filePath]);

    if (error) {
      console.error('Failed to delete file:', error);
      throw error;
    }
  } catch (error) {
    console.error('Delete error:', error);
    // Don't throw - file deletion is not critical
  }
}

/**
 * Validate file type and size
 */
export function validateFile(
  file: File,
  options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
  }
): { valid: boolean; error?: string } {
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = options.maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size must be less than ${maxSizeMB}MB`,
    };
  }

  if (options.allowedTypes && options.allowedTypes.length > 0) {
    // Get file extension
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();

    // Check if any allowed type matches
    const isAllowed = options.allowedTypes.some(type => {
      // Check file extension
      if (type.startsWith('.')) {
        return type.toLowerCase() === fileExt;
      }
      // Check MIME type
      return file.type.startsWith(type.replace('*', ''));
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: `File type not allowed. Allowed types: ${options.allowedTypes.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
