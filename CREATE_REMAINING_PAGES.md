# Remaining Pages - Quick Copy-Paste Guide

I've created the core pages. Here are the remaining 8 pages you need to create by copying existing files:

## ✅ Already Created:
- Sermons (List, New, Edit)
- Documentaries (List, New, Edit)
- SermonEdit
- CommunityPosts
- useCommunity hook
- usePresentations hook
- useMaterials hook

## 📝 Create These 8 Pages:

### 1-3. Presentations (3 files)

**Copy `Documentaries.tsx` → `Presentations.tsx`**
- Replace: "documentary/documentaries" → "presentation/presentations"
- Replace: "Documentary" → "Presentation"
- Import: `import { usePresentations, useDeletePresentation, useBulkDeletePresentations } from '@/hooks/usePresentations';`
- Add "Type" column after "Title" showing: `presentation.type.replace('_', ' ')`

**Copy `DocumentaryNew.tsx` → `PresentationNew.tsx`**
- Same replacements
- Add after "title" field:
```typescript
<FormField
  control={form.control}
  name="type"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Type *</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
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
```
- Add "speaker" field (optional) after "title"
- Update schema to include type and speaker

**Copy `DocumentaryEdit.tsx` → `PresentationEdit.tsx`**
- Same changes as PresentationNew

### 4-6. Materials (3 files)

**Copy `Presentations.tsx` → `Materials.tsx`**
- Replace: "presentation/presentations" → "material/materials"
- Import: `import { useMaterials, useDeleteMaterial, useBulkDeleteMaterials } from '@/hooks/useMaterials';`
- Change "Speaker" column to "Author"
- Keep "Type" column

**Copy `PresentationNew.tsx` → `MaterialNew.tsx`**
- Change "video" to "document"
- Change FileUpload accept to: `accept="application/pdf,.pdf,.doc,.docx"`
- Change type options to: book, article, study_guide
- Add "author" field instead of "speaker"

**Copy `PresentationEdit.tsx` → `MaterialEdit.tsx`**
- Same changes as MaterialNew

### 7. CommunityGroups.tsx

```typescript
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useCommunityGroups, useDeleteGroup } from '@/hooks/useCommunity';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CommunityGroups() {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { data: groups, isLoading } = useCommunityGroups();
  const deleteGroup = useDeleteGroup();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteGroup.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Groups</h1>
          <p className="text-muted-foreground">Manage community groups</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : !groups?.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No groups found</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group: any) => (
                  <TableRow key={group.id}>
                    <TableCell>
                      {group.image_url && (
                        <img
                          src={group.image_url}
                          alt={group.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="max-w-md truncate">{group.description || '-'}</TableCell>
                    <TableCell>{group.user_profiles?.full_name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(group.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(group.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the group. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
```

### 8. Users.tsx

**Copy `Sermons.tsx` and adapt:**
```typescript
import { useUsers } from '@/hooks/useUsers';
// Show: Avatar, Name, Email, Role, Join Date
// No bulk operations needed for users
```

### 9. MediaLibrary.tsx

```typescript
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Library</h1>
          <p className="text-muted-foreground">Manage uploaded files</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </div>

      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : !files?.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No files found</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {files.map((file: any) => (
              <div key={file.name} className="border rounded-lg p-4">
                <div className="aspect-video bg-muted rounded mb-2 flex items-center justify-center">
                  {file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img src={file.url} alt={file.name} className="w-full h-full object-cover rounded" />
                  ) : (
                    <div className="text-4xl">📄</div>
                  )}
                </div>
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{file.bucket}</p>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="ghost" onClick={() => navigator.clipboard.writeText(file.url)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Trash2 className="h-4 w-4" />
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
```

### 10. Analytics.tsx

```typescript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/card';

export default function Analytics() {
  const { data: stats } = useQuery({
    queryKey: ['analytics-stats'],
    queryFn: async () => {
      const [sermons, users, posts, documentaries] = await Promise.all([
        supabase.from('sermons').select('*', { count: 'exact', head: true }),
        supabase.from('user_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('community_posts').select('*', { count: 'exact', head: true }),
        supabase.from('documentaries').select('*', { count: 'exact', head: true }),
      ]);

      return {
        totalSermons: sermons.count || 0,
        totalUsers: users.count || 0,
        totalPosts: posts.count || 0,
        totalDocumentaries: documentaries.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>

      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Sermons</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalSermons || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Total Users</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Community Posts</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalPosts || 0}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">Documentaries</h3>
          <p className="text-3xl font-bold mt-2">{stats?.totalDocumentaries || 0}</p>
        </Card>
      </div>
    </div>
  );
}
```

### 11. Settings.tsx

```typescript
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">General Settings</h2>
        <div className="space-y-4">
          <div>
            <Label>Site Title</Label>
            <Input placeholder="The Final Conflict Ministry" />
          </div>
          <div>
            <Label>Contact Email</Label>
            <Input type="email" placeholder="contact@ministry.org" />
          </div>
          <Button>Save Settings</Button>
        </div>
      </Card>
    </div>
  );
}
```

## Now Update App.tsx

Add all imports and routes - see next section in COMPLETE_IMPLEMENTATION.md
