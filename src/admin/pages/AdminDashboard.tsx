import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Wrench, 
  TrendingUp, 
  Activity,
  Eye,
  MousePointer,
  Clock,
  Star
} from 'lucide-react';

const AdminDashboard = () => {
  // 生产环境初始数据（空状态）
  const stats = {
    totalTools: 0,
    myTools: 0,
    externalTools: 0,
    totalVisits: 0,
    todayVisits: 0,
    activeUsers: 0
  };

  const recentActivities = [
    { id: 1, action: '系统启动', target: '管理后台', time: '刚刚', type: 'system' }
  ];

  const topTools = [];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600 mt-2">欢迎使用 AI Push 管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总工具数</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTools}</div>
            <p className="text-xs text-muted-foreground">
              本站 {stats.myTools} 个 · 外部 {stats.externalTools} 个
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总访问量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              今日 {stats.todayVisits} 次访问
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              过去30天活跃用户
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">增长趋势</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+23%</div>
            <p className="text-xs text-muted-foreground">
              相比上月增长
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>系统最新动态和操作记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}: {activity.target}
                    </p>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {activity.time}
                    </p>
                  </div>
                  <Badge 
                    variant={activity.type === 'create' ? 'default' : activity.type === 'update' ? 'secondary' : 'outline'}
                  >
                    {activity.type === 'create' && '新增'}
                    {activity.type === 'update' && '更新'}
                    {activity.type === 'visit' && '访问'}
                    {activity.type === 'click' && '点击'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 热门工具 */}
        <Card>
          <CardHeader>
            <CardTitle>热门工具</CardTitle>
            <CardDescription>访问量最高的工具排行</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topTools.length > 0 ? (
                topTools.map((tool, index) => (
                  <div key={tool.name} className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-600 font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MousePointer className="h-3 w-3 mr-1" />
                        {tool.visits.toLocaleString()} 次访问
                      </p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {tool.trend}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Wrench className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">暂无工具数据</p>
                  <p className="text-xs">添加工具后这里会显示访问统计</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速操作</CardTitle>
          <CardDescription>常用管理功能快捷入口</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
              <Wrench className="h-6 w-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-medium">添加工具</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
              <Activity className="h-6 w-6 mx-auto mb-2 text-green-600" />
              <p className="text-sm font-medium">查看统计</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-purple-600" />
              <p className="text-sm font-medium">用户管理</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-orange-600" />
              <p className="text-sm font-medium">内容管理</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;