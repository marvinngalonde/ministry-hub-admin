import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Eye, Edit } from 'lucide-react';
import { useSermons, useDeleteSermon, useBulkDeleteSermons } from '@/hooks/useSermons';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Card } from '@/components/ui/card';

export default function Sermons() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title'>('latest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useSermons({
    search,
    status,
    sortBy,
    page,
    perPage: 20,
  });

  // Debug logging
  console.log('📊 Sermons Page Data:', { data, isLoading, error });

  const deleteSermon = useDeleteSermon();
  const bulkDelete = useBulkDeleteSermons();

  const handleDelete = async () => {
    if (deleteId) {
      await deleteSermon.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length > 0) {
      await bulkDelete.mutateAsync(selectedIds);
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data?.sermons.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.sermons.map((s) => s.id) || []);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sermons</h1>
          <p className="text-muted-foreground">Manage sermon videos and content</p>
        </div>
        <Link to="/sermons/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload Sermon
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or speaker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="title">Title A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedIds.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              {selectedIds.length} selected
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDelete.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-semibold">Error loading sermons</p>
            <p className="text-sm text-muted-foreground mt-2">{(error as Error).message}</p>
            <p className="text-xs text-muted-foreground mt-4">Check the browser console for details</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading sermons...</p>
          </div>
        ) : !data?.sermons.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No sermons found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Total in database: {data?.total || 0}
            </p>
            <Link to="/sermons/new" className="mt-4 inline-block">
              <Button>Upload Your First Sermon</Button>
            </Link>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === data.sermons.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px]">Thumbnail</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Speaker</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.sermons.map((sermon) => (
                  <TableRow key={sermon.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(sermon.id)}
                        onCheckedChange={() => toggleSelect(sermon.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <img
                        src={sermon.thumbnail_url}
                        alt={sermon.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{sermon.title}</TableCell>
                    <TableCell>{sermon.speaker}</TableCell>
                    <TableCell>{sermon.duration} min</TableCell>
                    <TableCell>
                      <Badge variant={sermon.status === 'published' ? 'default' : 'secondary'}>
                        {sermon.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(sermon.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(sermon.video_url, '_blank')}
                          title="View Video"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link to={`/sermons/${sermon.id}/edit`}>
                          <Button variant="ghost" size="sm" title="Edit">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(sermon.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
            <AlertDialogTitle>Delete Sermon?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the sermon and all associated files. This action cannot be undone.
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
