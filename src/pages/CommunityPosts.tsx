import { useState } from 'react';
import { Search, Trash2, Filter } from 'lucide-react';
import { useCommunityPosts, useDeletePost } from '@/hooks/useCommunity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

export default function CommunityPosts() {
  const [search, setSearch] = useState('');
  const [postType, setPostType] = useState<'all' | 'group' | 'regular'>('all');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useCommunityPosts({
    search,
    page,
    perPage: 20,
    sortBy: 'latest',
  });

  console.log('📊 Community Posts:', { data, isLoading, error });

  const deletePost = useDeletePost();

  // Filter posts by type
  const filteredPosts = data?.posts.filter((post: any) => {
    if (postType === 'group') {
      return post.group_id !== null;
    } else if (postType === 'regular') {
      return post.group_id === null;
    }
    return true; // 'all'
  }) || [];

  const handleDelete = async () => {
    if (deleteId) {
      await deletePost.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Community Posts</h1>
        <p className="text-muted-foreground">Manage user posts and moderation</p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={postType} onValueChange={(v: any) => setPostType(v)}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="group">Group Posts Only</SelectItem>
              <SelectItem value="regular">Regular Posts Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {error ? (
          <div className="text-center py-12">
            <p className="text-destructive font-semibold">Error loading posts</p>
            <p className="text-sm text-muted-foreground mt-2">{(error as Error).message}</p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading posts...</p>
          </div>
        ) : !filteredPosts.length ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {postType === 'all' ? 'No posts found' : `No ${postType} posts found`}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Total posts in database: {data?.posts.length || 0}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPosts.map((post: any) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {post.user_profiles?.avatar_url && (
                          <img
                            src={post.user_profiles.avatar_url}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <span className="font-medium">
                          {post.user_profiles?.full_name || 'Unknown User'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="truncate">{post.content}</p>
                      {post.image_url && (
                        <img
                          src={post.image_url}
                          alt=""
                          className="w-20 h-12 object-cover rounded mt-2"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {post.community_groups?.name || '-'}
                    </TableCell>
                    <TableCell>
                      {new Date(post.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(post.id)}
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
            <AlertDialogTitle>Delete Post?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post and all associated comments. This action cannot be undone.
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
