import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Search, 
  UserPlus, 
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Key,
  Eye,
  Loader2,
  RefreshCw,
  Users,
  UserCheck,
  UserX,
  Crown
} from 'lucide-react';
import { userManagementService, type AdminUser, type UserFilters, type UserStats, type CreateUserData } from '@/admin/services/userManagementService';
import { authService } from '@/admin/services/authService';

const UserManagement = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const { toast } = useToast();

  const canManage = authService.hasPermission('users:write') || authService.hasPermission('all');
  const canDelete = authService.hasPermission('users:delete') || authService.hasPermission('all');
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData, departmentsData] = await Promise.all([
        userManagementService.getAllUsers(),
        userManagementService.getUserStats(),
        userManagementService.getDepartments()
      ]);
      setUsers(usersData);
      setStats(statsData);
      setDepartments(departmentsData);
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载用户数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast({
      title: '刷新成功',
      description: '用户数据已更新'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' ? user.isActive : !user.isActive);
    const matchesDepartment = departmentFilter === 'all' || user.department === departmentFilter;
    
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const updatedUser = await userManagementService.toggleUserStatus(user.id);
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      toast({
        title: updatedUser.isActive ? '用户已激活' : '用户已禁用',
        description: `用户 "${user.username}" 的状态已更新`
      });
      // 重新加载统计数据
      const newStats = await userManagementService.getUserStats();
      setStats(newStats);
    } catch (error: any) {
      toast({
        title: '操作失败',
        description: error.message || '更新用户状态时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await userManagementService.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
      setDeletingUserId(null);
      toast({
        title: '删除成功',
        description: '用户已成功删除'
      });
      // 重新加载统计数据
      const newStats = await userManagementService.getUserStats();
      setStats(newStats);
    } catch (error: any) {
      toast({
        title: '删除失败',
        description: error.message || '删除用户时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleResetPassword = async () => {
    if (!showPasswordReset || !newPassword) return;
    
    try {
      await userManagementService.resetPassword(showPasswordReset.id, newPassword);
      setShowPasswordReset(null);
      setNewPassword('');
      toast({
        title: '密码重置成功',
        description: `用户 "${showPasswordReset.username}" 的密码已重置`
      });
    } catch (error: any) {
      toast({
        title: '重置失败',
        description: error.message || '重置密码时发生错误',
        variant: 'destructive'
      });
    }
  };

  const getRoleIcon = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'editor': return <Edit className="h-4 w-4" />;
      case 'viewer': return <Eye className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleName = (role: AdminUser['role']) => {
    switch (role) {
      case 'admin': return '管理员';
      case 'editor': return '编辑员';
      case 'viewer': return '查看员';
      default: return '未知';
    }
  };

  const getRoleVariant = (role: AdminUser['role']): "default" | "secondary" | "destructive" | "outline" => {
    switch (role) {
      case 'admin': return 'default';
      case 'editor': return 'secondary';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-2">管理系统用户和权限设置</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          {canManage && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              添加用户
            </Button>
          )}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索用户名、邮箱或姓名..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="角色" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部角色</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
                <SelectItem value="editor">编辑员</SelectItem>
                <SelectItem value="viewer">查看员</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="active">激活</SelectItem>
                <SelectItem value="inactive">禁用</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="部门" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部部门</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">总用户数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-sm text-gray-600">活跃用户</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
              <p className="text-sm text-gray-600">管理员</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats.editors}</div>
              <p className="text-sm text-gray-600">编辑员</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-600">{stats.viewers}</div>
              <p className="text-sm text-gray-600">查看员</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.recentLogins}</div>
              <p className="text-sm text-gray-600">近期登录</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 用户列表 */}
      <Card>
        <CardHeader>
          <CardTitle>用户列表</CardTitle>
          <CardDescription>
            共找到 {filteredUsers.length} 个用户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.avatar || user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-lg">{user.fullName || user.username}</h3>
                        <Badge variant={getRoleVariant(user.role)} className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>{getRoleName(user.role)}</span>
                        </Badge>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? '激活' : '禁用'}
                        </Badge>
                        {user.id === currentUser?.id && (
                          <Badge variant="outline" className="text-blue-600 border-blue-200">
                            当前用户
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>用户名: {user.username}</p>
                        <p>邮箱: {user.email}</p>
                        {user.department && <p>部门: {user.department}</p>}
                        {user.phone && <p>电话: {user.phone}</p>}
                        <p>创建时间: {new Date(user.createdAt).toLocaleDateString()}</p>
                        {user.lastLogin && (
                          <p>最后登录: {new Date(user.lastLogin).toLocaleDateString()}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {canManage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingUser(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            编辑
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(user)}>
                            {user.isActive ? (
                              <>
                                <ShieldOff className="h-4 w-4 mr-2" />
                                禁用
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                激活
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setShowPasswordReset(user)}>
                            <Key className="h-4 w-4 mr-2" />
                            重置密码
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {canDelete && user.id !== currentUser?.id && (
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => setDeletingUserId(user.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              删除
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到用户</h3>
              <p className="text-gray-600">尝试调整搜索条件或添加新用户</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingUserId} onOpenChange={() => setDeletingUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个用户吗？此操作不可恢复，用户的所有数据将被永久删除。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingUserId && handleDeleteUser(deletingUserId)}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 密码重置对话框 */}
      <Dialog open={!!showPasswordReset} onOpenChange={() => setShowPasswordReset(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重置密码</DialogTitle>
            <DialogDescription>
              为用户 "{showPasswordReset?.username}" 设置新密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">新密码</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="请输入新密码"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordReset(null)}>
              取消
            </Button>
            <Button onClick={handleResetPassword} disabled={!newPassword}>
              重置密码
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;