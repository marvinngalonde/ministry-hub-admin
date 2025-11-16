import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useSermon, useUpdateSermon } from '@/hooks/useSermons';
import { sermonSchema, type SermonFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/FileUpload';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SermonEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: sermon, isLoading } = useSermon(id!);
  const updateSermon = useUpdateSermon(id!);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<SermonFormData>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      title: '',
      speaker: '',
      description: '',
      duration: 0,
      featured: false,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (sermon) {
      form.reset({
        title: sermon.title,
        speaker: sermon.speaker,
        description: sermon.description || '',
        duration: sermon.duration,
        date_preached: sermon.date_preached,
        featured: sermon.featured,
        status: sermon.status,
      });
    }
  }, [sermon, form]);

  const onSubmit = async (data: SermonFormData) => {
    const formData: any = {
      ...data,
    };

    if (videoFile) {
      formData.video_file = videoFile;
    }

    if (thumbnailFile) {
      formData.thumbnail_file = thumbnailFile;
    }

    await updateSermon.mutateAsync(formData);
    navigate('/sermons');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!sermon) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Sermon not found</p>
        <Link to="/sermons">
          <Button className="mt-4">Back to Sermons</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/sermons">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Sermon</h1>
          <p className="text-muted-foreground">Update sermon details and media</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter sermon title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speaker *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter speaker name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter sermon description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="45"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date_preached"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date Preached</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Media Files</h2>

            <div className="space-y-6">
              <div>
                <Label>Video File</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Current: {sermon.video_url ? 'Uploaded' : 'None'}
                </p>
                <FileUpload
                  accept="video/*"
                  maxSize={2 * 1024 * 1024 * 1024} // 2GB
                  onFileSelect={setVideoFile}
                  label="Upload new video to replace current one"
                />
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Current: {sermon.thumbnail_url ? 'Uploaded' : 'None'}
                </p>
                {sermon.thumbnail_url && !thumbnailFile && (
                  <img
                    src={sermon.thumbnail_url}
                    alt="Current thumbnail"
                    className="w-48 h-28 object-cover rounded mb-2"
                  />
                )}
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024} // 5MB
                  onFileSelect={setThumbnailFile}
                  label="Upload new thumbnail to replace current one"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Publishing Options</h2>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Sermon</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Display this sermon prominently on the homepage
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Link to="/sermons">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateSermon.isPending}>
              {updateSermon.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Sermon
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
