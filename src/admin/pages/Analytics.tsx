import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
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
  Area,
  ComposedChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  Users,
  Calendar,
  Download,
  Share2,
  Loader2,
  RefreshCw,
  DollarSign,
  Globe
} from 'lucide-react';
import { analyticsService, type AnalyticsData, type DateRange } from '@/admin/services/analyticsService';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [realtimeStats, setRealtimeStats] = useState<any>(null);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    // 设置实时数据刷新
    const interval = setInterval(loadRealtimeData, 30000); // 30秒刷新一次
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dateRange) {
      loadData();
    }
  }, [dateRange]);

  const loadData = async () => {
    try {
      setLoading(true);
      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const [analytics, realtime, referrers] = await Promise.all([
        analyticsService.getAnalyticsData({ start: startDate, end: endDate }),
        analyticsService.getRealtimeStats(),
        analyticsService.getTopReferrers()
      ]);

      setAnalyticsData(analytics);
      setRealtimeStats(realtime);
      setTopReferrers(referrers);
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载分析数据，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadRealtimeData = async () => {
    try {
      const realtime = await analyticsService.getRealtimeStats();
      setRealtimeStats(realtime);
    } catch (error) {
      console.error('Failed to load realtime data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
    toast({
      title: '刷新成功',
      description: '分析数据已更新'
    });
  };

  const handleExport = async () => {
    try {
      const days = parseInt(dateRange);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);

      const blob = await analyticsService.exportAnalyticsData({ start: startDate, end: endDate }, 'csv');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      toast({
        title: '导出成功',
        description: '分析报告已下载'
      });
    } catch (error) {
      toast({
        title: '导出失败',
        description: '导出分析报告时发生错误',
        variant: 'destructive'
      });
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatGrowth = (growth: number): string => {
    return growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="p-6">
        <div className="text-center py-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无数据</h3>
          <p className="text-gray-600">无法加载分析数据</p>
          <Button onClick={loadData} className="mt-4">
            重新加载
          </Button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: '总访问量',
      value: formatNumber(analyticsData.overview.totalVisits),
      change: formatGrowth(analyticsData.overview.visitsGrowth),
      trend: analyticsData.overview.visitsGrowth > 0 ? 'up' : 'down',
      icon: Eye,
      description: `本${dateRange}天较上期`
    },
    {
      title: '独立用户',
      value: formatNumber(analyticsData.overview.totalUsers),
      change: formatGrowth(analyticsData.overview.usersGrowth),
      trend: analyticsData.overview.usersGrowth > 0 ? 'up' : 'down',
      icon: Users,
      description: '活跃用户数'
    },
    {
      title: '活跃工具',
      value: analyticsData.overview.activeTools.toString(),
      change: formatGrowth(analyticsData.overview.toolsGrowth),
      trend: analyticsData.overview.toolsGrowth > 0 ? 'up' : 'down',
      icon: MousePointer,
      description: '在线工具数量'
    },
    {
      title: '总收入',
      value: '$' + formatNumber(analyticsData.overview.totalRevenue),
      change: formatGrowth(analyticsData.overview.revenueGrowth),
      trend: analyticsData.overview.revenueGrowth > 0 ? 'up' : 'down',
      icon: DollarSign,
      description: '累计收入'
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
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">最近7天</SelectItem>
              <SelectItem value="30">最近30天</SelectItem>
              <SelectItem value="90">最近90天</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
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

      {/* 实时数据 */}
      {realtimeStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>实时在线</CardTitle>
              <CardDescription>当前在线用户数</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{realtimeStats.currentVisitors}</div>
              <p className="text-sm text-gray-500 mt-1">活跃用户</p>
              <div className="flex items-center mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                <span className="text-xs text-gray-500">实时更新</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>今日访问</CardTitle>
              <CardDescription>今天的访问量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{realtimeStats.todayVisits.toLocaleString()}</div>
              <p className="text-sm text-gray-500 mt-1">今日访问</p>
              <Badge variant="secondary" className="mt-2">
                实时数据
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>跳出率</CardTitle>
              <CardDescription>用户跳出比例</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{analyticsData.userStats.bounceRate.toFixed(1)}%</div>
              <p className="text-sm text-gray-500 mt-1">平均跳出率</p>
              <Badge variant="outline" className="mt-2">
                <TrendingDown className="h-3 w-3 mr-1" />
                优化中
              </Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 访问趋势 */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>访问趋势</CardTitle>
            <CardDescription>最近{dateRange}天的访问量和用户数变化</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData.visits}>
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
            <CardDescription>工具访问量排行</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.tools.slice(0, 6)} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="visits" fill="#3b82f6" radius={[0, 4, 4, 0]} />
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
                    data={analyticsData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.categories.map((entry, index) => {
                      const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                      return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {analyticsData.categories.map((category, index) => {
                const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];
                return (
                  <div key={category.name} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <span className="text-sm">{category.name}</span>
                    <span className="text-sm text-gray-500">({category.percentage}%)</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户统计和设备分析 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 用户设备分析 */}
        <Card>
          <CardHeader>
            <CardTitle>访问设备</CardTitle>
            <CardDescription>不同设备的访问比例</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.devices.map((device, index) => (
                <div key={device.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {device.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 流量来源 */}
        <Card>
          <CardHeader>
            <CardTitle>流量来源</CardTitle>
            <CardDescription>访问者来源分析</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topReferrers.slice(0, 6).map((referrer, index) => (
                <div key={referrer.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Share2 className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{referrer.source}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      {referrer.visits.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-500 w-12 text-right">
                      {referrer.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 用户地域分布 */}
      <Card>
        <CardHeader>
          <CardTitle>用户地域分布</CardTitle>
          <CardDescription>不同国家/地区的用户访问情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {analyticsData.locations.map((location) => (
              <div key={location.country} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {location.users.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">{location.country}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {location.percentage.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;