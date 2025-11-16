import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileVideo, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { validateFile, formatFileSize } from '@/lib/storage';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  preview?: string;
  className?: string;
  fileType?: 'video' | 'image' | 'document';
}

export function FileUpload({
  onFileSelect,
  accept,
  maxSize = 2 * 1024 * 1024 * 1024, // 2GB default
  label = 'Drop file here or click to upload',
  preview,
  className,
  fileType = 'video',
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError('');
      const file = acceptedFiles[0];

      if (!file) return;

      const validation = validateFile(file, {
        maxSize,
        allowedTypes: accept ? Object.keys(accept).flatMap((key) => accept[key]) : undefined,
      });

      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);

      // Simulate upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    },
    [onFileSelect, maxSize, accept]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    multiple: false,
  });

  const clearFile = () => {
    setSelectedFile(null);
    setError('');
    setUploadProgress(0);
  };

  const getFileIcon = () => {
    switch (fileType) {
      case 'video':
        return <FileVideo className="h-12 w-12 text-muted-foreground" />;
      case 'image':
        return <ImageIcon className="h-12 w-12 text-muted-foreground" />;
      default:
        return <Upload className="h-12 w-12 text-muted-foreground" />;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {!selectedFile && !preview && (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50 hover:bg-accent/50',
            error && 'border-destructive'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            {getFileIcon()}
            <div className="space-y-1">
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">
                Max size: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedFile && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearFile}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-1">
              <Progress value={uploadProgress} className="h-1" />
              <p className="text-xs text-muted-foreground text-right">
                {uploadProgress}%
              </p>
            </div>
          )}
        </div>
      )}

      {preview && !selectedFile && (
        <div className="border border-border rounded-lg p-2">
          {fileType === 'image' ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover rounded"
            />
          ) : (
            <video
              src={preview}
              controls
              className="w-full h-48 rounded"
            />
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => document.getElementById('file-input')?.click()}
            className="mt-2 w-full"
          >
            Replace File
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
