import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Trash2, Eye } from 'lucide-react';
import { usePresentations, useDeletePresentation, useBulkDeletePresentations } from '@/hooks/usePresentations';
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

export default function Presentations() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState<string>('all');
  const [status, setStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'oldest' | 'title'>('latest');
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = usePresentations({
    search,
    type,
    status,
    sortBy,
    page,
    perPage: 20,
  });

  const deletePresentation = useDeletePresentation();
  const bulkDelete = useBulkDeletePresentations();

  const handleDelete = async () => {
    if (deleteId) {
      await deletePresentation.mutateAsync(deleteId);
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
    if (selectedIds.length === data?.presentations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data?.presentations.map((p) => p.id) || []);
    }
  };

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      podcast: 'Podcast',
      family_foundations: 'Family Foundations',
      spiritual_health: 'Spiritual Health',
      bible_studies: 'Bible Studies',
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Presentations</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage presentations and teaching content</p>
        </div>
        <Link to="/presentations/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto min-h-[44px] active:scale-95 transition-transform">
            <Plus className="w-4 h-4 sm:h-4 sm:w-4 mr-2" />
            Upload Presentation
          </Button>
        </Link>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4 sm:h-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or speaker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 min-h-[44px]"
            />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
              <Filter className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="podcast">Podcast</SelectItem>
              <SelectItem value="family_foundations">Family Foundations</SelectItem>
              <SelectItem value="spiritual_health">Spiritual Health</SelectItem>
              <SelectItem value="bible_studies">Bible Studies</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v: any) => setStatus(v)}>
            <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
              <Filter className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
            <SelectTrigger className="w-full sm:w-[180px] min-h-[44px]">
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
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <p className="text-sm sm:text-base text-muted-foreground">
              {selectedIds.length} selected
            </p>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={bulkDelete.isPending}
              className="w-full sm:w-auto min-h-[44px]"
            >
              <Trash2 className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Loading presentations...</p>
          </div>
        ) : !data?.presentations.length ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground">No presentations found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <div className="rounded-md border">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedIds.length === data.presentations.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-[100px] hidden sm:table-cell">Thumbnail</TableHead>
                  <TableHead className="min-w-[150px]">Title</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Type</TableHead>
                  <TableHead className="min-w-[120px] hidden md:table-cell">Speaker</TableHead>
                  <TableHead className="min-w-[100px] hidden xl:table-cell">Duration</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Status</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.presentations.map((presentation) => (
                  <TableRow key={presentation.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(presentation.id)}
                        onCheckedChange={() => toggleSelect(presentation.id)}
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        src={presentation.thumbnail_url}
                        alt={presentation.title}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{presentation.title}</TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge variant="outline">{getTypeLabel(presentation.type)}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{presentation.speaker || 'N/A'}</TableCell>
                    <TableCell className="hidden xl:table-cell">{presentation.duration} min</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={presentation.status === 'published' ? 'default' : 'secondary'}>
                        {presentation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(presentation.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Link to={`/presentations/${presentation.id}/edit`}>
                          <Button variant="ghost" size="sm" title="Edit" className="h-9 w-9 p-0">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(presentation.id)}
                          title="Delete"
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
              </div>
            </div>
          </div>
        )}
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="mx-4 sm:mx-auto max-w-[calc(100%-2rem)] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Presentation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the presentation and all associated files. This action cannot be undone.
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
