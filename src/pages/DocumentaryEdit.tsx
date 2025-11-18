import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useDocumentary, useUpdateDocumentary } from '@/hooks/useDocumentaries';
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

const documentarySchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  duration: z.number().min(1),
  status: z.enum(['draft', 'published']),
});

type DocumentaryFormData = z.infer<typeof documentarySchema>;

export default function DocumentaryEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: documentary, isLoading } = useDocumentary(id!);
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 });
  const updateDocumentary = useUpdateDocumentary(id!, setUploadProgress);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<DocumentaryFormData>({
    resolver: zodResolver(documentarySchema),
    defaultValues: {
      title: '',
      description: '',
      duration: 0,
      status: 'draft',
    },
  });

  useEffect(() => {
    if (documentary) {
      form.reset({
        title: documentary.title,
        description: documentary.description || '',
        duration: documentary.duration,
        status: documentary.status,
      });
    }
  }, [documentary, form]);

  const onSubmit = async (data: DocumentaryFormData) => {
    const formData: any = { ...data };

    if (videoFile) {
      formData.video_file = videoFile;
    }

    if (thumbnailFile) {
      formData.thumbnail_file = thumbnailFile;
    }

    await updateDocumentary.mutateAsync(formData);
    navigate('/documentaries');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!documentary) {
    return (
      <div className="text-center py-12">
        <p className="text-sm sm:text-base text-muted-foreground">Documentary not found</p>
        <Link to="/documentaries">
          <Button className="mt-4">Back to Documentaries</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex items-center gap-3 sm:gap-4">
        <Link to="/documentaries">
          <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Documentary</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Update documentary details and media</p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
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
                      <Input placeholder="Enter documentary title" {...field} />
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
                        placeholder="Enter documentary description..."
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label>Video File</Label>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Current: {documentary.video_url ? 'Uploaded' : 'None'}
                </p>
                <FileUpload
                  accept="video/*"
                  maxSize={10 * 1024 * 1024 * 1024}
                  onFileSelect={setVideoFile}
                  label="Upload new video to replace current one"
                />
              </div>

              <div className="space-y-2">
                <Label>Thumbnail Image</Label>
                <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                  Current: {documentary.thumbnail_url ? 'Uploaded' : 'None'}
                </p>
                {documentary.thumbnail_url && !thumbnailFile && (
                  <img
                    src={documentary.thumbnail_url}
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

          <UploadProgress progress={uploadProgress} show={updateDocumentary.isPending} />

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link to="/documentaries" className="w-full sm:w-auto order-2 sm:order-1">
              <Button type="button" variant="outline" disabled={updateDocumentary.isPending} className="w-full">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateDocumentary.isPending} className="w-full sm:w-auto order-1 sm:order-2">
              {updateDocumentary.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Documentary
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
