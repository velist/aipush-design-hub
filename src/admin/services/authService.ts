import CryptoJS from 'crypto-js';

interface LoginCredentials {
  username: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  permissions: string[];
  lastLogin?: Date;
  isActive: boolean;
}

interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

class AuthService {
  private readonly STORAGE_KEY = 'aipush_admin_auth';
  private readonly SECRET_KEY = 'aipush_admin_secret_2024';
  private readonly TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24小时

  // 默认管理员账户（生产环境应该从数据库获取）
  private readonly defaultUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      email: 'admin@aipush.fun',
      role: 'admin',
      permissions: ['all'],
      isActive: true,
    },
    {
      id: '2', 
      username: 'editor',
      email: 'editor@aipush.fun',
      role: 'editor',
      permissions: ['tools:read', 'tools:write', 'analytics:read'],
      isActive: true,
    }
  ];

  // 密码哈希（生产环境应该使用更强的哈希算法）
  private readonly passwordHashes: Record<string, string> = {
    'admin': this.hashPassword('AiPush@2024!'),
    'editor': this.hashPassword('Editor@2024!')
  };

  private hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.SECRET_KEY).toString();
  }

  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      username: user.username,
      role: user.role,
      timestamp: Date.now(),
    };
    
    return CryptoJS.AES.encrypt(JSON.stringify(payload), this.SECRET_KEY).toString();
  }

  private verifyToken(token: string): { valid: boolean; user?: User; expired?: boolean } {
    try {
      const decrypted = CryptoJS.AES.decrypt(token, this.SECRET_KEY).toString(CryptoJS.enc.Utf8);
      const payload = JSON.parse(decrypted);
      
      // 检查token是否过期
      if (Date.now() - payload.timestamp > this.TOKEN_EXPIRY) {
        return { valid: false, expired: true };
      }

      // 查找用户
      const user = this.defaultUsers.find(u => u.id === payload.userId);
      if (!user || !user.isActive) {
        return { valid: false };
      }

      return { valid: true, user };
    } catch (error) {
      return { valid: false };
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { username, password } = credentials;
      
      // 查找用户
      const user = this.defaultUsers.find(u => u.username === username);
      if (!user || !user.isActive) {
        return { success: false, error: '用户名或密码错误' };
      }

      // 验证密码
      const hashedPassword = this.hashPassword(password);
      if (this.passwordHashes[username] !== hashedPassword) {
        return { success: false, error: '用户名或密码错误' };
      }

      // 生成token
      const token = this.generateToken(user);
      
      // 更新最后登录时间
      user.lastLogin = new Date();

      // 保存认证信息到localStorage
      const authData = {
        token,
        user: {
          ...user,
          lastLogin: user.lastLogin.toISOString()
        },
        timestamp: Date.now()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));

      return { success: true, user, token };
    } catch (error) {
      return { success: false, error: '登录过程中发生错误' };
    }
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  getCurrentUser(): User | null {
    try {
      const authData = localStorage.getItem(this.STORAGE_KEY);
      if (!authData) return null;

      const { token } = JSON.parse(authData);
      const verification = this.verifyToken(token);
      
      if (!verification.valid) {
        // token无效或过期，清除存储的数据
        this.logout();
        return null;
      }

      return verification.user || null;
    } catch (error) {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // 管理员拥有所有权限
    if (user.role === 'admin' || user.permissions.includes('all')) {
      return true;
    }

    return user.permissions.includes(permission);
  }

  // 刷新token（延长过期时间）
  refreshToken(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;

    const newToken = this.generateToken(user);
    const authData = {
      token: newToken,
      user,
      timestamp: Date.now()
    };
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(authData));
    return true;
  }

  // 修改密码
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    // 验证当前密码
    const currentHash = this.hashPassword(currentPassword);
    if (this.passwordHashes[user.username] !== currentHash) {
      return { success: false, error: '当前密码错误' };
    }

    // 在实际应用中，这里应该调用API更新数据库
    // 这里只是演示，实际不会更新密码哈希
    return { success: true };
  }
}

export const authService = new AuthService();
export type { User, AuthResponse, LoginCredentials };