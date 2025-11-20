import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useCreateMaterial } from '@/hooks/useMaterials';
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

const materialSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  type: z.enum(['book', 'article', 'study_guide']),
  author: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function MaterialNew() {
  const navigate = useNavigate();
  const [uploadProgress, setUploadProgress] = useState<{ file: number; thumbnail: number }>({ file: 0, thumbnail: 0 });
  const createMaterial = useCreateMaterial(setUploadProgress);
  const [file, setFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: {
      title: '',
      type: 'book',
      author: '',
      description: '',
      status: 'draft',
    },
  });

  const onSubmit = async (data: MaterialFormData) => {
    if (!file || !thumbnailFile) {
      alert('Please upload both document and thumbnail files');
      return;
    }

    await createMaterial.mutateAsync({
      ...data,
      file: file,
      thumbnail_file: thumbnailFile,
    });

    navigate('/materials');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/materials">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Upload Material</h1>
          <p className="text-muted-foreground">Add a new spiritual material to the library</p>
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
                      <Input placeholder="Enter material title" {...field} />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="book">Book</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="study_guide">Study Guide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name (optional)" {...field} />
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
                        placeholder="Enter material description..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Files</h2>

            <div className="space-y-6">
              <div>
                <Label>File *</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Upload the document (PDF, DOC, etc. - Max 50MB)
                </p>
                <FileUpload
                  accept={{ 'application/*': ['.pdf', '.doc', '.docx'] }}
                  maxSize={50 * 1024 * 1024}
                  onFileSelect={setFile}
                  label="Drag & drop or click to upload document"
                />
                {file && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {file.name} selected
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

          <UploadProgress progress={uploadProgress} show={createMaterial.isPending} />

          <div className="flex justify-end gap-4">
            <Link to="/materials">
              <Button type="button" variant="outline" disabled={createMaterial.isPending}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createMaterial.isPending || !file || !thumbnailFile}>
              {createMaterial.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Upload Material
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
