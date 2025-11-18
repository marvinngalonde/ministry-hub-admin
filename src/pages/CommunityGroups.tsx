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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Community Groups</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage community groups</p>
        </div>
        <Button className="w-full sm:w-auto min-h-[44px] active:scale-95 transition-transform">
          <Plus className="w-4 h-4 sm:h-4 sm:w-4 mr-2" />
          Create Group
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        {isLoading ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Loading groups...</p>
          </div>
        ) : !groups?.length ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground">No groups found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <div className="rounded-md border">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                  <TableHead className="min-w-[150px]">Name</TableHead>
                  <TableHead className="min-w-[200px] hidden md:table-cell">Description</TableHead>
                  <TableHead className="min-w-[120px] hidden lg:table-cell">Created By</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right min-w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group: any) => (
                  <TableRow key={group.id}>
                    <TableCell className="hidden sm:table-cell">
                      {group.image_url && (
                        <img
                          src={group.image_url}
                          alt={group.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{group.name}</TableCell>
                    <TableCell className="max-w-md truncate hidden md:table-cell">{group.description || '-'}</TableCell>
                    <TableCell className="hidden lg:table-cell">{group.user_profiles?.full_name || 'Unknown'}</TableCell>
                    <TableCell className="hidden sm:table-cell">{new Date(group.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(group.id)}
                        title="Delete"
                        className="h-9 w-9 p-0"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
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
