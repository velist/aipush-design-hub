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

  // 生产环境初始数据（空数据，等待管理员添加）
  private defaultTools: Tool[] = [];

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