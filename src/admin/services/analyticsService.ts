export interface AnalyticsData {
  overview: {
    totalVisits: number;
    totalUsers: number;
    activeTools: number;
    totalRevenue: number;
    visitsGrowth: number;
    usersGrowth: number;
    toolsGrowth: number;
    revenueGrowth: number;
  };
  visits: Array<{
    date: string;
    visits: number;
    users: number;
  }>;
  tools: Array<{
    name: string;
    visits: number;
    users: number;
    revenue: number;
  }>;
  categories: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  userStats: {
    newUsers: number;
    returningUsers: number;
    bounceRate: number;
    avgSessionDuration: number;
  };
  devices: Array<{
    name: string;
    value: number;
    percentage: number;
  }>;
  locations: Array<{
    country: string;
    users: number;
    percentage: number;
  }>;
  timeStats: Array<{
    hour: number;
    visits: number;
  }>;
}

export interface DateRange {
  start: Date;
  end: Date;
}

class AnalyticsService {
  private readonly STORAGE_KEY = 'aipush_analytics_data';
  private readonly API_BASE_URL = 'https://api.aipush.fun'; // 实际API地址

  // 生成模拟数据（生产环境应该从真实API获取）
  private generateMockData(days: number = 30): AnalyticsData {
    const now = new Date();
    const visits = [];
    const tools = [
      { name: 'AI新闻推送', baseVisits: 2500, baseUsers: 800, baseRevenue: 1200 },
      { name: 'ChatGPT', baseVisits: 1800, baseUsers: 1200, baseRevenue: 0 },
      { name: 'Midjourney', baseVisits: 1600, baseUsers: 600, baseRevenue: 800 },
      { name: 'GitHub Copilot', baseVisits: 1200, baseUsers: 400, baseRevenue: 600 },
      { name: 'Claude', baseVisits: 900, baseUsers: 350, baseRevenue: 400 }
    ];

    // 生成访问数据
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseVisits = 1200 + Math.random() * 800;
      const weekdayMultiplier = date.getDay() === 0 || date.getDay() === 6 ? 0.7 : 1.2;
      
      visits.push({
        date: date.toISOString().split('T')[0],
        visits: Math.round(baseVisits * weekdayMultiplier),
        users: Math.round(baseVisits * 0.6 * weekdayMultiplier)
      });
    }

    const totalVisits = visits.reduce((sum, day) => sum + day.visits, 0);
    const totalUsers = Math.round(totalVisits * 0.4); // 假设用户重复访问率

    return {
      overview: {
        totalVisits,
        totalUsers,
        activeTools: 26,
        totalRevenue: 12500,
        visitsGrowth: 12.5,
        usersGrowth: 8.3,
        toolsGrowth: 15.2,
        revenueGrowth: 23.1
      },
      visits,
      tools: tools.map(tool => ({
        ...tool,
        visits: Math.round(tool.baseVisits * (0.8 + Math.random() * 0.4)),
        users: Math.round(tool.baseUsers * (0.8 + Math.random() * 0.4)),
        revenue: Math.round(tool.baseRevenue * (0.8 + Math.random() * 0.4))
      })),
      categories: [
        { name: '对话', value: 8, percentage: 30.8 },
        { name: '绘画', value: 6, percentage: 23.1 },
        { name: '开发', value: 5, percentage: 19.2 },
        { name: '资讯', value: 4, percentage: 15.4 },
        { name: '办公', value: 3, percentage: 11.5 }
      ],
      userStats: {
        newUsers: Math.round(totalUsers * 0.3),
        returningUsers: Math.round(totalUsers * 0.7),
        bounceRate: 32.5,
        avgSessionDuration: 245 // seconds
      },
      devices: [
        { name: '桌面端', value: Math.round(totalUsers * 0.45), percentage: 45.2 },
        { name: '移动端', value: Math.round(totalUsers * 0.38), percentage: 38.1 },
        { name: '平板端', value: Math.round(totalUsers * 0.17), percentage: 16.7 }
      ],
      locations: [
        { country: '中国', users: Math.round(totalUsers * 0.42), percentage: 42.3 },
        { country: '美国', users: Math.round(totalUsers * 0.18), percentage: 18.2 },
        { country: '日本', users: Math.round(totalUsers * 0.12), percentage: 12.1 },
        { country: '德国', users: Math.round(totalUsers * 0.08), percentage: 8.4 },
        { country: '英国', users: Math.round(totalUsers * 0.06), percentage: 6.2 },
        { country: '其他', users: Math.round(totalUsers * 0.14), percentage: 12.8 }
      ],
      timeStats: Array.from({ length: 24 }, (_, hour) => {
        let multiplier = 0.3; // 基础流量
        if (hour >= 9 && hour <= 11) multiplier = 1.0; // 上午高峰
        else if (hour >= 14 && hour <= 16) multiplier = 0.9; // 下午高峰
        else if (hour >= 19 && hour <= 21) multiplier = 1.1; // 晚上高峰
        else if (hour >= 22 || hour <= 2) multiplier = 0.2; // 深夜
        
        return {
          hour,
          visits: Math.round((totalVisits / days) * multiplier * (0.8 + Math.random() * 0.4))
        };
      })
    };
  }

  async getAnalyticsData(dateRange?: DateRange): Promise<AnalyticsData> {
    try {
      // 在实际应用中，这里应该调用真实的分析API
      // const params = dateRange ? `?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}` : '';
      // const response = await fetch(`${this.API_BASE_URL}/analytics${params}`);
      // return await response.json();

      // 目前使用模拟数据
      const days = dateRange 
        ? Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      
      return this.generateMockData(days);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
      return this.generateMockData();
    }
  }

  async getRealtimeStats(): Promise<{
    currentVisitors: number;
    todayVisits: number;
    activePages: Array<{ page: string; visitors: number }>;
  }> {
    try {
      // 模拟实时数据
      return {
        currentVisitors: Math.floor(Math.random() * 200) + 50,
        todayVisits: Math.floor(Math.random() * 5000) + 2000,
        activePages: [
          { page: '/', visitors: Math.floor(Math.random() * 50) + 20 },
          { page: '/tools', visitors: Math.floor(Math.random() * 30) + 15 },
          { page: '/news', visitors: Math.floor(Math.random() * 25) + 10 },
          { page: '/about', visitors: Math.floor(Math.random() * 15) + 5 }
        ]
      };
    } catch (error) {
      console.error('Failed to fetch realtime stats:', error);
      return {
        currentVisitors: 0,
        todayVisits: 0,
        activePages: []
      };
    }
  }

  async getTopReferrers(): Promise<Array<{ source: string; visits: number; percentage: number }>> {
    try {
      const totalVisits = 10000; // 模拟总访问量
      return [
        { source: '直接访问', visits: 4200, percentage: 42.0 },
        { source: 'Google', visits: 2800, percentage: 28.0 },
        { source: '微信', visits: 1500, percentage: 15.0 },
        { source: 'GitHub', visits: 800, percentage: 8.0 },
        { source: '知乎', visits: 400, percentage: 4.0 },
        { source: '其他', visits: 300, percentage: 3.0 }
      ];
    } catch (error) {
      console.error('Failed to fetch referrers:', error);
      return [];
    }
  }

  async exportAnalyticsData(dateRange: DateRange, format: 'csv' | 'json' | 'pdf' = 'csv'): Promise<Blob> {
    try {
      const data = await this.getAnalyticsData(dateRange);
      
      if (format === 'json') {
        const jsonData = JSON.stringify(data, null, 2);
        return new Blob([jsonData], { type: 'application/json' });
      }
      
      if (format === 'csv') {
        // 生成CSV格式
        const csvRows = [
          ['日期', '访问量', '用户数'],
          ...data.visits.map(item => [item.date, item.visits.toString(), item.users.toString()])
        ];
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      }
      
      // PDF格式需要额外的PDF库支持
      throw new Error('PDF export not implemented');
    } catch (error) {
      console.error('Failed to export analytics data:', error);
      throw new Error('导出数据失败');
    }
  }

  // 工具特定的分析
  async getToolAnalytics(toolId: string, dateRange?: DateRange): Promise<{
    visits: Array<{ date: string; visits: number }>;
    userFlow: Array<{ from: string; to: string; count: number }>;
    performance: {
      loadTime: number;
      errorRate: number;
      conversionRate: number;
    };
  }> {
    try {
      // 模拟单个工具的详细分析数据
      const days = dateRange 
        ? Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      
      const visits = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - 1 - i));
        return {
          date: date.toISOString().split('T')[0],
          visits: Math.floor(Math.random() * 200) + 50
        };
      });

      return {
        visits,
        userFlow: [
          { from: '首页', to: '工具页面', count: 1200 },
          { from: '工具页面', to: '使用工具', count: 800 },
          { from: '使用工具', to: '分享', count: 150 },
          { from: '工具页面', to: '退出', count: 400 }
        ],
        performance: {
          loadTime: 1.2 + Math.random() * 0.8, // 1.2-2.0s
          errorRate: Math.random() * 2, // 0-2%
          conversionRate: 15 + Math.random() * 10 // 15-25%
        }
      };
    } catch (error) {
      console.error('Failed to fetch tool analytics:', error);
      throw new Error('获取工具分析数据失败');
    }
  }
}

export const analyticsService = new AnalyticsService();