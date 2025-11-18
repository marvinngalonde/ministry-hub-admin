import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Copy } from 'lucide-react';

export default function MediaLibrary() {
  const { data: files, isLoading } = useQuery({
    queryKey: ['media-files'],
    queryFn: async () => {
      const buckets = ['sermons', 'documentaries', 'presentations', 'materials', 'community', 'avatars'];
      const allFiles: any[] = [];

      for (const bucket of buckets) {
        const { data } = await supabase.storage.from(bucket).list();
        if (data) {
          allFiles.push(...data.map(file => ({
            ...file,
            bucket,
            url: supabase.storage.from(bucket).getPublicUrl(file.name).data.publicUrl
          })));
        }
      }

      return allFiles;
    },
  });

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Media Library</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage uploaded files across all buckets</p>
        </div>
        <Button className="w-full sm:w-auto min-h-[44px] active:scale-95 transition-transform">
          <Upload className="w-4 h-4 sm:h-4 sm:w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Loading files...</p>
          </div>
        ) : !files?.length ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {files.map((file: any, index: number) => (
              <div key={`${file.bucket}-${file.name}-${index}`} className="border rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center overflow-hidden">
                  {file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded" />
                  ) : file.name.match(/\.(mp4|mov|avi)$/i) ? (
                    <div className="text-4xl">🎬</div>
                  ) : file.name.match(/\.(pdf|doc|docx)$/i) ? (
                    <div className="text-4xl">📄</div>
                  ) : (
                    <div className="text-4xl">📁</div>
                  )}
                </div>
                <p className="text-xs sm:text-sm font-medium truncate" title={file.name}>{file.name}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground capitalize">{file.bucket}</p>
                <div className="flex gap-1 sm:gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(file.url);
                      alert('URL copied to clipboard!');
                    }}
                    title="Copy URL"
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" title="Delete file" className="h-8 w-8 p-0 flex-shrink-0">
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
