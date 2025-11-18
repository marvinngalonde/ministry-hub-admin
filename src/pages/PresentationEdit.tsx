import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { usePresentation, useUpdatePresentation } from '@/hooks/usePresentations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUpload } from '@/components/FileUpload';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { UploadProgress } from '@/components/UploadProgress';
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

const presentationSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['podcast', 'family_foundations', 'spiritual_health', 'bible_studies']),
  speaker: z.string().optional(),
  description: z.string().optional(),
  duration: z.number().min(1),
  status: z.enum(['draft', 'published']),
});

type PresentationFormData = z.infer<typeof presentationSchema>;

export default function PresentationEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: presentation, isLoading } = usePresentation(id!);
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 });
  const updatePresentation = useUpdatePresentation(id!, setUploadProgress);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<PresentationFormData>({
    resolver: zodResolver(presentationSchema),
    defaultValues: {
      title: '',
      type: 'podcast',
      speaker: '',
      description: '',
      duration: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (presentation) {
      form.reset({
        title: presentation.title,
        type: presentation.type,
        speaker: presentation.speaker || '',
        description: presentation.description || '',
        duration: presentation.duration,
        status: presentation.status,
      });
    }
  }, [presentation, form]);

  const onSubmit = async (data: PresentationFormData) => {
    const formData: any = { ...data };

    if (videoFile) {
      formData.video_file = videoFile;
    }

    if (thumbnailFile) {
      formData.thumbnail_file = thumbnailFile;
    }

    await updatePresentation.mutateAsync(formData);
    navigate('/presentations');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!presentation) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground">Presentation not found</p>
        <Link to="/presentations">
          <Button className="mt-4">Back to Presentations</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/presentations">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Presentation</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Update presentation details and media</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Basic Information</h2>

            <div className="space-y-3 sm:space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter presentation title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="podcast">Podcast</SelectItem>
                        <SelectItem value="family_foundations">Family Foundations</SelectItem>
                        <SelectItem value="spiritual_health">Spiritual Health</SelectItem>
                        <SelectItem value="bible_studies">Bible Studies</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="speaker"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Speaker</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter speaker name (optional)" {...field} />
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
                        value={field.value || ''}
                        onChange={field.onChange}
                        placeholder="Enter presentation description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="60"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Media Files</h2>

            <div className="space-y-3 sm:space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
              <div>
                <Label>Video File</Label>
                <p className="text-sm text-sm sm:text-base text-muted-foreground mb-2">
                  Current: {presentation.video_url ? 'Uploaded' : 'None'}
                </p>
                <FileUpload
                  accept="video/*"
                  maxSize={10 * 1024 * 1024 * 1024}
                  onFileSelect={setVideoFile}
                  label="Upload new video to replace current one"
                />
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <p className="text-sm text-sm sm:text-base text-muted-foreground mb-2">
                  Current: {presentation.thumbnail_url ? 'Uploaded' : 'None'}
                </p>
                {presentation.thumbnail_url && !thumbnailFile && (
                  <img
                    src={presentation.thumbnail_url}
                    alt="Current thumbnail"
                    className="w-48 h-28 object-cover rounded mb-2"
                  />
                )}
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  onFileSelect={setThumbnailFile}
                  label="Upload new thumbnail to replace current one"
                />
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Publishing Options</h2>

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
          </Card>

          <UploadProgress progress={uploadProgress} show={updatePresentation.isPending} />

          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Link to="/presentations">
              <Button type="button" variant="outline" disabled={updatePresentation.isPending}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updatePresentation.isPending}>
              {updatePresentation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Presentation
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
