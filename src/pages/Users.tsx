import { useState } from 'react';
import { Search, UserPlus, Trash2 } from 'lucide-react';
import { useUsers } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Users() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useUsers({
    search,
    page,
    perPage: 20,
    role: 'all',
  });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'editor':
        return 'default';
      case 'moderator':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Users</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="w-full sm:w-auto min-h-[44px] active:scale-95 transition-transform">
          <UserPlus className="w-4 h-4 sm:h-4 sm:w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-4 sm:h-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 min-h-[44px]"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground">Loading users...</p>
          </div>
        ) : !data?.users.length ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-sm sm:text-base text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle px-4 sm:px-0">
              <div className="rounded-md border">
                <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">User</TableHead>
                  <TableHead className="min-w-[200px] hidden md:table-cell">Email</TableHead>
                  <TableHead className="min-w-[100px] hidden sm:table-cell">Role</TableHead>
                  <TableHead className="min-w-[100px] hidden lg:table-cell">Joined</TableHead>
                  <TableHead className="text-right min-w-[120px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <img
                            src={user.avatar_url}
                            alt={user.full_name || 'User'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <span className="text-sm font-medium">
                              {(user.full_name || user.email || 'U')[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="font-medium">{user.full_name || 'No name'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <Button variant="ghost" size="sm" title="Edit" className="h-9 px-3">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete" className="h-9 w-9 p-0">
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
    </div>
  );
}
