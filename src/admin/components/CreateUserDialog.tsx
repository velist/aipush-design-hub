import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { userManagementService, type CreateUserData, type AdminUser } from '@/admin/services/userManagementService';

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: (user: AdminUser) => void;
}

const CreateUserDialog = ({ open, onOpenChange, onUserCreated }: CreateUserDialogProps) => {
  const [formData, setFormData] = useState<CreateUserData>({
    username: '',
    email: '',
    password: '',
    role: 'viewer',
    fullName: '',
    department: '',
    phone: ''
  });
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast({
        title: '表单验证失败',
        description: '请填写所有必填字段',
        variant: 'destructive'
      });
      return;
    }

    setCreating(true);
    try {
      const newUser = await userManagementService.createUser(formData);
      onUserCreated(newUser);
      onOpenChange(false);
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'viewer',
        fullName: '',
        department: '',
        phone: ''
      });
      toast({
        title: '创建成功',
        description: '用户已成功创建'
      });
    } catch (error: any) {
      toast({
        title: '创建失败',
        description: error.message || '创建用户时发生错误',
        variant: 'destructive'
      });
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>创建新用户</DialogTitle>
          <DialogDescription>
            为系统添加新的管理用户
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">用户名 *</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">邮箱 *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="请输入邮箱"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码 *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="请输入密码"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="role">角色</Label>
            <Select
              value={formData.role}
              onValueChange={(value: AdminUser['role']) => setFormData(prev => ({ ...prev, role: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="viewer">查看员</SelectItem>
                <SelectItem value="editor">编辑员</SelectItem>
                <SelectItem value="admin">管理员</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fullName">姓名</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="请输入姓名"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">部门</Label>
            <Input
              id="department"
              value={formData.department}
              onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
              placeholder="请输入部门"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">电话</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="请输入电话"
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? '创建中...' : '创建用户'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;