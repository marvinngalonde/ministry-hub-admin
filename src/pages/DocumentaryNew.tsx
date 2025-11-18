import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateDocumentary } from '@/hooks/useDocumentaries';
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
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  status: z.enum(['draft', 'published']),
});

type DocumentaryFormData = z.infer<typeof documentarySchema>;

export default function DocumentaryNew() {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 });
  const createDocumentary = useCreateDocumentary(setUploadProgress);
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

  const onSubmit = async (data: DocumentaryFormData) => {
    if (!videoFile || !thumbnailFile) {
      alert('Please upload both video and thumbnail files');
      return;
    }

    await createDocumentary.mutateAsync({
      ...data,
      video_file: videoFile,
      thumbnail_file: thumbnailFile,
    });

    navigate('/documentaries');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/documentaries">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Upload Documentary</h1>
          <p className="text-muted-foreground">Add a new documentary to the library</p>
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

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Media Files</h2>

            <div className="space-y-6">
              <div>
                <Label>Video File *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload the documentary video (MP4, MOV, or AVI - Max 2GB)
                </p>
                <FileUpload
                  accept="video/*"
                  maxSize={10 * 1024 * 1024 * 1024}
                  onFileSelect={setVideoFile}
                  label="Drag & drop or click to upload video"
                />
                {videoFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {videoFile.name} selected
                  </p>
                )}
              </div>

              <div>
                <Label>Thumbnail Image *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload a thumbnail image (JPG or PNG - Recommended 1920x1080)
                </p>
                <FileUpload
                  accept="image/*"
                  maxSize={5 * 1024 * 1024}
                  onFileSelect={setThumbnailFile}
                  label="Drag & drop or click to upload thumbnail"
                />
                {thumbnailFile && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {thumbnailFile.name} selected
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Publishing Options</h2>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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

          <UploadProgress progress={uploadProgress} show={createDocumentary.isPending} />

          <div className="flex justify-end gap-4">
            <Link to="/documentaries">
              <Button type="button" variant="outline" disabled={createDocumentary.isPending}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createDocumentary.isPending || !videoFile || !thumbnailFile}>
              {createDocumentary.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Documentary
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
