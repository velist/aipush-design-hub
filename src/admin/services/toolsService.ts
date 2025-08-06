export interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'development' | 'maintenance' | 'offline';
  category: string;
  users: string;
  url: string;
  isExternal: boolean;
  createdAt: string;
  updatedAt: string;
  visits: number;
  icon?: string;
  tags: string[];
  featured: boolean;
  author: string;
  version: string;
}

export interface ToolsFilter {
  status?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}

export interface ToolsStats {
  total: number;
  online: number;
  development: number;
  maintenance: number;
  offline: number;
  internal: number;
  external: number;
  totalVisits: number;
}

class ToolsService {
  private readonly STORAGE_KEY = 'aipush_tools_data';
  private readonly API_BASE_URL = 'https://api.aipush.fun'; // 实际API地址

  // 默认工具数据（生产环境应该从API获取）
  private defaultTools: Tool[] = [
    {
      id: '1',
      name: 'AI新闻推送',
      description: '实时AI新闻聚合，智能翻译与深度分析，为您提供最新的AI行业动态',
      status: 'online',
      category: '资讯',
      users: '5,240',
      url: 'https://news.aipush.fun/',
      isExternal: false,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2024-01-20T08:30:00Z',
      visits: 2341,
      icon: '📰',
      tags: ['新闻', 'AI', '实时'],
      featured: true,
      author: 'AI Push Team',
      version: '2.1.0'
    },
    {
      id: '2', 
      name: 'AI智能对话',
      description: '基于最新大语言模型的智能对话系统，支持多模态交互',
      status: 'development',
      category: '对话',
      users: '即将推出',
      url: '#',
      isExternal: false,
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2024-01-25T14:20:00Z',
      visits: 0,
      icon: '🤖',
      tags: ['对话', '大模型', '智能'],
      featured: false,
      author: 'AI Push Team',
      version: '1.0.0-beta'
    },
    {
      id: '3',
      name: 'ChatGPT',
      description: 'OpenAI推出的强大对话AI，支持自然语言处理和代码生成',
      status: 'online',
      category: '对话',
      users: '100M+',
      url: 'https://chat.openai.com',
      isExternal: true,
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-30T10:15:00Z',
      visits: 1834,
      icon: '💬',
      tags: ['对话', 'OpenAI', 'GPT'],
      featured: true,
      author: 'OpenAI',
      version: '4.0'
    },
    {
      id: '4',
      name: 'Midjourney',
      description: '顶级AI图像生成工具，创造令人惊叹的艺术作品',
      status: 'online',
      category: '绘画',
      users: '15M+',
      url: 'https://midjourney.com',
      isExternal: true,
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-28T16:45:00Z',
      visits: 1456,
      icon: '🎨',
      tags: ['图像生成', 'AI艺术', '创意'],
      featured: true,
      author: 'Midjourney, Inc.',
      version: '6.0'
    },
    {
      id: '5',
      name: 'GitHub Copilot',
      description: 'AI驱动的代码自动完成工具，提高开发效率',
      status: 'online',
      category: '开发',
      users: '1M+',
      url: 'https://github.com/features/copilot',
      isExternal: true,
      createdAt: '2024-01-08T00:00:00Z',
      updatedAt: '2024-01-29T12:00:00Z',
      visits: 987,
      icon: '⚡',
      tags: ['编程', '代码', 'GitHub'],
      featured: false,
      author: 'GitHub',
      version: '2.0'
    }
  ];

  constructor() {
    // 初始化本地数据
    this.initializeData();
  }

  private initializeData(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultTools));
    }
  }

  async getAllTools(): Promise<Tool[]> {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch(`${this.API_BASE_URL}/tools`);
      // return await response.json();

      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.defaultTools;
    } catch (error) {
      console.error('Failed to fetch tools:', error);
      return this.defaultTools;
    }
  }

  async getToolById(id: string): Promise<Tool | null> {
    const tools = await this.getAllTools();
    return tools.find(tool => tool.id === id) || null;
  }

  async getFilteredTools(filter: ToolsFilter): Promise<Tool[]> {
    const tools = await this.getAllTools();
    
    return tools.filter(tool => {
      // 状态筛选
      if (filter.status && filter.status !== 'all' && tool.status !== filter.status) {
        return false;
      }
      
      // 分类筛选
      if (filter.category && filter.category !== 'all' && tool.category !== filter.category) {
        return false;
      }
      
      // 精选筛选
      if (filter.featured !== undefined && tool.featured !== filter.featured) {
        return false;
      }
      
      // 搜索筛选
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        return tool.name.toLowerCase().includes(searchLower) ||
               tool.description.toLowerCase().includes(searchLower) ||
               tool.tags.some(tag => tag.toLowerCase().includes(searchLower));
      }
      
      return true;
    });
  }

  async createTool(tool: Omit<Tool, 'id' | 'createdAt' | 'updatedAt' | 'visits'>): Promise<Tool> {
    try {
      const newTool: Tool = {
        ...tool,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visits: 0
      };

      // 在实际应用中，这里应该调用API
      // const response = await fetch(`${this.API_BASE_URL}/tools`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newTool)
      // });
      // return await response.json();

      const tools = await this.getAllTools();
      const updatedTools = [...tools, newTool];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTools));
      
      return newTool;
    } catch (error) {
      console.error('Failed to create tool:', error);
      throw new Error('创建工具失败');
    }
  }

  async updateTool(id: string, updates: Partial<Tool>): Promise<Tool> {
    try {
      const tools = await this.getAllTools();
      const toolIndex = tools.findIndex(tool => tool.id === id);
      
      if (toolIndex === -1) {
        throw new Error('工具不存在');
      }

      const updatedTool: Tool = {
        ...tools[toolIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // 在实际应用中，这里应该调用API
      tools[toolIndex] = updatedTool;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tools));
      
      return updatedTool;
    } catch (error) {
      console.error('Failed to update tool:', error);
      throw new Error('更新工具失败');
    }
  }

  async deleteTool(id: string): Promise<void> {
    try {
      // 在实际应用中，这里应该调用API
      // await fetch(`${this.API_BASE_URL}/tools/${id}`, {
      //   method: 'DELETE'
      // });

      const tools = await this.getAllTools();
      const filteredTools = tools.filter(tool => tool.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredTools));
    } catch (error) {
      console.error('Failed to delete tool:', error);
      throw new Error('删除工具失败');
    }
  }

  async getToolsStats(): Promise<ToolsStats> {
    const tools = await this.getAllTools();
    
    return {
      total: tools.length,
      online: tools.filter(t => t.status === 'online').length,
      development: tools.filter(t => t.status === 'development').length,
      maintenance: tools.filter(t => t.status === 'maintenance').length,
      offline: tools.filter(t => t.status === 'offline').length,
      internal: tools.filter(t => !t.isExternal).length,
      external: tools.filter(t => t.isExternal).length,
      totalVisits: tools.reduce((sum, tool) => sum + tool.visits, 0)
    };
  }

  async incrementVisits(id: string): Promise<void> {
    try {
      const tool = await this.getToolById(id);
      if (tool) {
        await this.updateTool(id, { visits: tool.visits + 1 });
      }
    } catch (error) {
      console.error('Failed to increment visits:', error);
    }
  }

  async toggleFeatured(id: string): Promise<Tool> {
    const tool = await this.getToolById(id);
    if (!tool) {
      throw new Error('工具不存在');
    }
    
    return await this.updateTool(id, { featured: !tool.featured });
  }

  async bulkUpdateStatus(ids: string[], status: Tool['status']): Promise<void> {
    const promises = ids.map(id => this.updateTool(id, { status }));
    await Promise.all(promises);
  }
}

export const toolsService = new ToolsService();