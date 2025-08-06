import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Calendar,
  Download,
  Share2
} from 'lucide-react';

const Analytics = () => {
  // 模拟访问数据
  const visitData = [
    { date: '01/01', visits: 1200, users: 850 },
    { date: '01/02', visits: 1850, users: 1200 },
    { date: '01/03', visits: 2100, users: 1400 },
    { date: '01/04', visits: 1800, users: 1100 },
    { date: '01/05', visits: 2400, users: 1600 },
    { date: '01/06', visits: 2800, users: 1850 },
    { date: '01/07', visits: 3200, users: 2100 },
  ];

  // 工具点击数据
  const toolClickData = [
    { name: 'ChatGPT', clicks: 2341, percentage: 28 },
    { name: 'AI新闻推送', clicks: 1834, percentage: 22 },
    { name: 'Midjourney', clicks: 1456, percentage: 17 },
    { name: 'GitHub Copilot', clicks: 987, percentage: 12 },
    { name: 'Claude', clicks: 734, percentage: 9 },
    { name: '其他', clicks: 1000, percentage: 12 },
  ];

  // 分类统计
  const categoryData = [
    { name: '对话', value: 35, color: '#3b82f6' },
    { name: '绘画', value: 25, color: '#ef4444' },
    { name: '开发', value: 20, color: '#10b981' },
    { name: '办公', value: 12, color: '#f59e0b' },
    { name: '其他', value: 8, color: '#8b5cf6' },
  ];

  // 月度趋势数据
  const monthlyData = [
    { month: '8月', tools: 18, visits: 15400 },
    { month: '9月', tools: 21, visits: 18700 },
    { month: '10月', tools: 24, visits: 22100 },
    { month: '11月', tools: 26, visits: 28900 },
    { month: '12月', tools: 26, visits: 32400 },
  ];

  const stats = [
    {
      title: '总访问量',
      value: '32,487',
      change: '+12.3%',
      trend: 'up',
      icon: Eye,
      description: '本月较上月'
    },
    {
      title: '独立用户',
      value: '18,294',
      change: '+8.7%',
      trend: 'up',
      icon: Users,
      description: '活跃用户数'
    },
    {
      title: '工具点击',
      value: '45,672',
      change: '+15.2%',
      trend: 'up',
      icon: MousePointer,
      description: '工具链接点击'
    },
    {
      title: '平均停留',
      value: '3.2分钟',
      change: '-2.1%',
      trend: 'down',
      icon: Calendar,
      description: '页面停留时间'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">数据统计</h1>
          <p className="text-gray-600 mt-2">网站访问和使用情况分析</p>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="30">
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">最近7天</SelectItem>
              <SelectItem value="30">最近30天</SelectItem>
              <SelectItem value="90">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            导出报告
          </Button>
        </div>
      </div>

      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 访问趋势 */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>访问趋势</CardTitle>
            <CardDescription>最近7天的访问量和用户数变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitData}>
                  <defs>
                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="visits" 
                    stroke="#3b82f6" 
                    fillOpacity={1} 
                    fill="url(#colorVisits)" 
                    name="访问量"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#10b981" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    name="用户数"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 热门工具 */}
        <Card>
          <CardHeader>
            <CardTitle>热门工具</CardTitle>
            <CardDescription>工具点击量排行</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={toolClickData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={80} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* 分类分布 */}
        <Card>
          <CardHeader>
            <CardTitle>工具分类分布</CardTitle>
            <CardDescription>按分类统计工具使用情况</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categoryData.map((category) => (
                <div key={category.name} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                  <span className="text-sm text-gray-500">({category.value}%)</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 月度趋势 */}
      <Card>
        <CardHeader>
          <CardTitle>月度增长趋势</CardTitle>
          <CardDescription>工具数量和访问量的月度变化</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="tools" fill="#10b981" name="工具数量" />
                <Line yAxisId="right" type="monotone" dataKey="visits" stroke="#3b82f6" strokeWidth={3} name="访问量" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* 实时数据 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>实时在线</CardTitle>
            <CardDescription>当前在线用户数</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">127</div>
            <p className="text-sm text-gray-500 mt-1">活跃用户</p>
            <div className="flex items-center mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              <span className="text-xs text-gray-500">实时更新</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>今日新增</CardTitle>
            <CardDescription>今天的新用户</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">89</div>
            <p className="text-sm text-gray-500 mt-1">新用户</p>
            <Badge variant="secondary" className="mt-2">
              +23% vs 昨天
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>跳出率</CardTitle>
            <CardDescription>用户跳出比例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">32.4%</div>
            <p className="text-sm text-gray-500 mt-1">平均跳出率</p>
            <Badge variant="outline" className="mt-2">
              <TrendingDown className="h-3 w-3 mr-1" />
              -5.2%
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;