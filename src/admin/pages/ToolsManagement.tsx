import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AddToolDialog from '@/admin/components/AddToolDialog';
import { 
  Search, 
  Edit, 
  Trash2, 
  ExternalLink, 
  Eye,
  MoreHorizontal,
  Wrench
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// 模拟工具数据
const mockTools = [
  {
    id: 1,
    name: 'AI新闻推送',
    description: '实时AI新闻聚合，智能翻译与深度分析',
    status: '已上线',
    category: '资讯',
    users: '5K+',
    url: 'https://news.aipush.fun/',
    isExternal: false,
    createdAt: '2024-01-15',
    visits: 2341
  },
  {
    id: 2,
    name: 'AI智能对话',
    description: '基于最新大语言模型的智能对话系统',
    status: '开发中',
    category: '对话',
    users: '即将推出',
    url: '#',
    isExternal: false,
    createdAt: '2024-01-20',
    visits: 0
  },
  {
    id: 3,
    name: 'ChatGPT',
    description: 'OpenAI推出的强大对话AI',
    status: '已上线',
    category: '对话',
    users: '100M+',
    url: 'https://chat.openai.com',
    isExternal: true,
    createdAt: '2024-01-10',
    visits: 1834
  },
  {
    id: 4,
    name: 'Midjourney',
    description: '顶级AI图像生成工具',
    status: '已上线',
    category: '绘画',
    users: '15M+',
    url: 'https://midjourney.com',
    isExternal: true,
    createdAt: '2024-01-12',
    visits: 1456
  }
];

const ToolsManagement = () => {
  const [tools, setTools] = useState(mockTools);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已上线': return 'bg-green-500';
      case '开发中': return 'bg-yellow-500';
      case '规划中': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case '已上线': return 'default';
      case '开发中': return 'secondary';
      case '规划中': return 'outline';
      default: return 'outline';
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDeleteTool = (id: number) => {
    setTools(tools.filter(tool => tool.id !== id));
  };

  const handleAddTool = (newTool: any) => {
    setTools([...tools, newTool]);
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">工具管理</h1>
          <p className="text-gray-600 mt-2">管理所有 AI 工具的信息和状态</p>
        </div>
        <AddToolDialog onAddTool={handleAddTool} />
      </div>

      {/* 搜索和筛选 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索工具名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="已上线">已上线</SelectItem>
                <SelectItem value="开发中">开发中</SelectItem>
                <SelectItem value="规划中">规划中</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="分类" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部分类</SelectItem>
                <SelectItem value="对话">对话</SelectItem>
                <SelectItem value="绘画">绘画</SelectItem>
                <SelectItem value="资讯">资讯</SelectItem>
                <SelectItem value="开发">开发</SelectItem>
                <SelectItem value="办公">办公</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 统计信息 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tools.length}</div>
            <p className="text-sm text-gray-600">总工具数</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tools.filter(t => !t.isExternal).length}</div>
            <p className="text-sm text-gray-600">本站工具</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tools.filter(t => t.status === '已上线').length}</div>
            <p className="text-sm text-gray-600">已上线</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{tools.filter(t => t.status === '开发中').length}</div>
            <p className="text-sm text-gray-600">开发中</p>
          </CardContent>
        </Card>
      </div>

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
                      <h3 className="font-semibold text-lg">{tool.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`}></div>
                      <Badge variant={getStatusVariant(tool.status)}>
                        {tool.status}
                      </Badge>
                      {tool.isExternal && (
                        <Badge variant="outline" className="text-blue-600 border-blue-200">
                          外部工具
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3">{tool.description}</p>
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
                      <span>创建于 {tool.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {tool.status === '已上线' && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={tool.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteTool(tool.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ToolsManagement;