import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useMaterial, useUpdateMaterial } from '@/hooks/useMaterials';
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
  title: z.string().min(3),
  type: z.enum(['book', 'article', 'study_guide']),
  author: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published']),
});

type MaterialFormData = z.infer<typeof materialSchema>;

export default function MaterialEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: material, isLoading } = useMaterial(id!);
  const [uploadProgress, setUploadProgress] = useState<{ file: number; thumbnail: number }>({ file: 0, thumbnail: 0 });
  const updateMaterial = useUpdateMaterial(id!, setUploadProgress);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
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

  useEffect(() => {
    if (material) {
      form.reset({
        title: material.title,
        type: material.type,
        author: material.author || '',
        description: material.description || '',
        status: material.status,
      });
    }
  }, [material, form]);

  const onSubmit = async (data: MaterialFormData) => {
    const formData: any = { ...data };

    if (documentFile) {
      formData.document_file = documentFile;
    }

    if (thumbnailFile) {
      formData.thumbnail_file = thumbnailFile;
    }

    await updateMaterial.mutateAsync(formData);
    navigate('/materials');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!material) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Material not found</p>
        <Link to="/materials">
          <Button className="mt-4">Back to Materials</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/materials">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Material</h1>
          <p className="text-muted-foreground">Update material details and files</p>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                <Label>Document File</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Current: {material.content_url ? 'Uploaded' : 'None'}
                </p>
                <FileUpload
                  accept="application/pdf,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  maxSize={50 * 1024 * 1024}
                  onFileSelect={setDocumentFile}
                  label="Upload new document to replace current one"
                />
              </div>

              <div>
                <Label>Thumbnail Image</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Current: {material.thumbnail_url ? 'Uploaded' : 'None'}
                </p>
                {material.thumbnail_url && !thumbnailFile && (
                  <img
                    src={material.thumbnail_url}
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

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Publishing Options</h2>

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

          <UploadProgress progress={uploadProgress} show={updateMaterial.isPending} />

          <div className="flex justify-end gap-4">
            <Link to="/materials">
              <Button type="button" variant="outline" disabled={updateMaterial.isPending}>
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={updateMaterial.isPending}>
              {updateMaterial.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Material
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
