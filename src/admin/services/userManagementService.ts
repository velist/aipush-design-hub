export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
  avatar?: string;
  fullName?: string;
  department?: string;
  phone?: string;
}

export interface UserFilters {
  role?: string;
  status?: 'active' | 'inactive';
  department?: string;
  search?: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  admins: number;
  editors: number;
  viewers: number;
  recentLogins: number;
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  role: AdminUser['role'];
  fullName?: string;
  department?: string;
  phone?: string;
}

class UserManagementService {
  private readonly STORAGE_KEY = 'aipush_admin_users';
  private readonly API_BASE_URL = 'https://api.aipush.fun';

  // 生产环境初始用户（仅保留系统管理员）
  private defaultUsers: AdminUser[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@aipush.fun',
      role: 'admin',
      permissions: ['all'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fullName: '系统管理员',
      department: '技术部',
      avatar: '👨‍💼'
    }
  ];

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultUsers));
    }
  }

  async getAllUsers(): Promise<AdminUser[]> {
    try {
      // 在实际应用中，这里应该调用API
      // const response = await fetch(`${this.API_BASE_URL}/admin/users`);
      // return await response.json();

      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : this.defaultUsers;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      return this.defaultUsers;
    }
  }

  async getUserById(id: string): Promise<AdminUser | null> {
    const users = await this.getAllUsers();
    return users.find(user => user.id === id) || null;
  }

  async getFilteredUsers(filters: UserFilters): Promise<AdminUser[]> {
    const users = await this.getAllUsers();
    
    return users.filter(user => {
      // 角色筛选
      if (filters.role && filters.role !== 'all' && user.role !== filters.role) {
        return false;
      }
      
      // 状态筛选
      if (filters.status === 'active' && !user.isActive) {
        return false;
      }
      if (filters.status === 'inactive' && user.isActive) {
        return false;
      }
      
      // 部门筛选
      if (filters.department && filters.department !== 'all' && user.department !== filters.department) {
        return false;
      }
      
      // 搜索筛选
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return user.username.toLowerCase().includes(searchLower) ||
               user.email.toLowerCase().includes(searchLower) ||
               user.fullName?.toLowerCase().includes(searchLower);
      }
      
      return true;
    });
  }

  async createUser(userData: CreateUserData): Promise<AdminUser> {
    try {
      const users = await this.getAllUsers();
      
      // 检查用户名和邮箱是否已存在
      const existingUser = users.find(user => 
        user.username === userData.username || user.email === userData.email
      );
      
      if (existingUser) {
        throw new Error('用户名或邮箱已存在');
      }

      const newUser: AdminUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        role: userData.role,
        permissions: this.getRolePermissions(userData.role),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        fullName: userData.fullName,
        department: userData.department,
        phone: userData.phone
      };

      // 在实际应用中，这里应该调用API
      const updatedUsers = [...users, newUser];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedUsers));
      
      return newUser;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  async updateUser(id: string, updates: Partial<AdminUser>): Promise<AdminUser> {
    try {
      const users = await this.getAllUsers();
      const userIndex = users.findIndex(user => user.id === id);
      
      if (userIndex === -1) {
        throw new Error('用户不存在');
      }

      // 如果更新角色，同时更新权限
      if (updates.role) {
        updates.permissions = this.getRolePermissions(updates.role);
      }

      const updatedUser: AdminUser = {
        ...users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users));
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('更新用户失败');
    }
  }

  async deleteUser(id: string): Promise<void> {
    try {
      const users = await this.getAllUsers();
      const user = users.find(u => u.id === id);
      
      if (!user) {
        throw new Error('用户不存在');
      }

      // 防止删除最后一个管理员
      const admins = users.filter(u => u.role === 'admin' && u.isActive);
      if (user.role === 'admin' && admins.length <= 1) {
        throw new Error('不能删除最后一个活跃的管理员');
      }

      const filteredUsers = users.filter(user => user.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredUsers));
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw error;
    }
  }

  async toggleUserStatus(id: string): Promise<AdminUser> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 防止禁用最后一个管理员
    if (user.role === 'admin' && user.isActive) {
      const users = await this.getAllUsers();
      const activeAdmins = users.filter(u => u.role === 'admin' && u.isActive);
      if (activeAdmins.length <= 1) {
        throw new Error('不能禁用最后一个活跃的管理员');
      }
    }
    
    return await this.updateUser(id, { isActive: !user.isActive });
  }

  async getUserStats(): Promise<UserStats> {
    const users = await this.getAllUsers();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      inactive: users.filter(u => !u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      editors: users.filter(u => u.role === 'editor').length,
      viewers: users.filter(u => u.role === 'viewer').length,
      recentLogins: users.filter(u => 
        u.lastLogin && new Date(u.lastLogin) > sevenDaysAgo
      ).length
    };
  }

  async resetPassword(id: string, newPassword: string): Promise<void> {
    try {
      // 在实际应用中，这里应该调用API来重置密码
      // await fetch(`${this.API_BASE_URL}/admin/users/${id}/reset-password`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ password: newPassword })
      // });

      // 模拟操作
      await this.updateUser(id, { updatedAt: new Date().toISOString() });
    } catch (error) {
      console.error('Failed to reset password:', error);
      throw new Error('重置密码失败');
    }
  }

  async bulkUpdateUsers(ids: string[], updates: Partial<AdminUser>): Promise<void> {
    const promises = ids.map(id => this.updateUser(id, updates));
    await Promise.all(promises);
  }

  private getRolePermissions(role: AdminUser['role']): string[] {
    switch (role) {
      case 'admin':
        return ['all'];
      case 'editor':
        return ['tools:read', 'tools:write', 'analytics:read', 'content:write', 'content:read'];
      case 'viewer':
        return ['tools:read', 'analytics:read', 'content:read'];
      default:
        return [];
    }
  }

  // 获取所有部门列表
  async getDepartments(): Promise<string[]> {
    const users = await this.getAllUsers();
    const departments = new Set(users.map(u => u.department).filter(Boolean) as string[]);
    return Array.from(departments).sort();
  }

  // 获取用户登录历史（生产环境空实现）
  async getUserLoginHistory(id: string): Promise<Array<{
    timestamp: string;
    ip: string;
    userAgent: string;
    success: boolean;
  }>> {
    // 生产环境初始为空，等待实际实现
    return [];
  }
}

export const userManagementService = new UserManagementService();