import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import AddToolDialog from '@/admin/components/AddToolDialog';
import EditToolDialog from '@/admin/components/EditToolDialog';
import { toolsService, type Tool, type ToolsFilter, type ToolsStats } from '@/admin/services/toolsService';
import { authService } from '@/admin/services/authService';
import { 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye,
  MoreHorizontal,
  Wrench,
  Star,
  Loader2,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const ToolsManagement = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [stats, setStats] = useState<ToolsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editingTool, setEditingTool] = useState<Tool | null>(null);
  const [deletingToolId, setDeletingToolId] = useState<string | null>(null);
  const { toast } = useToast();

  const canEdit = authService.hasPermission('tools:write');
  const canDelete = authService.hasPermission('tools:delete') || authService.hasPermission('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [toolsData, statsData] = await Promise.all([
        toolsService.getAllTools(),
        toolsService.getToolsStats()
      ]);
      setTools(toolsData);
      setStats(statsData);
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载工具数据，请稍后重试',
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
      description: '工具数据已更新'
    });
  };

  const getStatusColor = (status: Tool['status']) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'development': return 'bg-yellow-500';
      case 'maintenance': return 'bg-orange-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: Tool['status']): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'online': return 'default';
      case 'development': return 'secondary';
      case 'maintenance': return 'outline';
      case 'offline': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: Tool['status']) => {
    switch (status) {
      case 'online': return '已上线';
      case 'development': return '开发中';
      case 'maintenance': return '维护中';
      case 'offline': return '已下线';
      default: return '未知';
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteTool = async (id: string) => {
    try {
      await toolsService.deleteTool(id);
      setTools(tools.filter(tool => tool.id !== id));
      setDeletingToolId(null);
      toast({
        title: '删除成功',
        description: '工具已成功删除'
      });
      // 重新加载统计数据
      const newStats = await toolsService.getToolsStats();
      setStats(newStats);
    } catch (error) {
      toast({
        title: '删除失败',
        description: '删除工具时发生错误，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const handleAddTool = async (newToolData: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'visits'>) => {
    try {
      const newTool = await toolsService.createTool(newToolData);
      setTools([newTool, ...tools]);
      toast({
        title: '添加成功',
        description: '新工具已成功添加'
      });
      // 重新加载统计数据
      const newStats = await toolsService.getToolsStats();
      setStats(newStats);
    } catch (error) {
      toast({
        title: '添加失败',
        description: '添加工具时发生错误，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const handleUpdateTool = async (id: string, updates: Partial<Tool>) => {
    try {
      const updatedTool = await toolsService.updateTool(id, updates);
      setTools(tools.map(tool => tool.id === id ? updatedTool : tool));
      setEditingTool(null);
      toast({
        title: '更新成功',
        description: '工具信息已更新'
      });
      // 重新加载统计数据
      const newStats = await toolsService.getToolsStats();
      setStats(newStats);
    } catch (error) {
      toast({
        title: '更新失败',
        description: '更新工具时发生错误，请稍后重试',
        variant: 'destructive'
      });
    }
  };

  const handleToggleFeatured = async (tool: Tool) => {
    try {
      const updatedTool = await toolsService.toggleFeatured(tool.id);
      setTools(tools.map(t => t.id === tool.id ? updatedTool : t));
      toast({
        title: updatedTool.featured ? '已设为精选' : '已取消精选',
        description: `工具 "${tool.name}" 的精选状态已更新`
      });
    } catch (error) {
      toast({
        title: '操作失败',
        description: '更新精选状态时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleVisitTool = async (tool: Tool) => {
    await toolsService.incrementVisits(tool.id);
    setTools(tools.map(t => t.id === tool.id ? { ...t, visits: t.visits + 1 } : t));
    window.open(tool.url, '_blank');
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
          <h1 className="text-3xl font-bold text-gray-900">工具管理</h1>
          <p className="text-gray-600 mt-2">管理所有 AI 工具的信息和状态</p>
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
          {canEdit && <AddToolDialog onAddTool={handleAddTool} />}
        </div>
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索工具名称、描述或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="状态筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="online">已上线</SelectItem>
                <SelectItem value="development">开发中</SelectItem>
                <SelectItem value="maintenance">维护中</SelectItem>
                <SelectItem value="offline">已下线</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="分类筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="对话">对话</SelectItem>
                <SelectItem value="绘画">绘画</SelectItem>
                <SelectItem value="资讯">资讯</SelectItem>
                <SelectItem value="开发">开发</SelectItem>
                <SelectItem value="办公">办公</SelectItem>
                <SelectItem value="娱乐">娱乐</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-sm text-gray-600">总工具数</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.online}</div>
              <p className="text-sm text-gray-600">已上线</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.internal}</div>
              <p className="text-sm text-gray-600">内部工具</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats.totalVisits.toLocaleString()}</div>
              <p className="text-sm text-gray-600">总访问量</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 工具列表 */}
      <Card>
        <CardHeader>
          <CardTitle>工具列表</CardTitle>
          <CardDescription>
            共找到 {filteredTools.length} 个工具
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTools.map((tool) => (
              <div key={tool.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg flex items-center">
                        {tool.icon && <span className="mr-2">{tool.icon}</span>}
                        {tool.name}
                      </h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`}></div>
                      <Badge variant={getStatusVariant(tool.status)}>
                        {getStatusLabel(tool.status)}
                      </Badge>
                      {tool.isExternal && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          外部工具
                        </Badge>
                      )}
                      {tool.featured && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          精选
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{tool.description}</p>
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      {tool.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Wrench className="h-4 w-4 mr-1" />
                        {tool.category}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {tool.visits.toLocaleString()} 次访问
                      </span>
                      <span>{tool.users} 用户</span>
                      <span>v{tool.version}</span>
                      <span>创建于 {new Date(tool.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {tool.status === 'online' && tool.url !== '#' && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleVisitTool(tool)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <>
                            <DropdownMenuItem onClick={() => setEditingTool(tool)}>
                              <Edit className="h-4 w-4 mr-2" />
                              编辑
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleFeatured(tool)}>
                              <Star className="h-4 w-4 mr-2" />
                              {tool.featured ? '取消精选' : '设为精选'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                          </>
                        )}
                        {canDelete && (
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setDeletingToolId(tool.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-8">
              <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">没有找到工具</h3>
              <p className="text-gray-600">尝试调整搜索条件或添加新工具</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 编辑工具对话框 */}
      {editingTool && (
        <EditToolDialog
          tool={editingTool}
          open={!!editingTool}
          onClose={() => setEditingTool(null)}
          onUpdate={handleUpdateTool}
        />
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={!!deletingToolId} onOpenChange={() => setDeletingToolId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这个工具吗？此操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingToolId && handleDeleteTool(deletingToolId)}
              className="bg-red-600 hover:bg-red-700"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ToolsManagement;