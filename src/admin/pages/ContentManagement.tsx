import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { 
  Search, 
  Plus, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  Calendar,
  User,
  Tag,
  Loader2,
  RefreshCw
} from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'image' | 'video' | 'link';
  content?: string;
  url?: string;
  thumbnail?: string;
  description?: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  category: string;
  tags: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  featured: boolean;
}

const ContentManagement = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { toast } = useToast();

  // 生产环境初始状态（空内容）
  const categories = ['公告', '教程', '新闻', '更新日志', '帮助文档'];
  
  useEffect(() => {
    loadContents();
  }, []);

  const loadContents = async () => {
    setLoading(true);
    // 生产环境初始为空
    setContents([]);
    setLoading(false);
  };

  const filteredContents = contents.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || content.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || content.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || content.category === categoryFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory;
  });

  const handleCreateContent = () => {
    setShowCreateDialog(true);
  };

  const handleEditContent = (content: ContentItem) => {
    setEditingContent(content);
  };

  const handleDeleteContent = async (id: string) => {
    try {
      setContents(contents.filter(c => c.id !== id));
      setDeletingId(null);
      toast({
        title: '删除成功',
        description: '内容已成功删除'
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: '删除内容时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      setContents(contents.map(content => 
        content.id === id ? { ...content, featured: !content.featured } : content
      ));
      toast({
        title: '更新成功',
        description: '内容特色状态已更新'
      });
    } catch (error) {
      toast({
        title: '更新失败',
        description: '更新特色状态时发生错误',
        variant: 'destructive'
      });
    }
  };

  const getTypeIcon = (type: ContentItem['type']) => {
    switch (type) {
      case 'article': return <FileText className="h-4 w-4" />;
      case 'image': return <ImageIcon className="h-4 w-4" />;
      case 'video': return <Video className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ContentItem['status']) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      case 'archived': return '已归档';
      default: return '未知';
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
          <h1 className="text-3xl font-bold text-gray-900">内容管理</h1>
          <p className="text-gray-600 mt-2">管理网站内容、文章和媒体资源</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadContents}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            刷新
          </Button>
          <Button onClick={handleCreateContent}>
            <Plus className="h-4 w-4 mr-2" />
            创建内容
          </Button>
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索标题、描述或作者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="article">文章</SelectItem>
                <SelectItem value="image">图片</SelectItem>
                <SelectItem value="video">视频</SelectItem>
                <SelectItem value="link">链接</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="published">已发布</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="archived">已归档</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 内容列表 */}
      <Card>
        <CardHeader>
          <CardTitle>内容列表</CardTitle>
          <CardDescription>
            共找到 {filteredContents.length} 个内容
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredContents.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无内容</h3>
              <p className="text-gray-600 mb-4">开始创建您的第一个内容项目</p>
              <Button onClick={handleCreateContent}>
                <Plus className="h-4 w-4 mr-2" />
                创建内容
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContents.map((content) => (
                <div key={content.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getTypeIcon(content.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg truncate">{content.title}</h3>
                          <Badge className={getStatusColor(content.status)}>
                            {getStatusText(content.status)}
                          </Badge>
                          {content.featured && (
                            <Badge variant="outline" className="text-orange-600 border-orange-200">
                              特色
                            </Badge>
                          )}
                        </div>
                        {content.description && (
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                            {content.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {content.author}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(content.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {content.views.toLocaleString()} 浏览
                          </div>
                          <div className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {content.category}
                          </div>
                        </div>
                        {content.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {content.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFeatured(content.id)}
                      >
                        {content.featured ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditContent(content)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingId(content.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个内容吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingId && handleDeleteContent(deletingId)}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 创建/编辑内容对话框 */}
      <Dialog open={showCreateDialog || !!editingContent} onOpenChange={(open) => {
        if (!open) {
          setShowCreateDialog(false);
          setEditingContent(null);
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? '编辑内容' : '创建内容'}
            </DialogTitle>
            <DialogDescription>
              {editingContent ? '修改内容信息' : '创建新的内容项目'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>标题</Label>
              <Input placeholder="输入内容标题" />
            </div>
            <div className="space-y-2">
              <Label>类型</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="选择内容类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="article">文章</SelectItem>
                  <SelectItem value="image">图片</SelectItem>
                  <SelectItem value="video">视频</SelectItem>
                  <SelectItem value="link">链接</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>描述</Label>
              <Textarea placeholder="输入内容描述" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>分类</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择分类" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>状态</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                    <SelectItem value="archived">已归档</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>标签</Label>
              <Input placeholder="输入标签，用逗号分隔" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCreateDialog(false);
              setEditingContent(null);
            }}>
              取消
            </Button>
            <Button>
              {editingContent ? '更新' : '创建'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManagement;