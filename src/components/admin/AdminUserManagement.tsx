import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Users, Search, Eye, Pencil, UserPlus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  role: string;
  avatar_url?: string | null;
  created_at?: string;
}

interface AdminUserManagementProps {
  users: UserWithRole[];
  setUsers: (users: UserWithRole[]) => void;
  currentUserId: string;
  fetching: boolean;
}

const AdminUserManagement = ({ users, setUsers, currentUserId, fetching }: AdminUserManagementProps) => {
  const [updatingRole, setUpdatingRole] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [viewUser, setViewUser] = useState<UserWithRole | null>(null);
  const [editUser, setEditUser] = useState<UserWithRole | null>(null);
  const [editName, setEditName] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addForm, setAddForm] = useState({ email: '', password: '', full_name: '', role: 'user' });
  const [saving, setSaving] = useState(false);
  const [userProfile, setUserProfile] = useState<Record<string, any> | null>(null);
  const { toast } = useToast();

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRole(userId);
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole as 'admin' | 'user' })
        .eq('user_id', userId);
      if (error) throw error;
      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      toast({ title: 'Role updated', description: `User role changed to ${newRole}` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleViewUser = async (u: UserWithRole) => {
    setViewUser(u);
    const { data } = await supabase.from('profiles').select('*').eq('user_id', u.user_id).single();
    setUserProfile(data);
  };

  const handleEditOpen = (u: UserWithRole) => {
    setEditUser(u);
    setEditName(u.full_name || '');
  };

  const handleEditSave = async () => {
    if (!editUser) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: editName })
        .eq('user_id', editUser.user_id);
      if (error) throw error;
      setUsers(users.map(u => u.user_id === editUser.user_id ? { ...u, full_name: editName } : u));
      toast({ title: 'Updated', description: 'User details have been updated.' });
      setEditUser(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async () => {
    if (!addForm.email || !addForm.password) return;
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({ action: 'create', ...addForm }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to create user');
      toast({ title: 'User created', description: `${addForm.email} has been added.` });
      setShowAddDialog(false);
      setAddForm({ email: '', password: '', full_name: '', role: 'user' });
      // Refresh users
      const [profilesRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name'),
        supabase.from('user_roles').select('user_id, role'),
      ]);
      if (profilesRes.data && rolesRes.data) {
        const merged = profilesRes.data.map(p => ({
          ...p,
          role: rolesRes.data.find(r => r.user_id === p.user_id)?.role ?? 'user',
        }));
        setUsers(merged);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const filtered = users.filter(u =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    u.user_id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage registered users and their roles</p>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)}>
          <UserPlus size={14} /> Add User
        </Button>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="flex items-center gap-2 text-lg font-display">
              <Users size={20} className="text-primary" /> All Users ({users.length})
            </CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {fetching ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-lg bg-muted/50 animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No users found.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((u) => (
                <div key={u.user_id} className="flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                      {(u.full_name || 'U')[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{u.full_name || 'No name'}</p>
                      <p className="text-xs text-muted-foreground font-mono">{u.user_id.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleViewUser(u)} title="View details">
                      <Eye size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEditOpen(u)} title="Edit user">
                      <Pencil size={14} />
                    </Button>
                    <Badge variant={u.role === 'admin' ? 'default' : 'secondary'} className="text-xs">
                      {u.role}
                    </Badge>
                    <Select
                      value={u.role}
                      onValueChange={(value) => handleRoleChange(u.user_id, value)}
                      disabled={updatingRole === u.user_id || u.user_id === currentUserId}
                    >
                      <SelectTrigger className="w-28 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Details Dialog */}
      <Dialog open={!!viewUser} onOpenChange={(open) => !open && setViewUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Viewing profile information for this user.</DialogDescription>
          </DialogHeader>
          {viewUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {(viewUser.full_name || 'U')[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-foreground text-lg">{viewUser.full_name || 'No name'}</p>
                  <Badge variant={viewUser.role === 'admin' ? 'default' : 'secondary'}>{viewUser.role}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-mono text-foreground text-xs">{viewUser.user_id}</span>
                </div>
                {userProfile?.created_at && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Joined</span>
                    <span className="text-foreground">{new Date(userProfile.created_at).toLocaleDateString()}</span>
                  </div>
                )}
                {userProfile?.avatar_url && (
                  <div className="flex justify-between py-2 border-b border-border">
                    <span className="text-muted-foreground">Avatar</span>
                    <img src={userProfile.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                  </div>
                )}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewUser(null)}>Close</Button>
            <Button onClick={() => { if (viewUser) { handleEditOpen(viewUser); setViewUser(null); } }}>
              <Pencil size={14} /> Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user profile information.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={editName} onChange={e => setEditName(e.target.value)} placeholder="Enter full name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
            <Button onClick={handleEditSave} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Full Name</Label><Input value={addForm.full_name} onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))} placeholder="John Doe" /></div>
            <div><Label>Email *</Label><Input type="email" value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="user@example.com" /></div>
            <div><Label>Password *</Label><Input type="password" value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} placeholder="Min 6 characters" /></div>
            <div>
              <Label>Role</Label>
              <Select value={addForm.role} onValueChange={v => setAddForm(f => ({ ...f, role: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button onClick={handleAddUser} disabled={saving || !addForm.email || !addForm.password}>
              {saving ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserManagement;
