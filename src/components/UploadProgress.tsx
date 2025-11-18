import { Card } from '@/components/ui/card';

interface UploadProgressProps {
  progress: {
    video?: number;
    thumbnail?: number;
    file?: number;
  };
  show: boolean;
}

export function UploadProgress({ progress, show }: UploadProgressProps) {
  if (!show) return null;

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Uploading Files...</h3>
        <div className="space-y-3">
          {progress.video !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Video</span>
                <span className="text-sm font-medium">{Math.round(progress.video)}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress.video}%` }}
                />
              </div>
            </div>
          )}
          {progress.thumbnail !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Thumbnail</span>
                <span className="text-sm font-medium">{Math.round(progress.thumbnail)}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress.thumbnail}%` }}
                />
              </div>
            </div>
          )}
          {progress.file !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">File</span>
                <span className="text-sm font-medium">{Math.round(progress.file)}%</span>
              </div>
              <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${progress.file}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
