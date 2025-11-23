import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { sermonSchema, type SermonFormData } from '@/lib/validations';
import { useCreateSermon } from '@/hooks/useSermons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileUpload } from '@/components/FileUpload';
import { RichTextEditor } from '@/components/RichTextEditor';
import { UploadProgress } from '@/components/UploadProgress';

export default function SermonNew() {
  const navigate = useNavigate();
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      status: 'draft',
      featured: false,
    },
  });

  const createSermon = useCreateSermon(setUploadProgress);

  const onSubmit = async (data: SermonFormData) => {
    if (!videoFile || !thumbnailFile) {
      return;
    }

    await createSermon.mutateAsync({
      ...data,
      description,
      video_file: videoFile,
      thumbnail_file: thumbnailFile,
    });

    navigate('/sermons');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/sermons')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Upload New Sermon</h1>
          <p className="text-muted-foreground">Add a new sermon video</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Enter sermon title"
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker *</Label>
              <Input
                id="speaker"
                {...register('speaker')}
                placeholder="Enter speaker name"
              />
              {errors.speaker && (
                <p className="text-sm text-destructive">{errors.speaker.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes) *</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="45"
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date_preached">Date Preached</Label>
              <Input
                id="date_preached"
                type="date"
                {...register('date_preached')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor
              content={description}
              onChange={setDescription}
              placeholder="Enter sermon description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Video File *</Label>
              <FileUpload
                onFileSelect={setVideoFile}
                accept={{ 'video/*': ['.mp4', '.mov', '.avi'] }}
                maxSize={10 * 1024 * 1024 * 1024} // 10GB
                label="Drop video here or click to upload"
                fileType="video"
              />
              {!videoFile && (
                <p className="text-sm text-destructive">Video file is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Thumbnail *</Label>
              <FileUpload
                onFileSelect={setThumbnailFile}
                accept={{ 'image/*': ['.jpg', '.jpeg', '.png'] }}
                maxSize={5 * 1024 * 1024} // 5MB
                label="Drop thumbnail here or click to upload"
                fileType="image"
              />
              {!thumbnailFile && (
                <p className="text-sm text-destructive">Thumbnail is required</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-0.5">
              <Label>Featured Sermon</Label>
              <p className="text-sm text-muted-foreground">
                Display this sermon prominently on the home page
              </p>
            </div>
            <Switch
              checked={watch('featured')}
              onCheckedChange={(checked) => setValue('featured', checked)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'draft' | 'published') => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Save as Draft</SelectItem>
                <SelectItem value="published">Publish Now</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <UploadProgress progress={uploadProgress} show={createSermon.isPending} />

        <div className="flex items-center gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/sermons')} disabled={createSermon.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!videoFile || !thumbnailFile || createSermon.isPending}
          >
            {createSermon.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Upload Sermon
          </Button>
        </div>
      </form>
    </div>
  );
}
