import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Save, X } from 'lucide-react';

// 表单验证模式
const toolSchema = z.object({
  name: z.string().min(1, '工具名称不能为空'),
  description: z.string().min(1, '工具描述不能为空'),
  url: z.string().url('请输入有效的URL'),
  category: z.string().min(1, '请选择分类'),
  status: z.string().min(1, '请选择状态'),
  users: z.string().min(1, '用户数不能为空'),
  isExternal: z.boolean(),
  featured: z.boolean(),
});

type ToolFormData = z.infer<typeof toolSchema>;

interface AddToolDialogProps {
  onAddTool?: (tool: any) => void;
}

const AddToolDialog = ({ onAddTool }: AddToolDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ToolFormData>({
    resolver: zodResolver(toolSchema),
    defaultValues: {
      name: '',
      description: '',
      url: '',
      category: '',
      status: '规划中',
      users: '',
      isExternal: false,
      featured: false,
    },
  });

  const onSubmit = async (data: ToolFormData) => {
    setIsLoading(true);
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newTool = {
        id: Date.now(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
        visits: 0,
      };
      
      onAddTool?.(newTool);
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error('添加工具失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { value: '对话', label: '对话' },
    { value: '绘画', label: '绘画' },
    { value: '视频', label: '视频' },
    { value: '语音', label: '语音' },
    { value: '办公', label: '办公' },
    { value: '开发', label: '开发' },
    { value: '资讯', label: '资讯' },
    { value: '其他', label: '其他' },
  ];

  const statuses = [
    { value: '已上线', label: '已上线' },
    { value: '开发中', label: '开发中' },
    { value: '规划中', label: '规划中' },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>添加工具</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>添加新工具</DialogTitle>
          <DialogDescription>
            填写工具信息以添加到AI工具集合中
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* 基础信息 */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">工具名称 *</Label>
                <Input
                  id="name"
                  {...form.register('name')}
                  placeholder="输入工具名称"
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">工具链接 *</Label>
                <Input
                  id="url"
                  {...form.register('url')}
                  placeholder="https://example.com"
                />
                {form.formState.errors.url && (
                  <p className="text-sm text-red-500">{form.formState.errors.url.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">工具描述 *</Label>
              <Textarea
                id="description"
                {...form.register('description')}
                placeholder="输入工具的详细描述"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>分类 *</Label>
                <Select onValueChange={(value) => form.setValue('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>状态 *</Label>
                <Select 
                  onValueChange={(value) => form.setValue('status', value)}
                  defaultValue="规划中"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.status && (
                  <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="users">用户数量 *</Label>
                <Input
                  id="users"
                  {...form.register('users')}
                  placeholder="如: 1K+, 10M+"
                />
                {form.formState.errors.users && (
                  <p className="text-sm text-red-500">{form.formState.errors.users.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* 高级设置 */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-lg font-medium">高级设置</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="isExternal">外部工具</Label>
                <p className="text-sm text-gray-500">
                  标记为外部工具（非本站开发）
                </p>
              </div>
              <Switch
                id="isExternal"
                checked={form.watch('isExternal')}
                onCheckedChange={(checked) => form.setValue('isExternal', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="featured">推荐工具</Label>
                <p className="text-sm text-gray-500">
                  在首页重点展示此工具
                </p>
              </div>
              <Switch
                id="featured"
                checked={form.watch('featured')}
                onCheckedChange={(checked) => form.setValue('featured', checked)}
              />
            </div>
          </div>

          {/* 表单操作 */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              取消
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? '添加中...' : '添加工具'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolDialog;