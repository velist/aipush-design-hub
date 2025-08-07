import PocketBase from 'pocketbase';

// PocketBase 配置
const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'https://api.aipush.fun';

// 用户数据接口
export interface PBUser {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  subscription_type: 'free' | 'premium' | 'enterprise';
  subscription_expires?: string;
  credits: number;
  referral_code?: string;
  created: string;
  updated: string;
  verified: boolean;
}

export interface UserProfile extends PBUser {}

export interface FavoriteTool {
  id: string;
  user: string;
  tool_id: string;
  tool_name: string;
  tool_url: string;
  tool_description?: string;
  tool_category?: string;
  created: string;
}

export interface UserActivity {
  id: string;
  user: string;
  activity_type: 'visit' | 'favorite' | 'unfavorite' | 'search';
  tool_id?: string;
  metadata?: Record<string, any>;
  created: string;
}

export interface ActivationCode {
  id: string;
  code: string;
  type: 'premium_month' | 'premium_year' | 'credits';
  value: number;
  used: boolean;
  used_by?: string;
  used_at?: string;
  expires_at?: string;
  created: string;
}

// 认证响应类型
export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: PBUser;
}

class PocketBaseAuthService {
  private pb: PocketBase;

  constructor() {
    this.pb = new PocketBase(PB_URL);
    
    // 设置自动刷新token
    this.pb.autoCancellation(false);
    
    // 恢复认证状态
    this.pb.authStore.loadFromCookie(document.cookie);
  }

  // 获取PocketBase实例（用于其他服务）
  getPB(): PocketBase {
    return this.pb;
  }

  // 获取当前用户
  getCurrentUser(): PBUser | null {
    return this.pb.authStore.model as PBUser;
  }

  // 检查是否已登录
  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  // 邮箱注册
  async signUp(data: {
    email: string;
    password: string;
    fullName?: string;
    username?: string;
  }): Promise<AuthResponse> {
    try {
      const userData = {
        email: data.email,
        password: data.password,
        passwordConfirm: data.password,
        username: data.username || data.email.split('@')[0],
        subscription_type: 'free' as const,
        credits: 10, // 新用户赠送10积分
      };

      const user = await this.pb.collection('users').create(userData);
      
      // 发送验证邮件
      await this.pb.collection('users').requestVerification(data.email);

      return { success: true, user: user as PBUser };
    } catch (error: any) {
      console.error('注册失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 邮箱登录
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(email, password);
      
      return {
        success: true,
        user: authData.record as PBUser
      };
    } catch (error: any) {
      console.error('登录失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // OAuth登录（GitHub、Google等）
  async signInWithProvider(provider: 'github' | 'google' | 'discord'): Promise<AuthResponse> {
    try {
      const authData = await this.pb.collection('users').authWithOAuth2({
        provider: provider,
        createData: {
          subscription_type: 'free',
          credits: 10
        }
      });

      return {
        success: true,
        user: authData.record as PBUser
      };
    } catch (error: any) {
      console.error('OAuth登录失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 退出登录
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      this.pb.authStore.clear();
      return { success: true };
    } catch (error: any) {
      console.error('退出登录失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 重置密码
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.pb.collection('users').requestPasswordReset(email);
      return { success: true };
    } catch (error: any) {
      console.error('重置密码失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 更新密码
  async updatePassword(oldPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.pb.collection('users').update(this.getCurrentUser()?.id!, {
        oldPassword,
        password: newPassword,
        passwordConfirm: newPassword
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('更新密码失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 更新用户资料
  async updateUserProfile(userId: string, updates: Partial<PBUser>): Promise<{ success: boolean; error?: string }> {
    try {
      await this.pb.collection('users').update(userId, updates);
      return { success: true };
    } catch (error: any) {
      console.error('更新用户资料失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 获取用户收藏的工具
  async getUserFavorites(userId: string): Promise<FavoriteTool[]> {
    try {
      const records = await this.pb.collection('favorites').getFullList({
        filter: `user = "${userId}"`,
        sort: '-created'
      });
      
      return records as FavoriteTool[];
    } catch (error) {
      console.error('获取收藏失败:', error);
      return [];
    }
  }

  // 添加收藏工具
  async addFavorite(userId: string, tool: {
    toolId: string;
    toolName: string;
    toolUrl: string;
    toolDescription?: string;
    toolCategory?: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      await this.pb.collection('favorites').create({
        user: userId,
        tool_id: tool.toolId,
        tool_name: tool.toolName,
        tool_url: tool.toolUrl,
        tool_description: tool.toolDescription,
        tool_category: tool.toolCategory
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('添加收藏失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 移除收藏工具
  async removeFavorite(userId: string, toolId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const records = await this.pb.collection('favorites').getFullList({
        filter: `user = "${userId}" && tool_id = "${toolId}"`
      });
      
      if (records.length > 0) {
        await this.pb.collection('favorites').delete(records[0].id);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('移除收藏失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 记录用户活动
  async recordActivity(userId: string, activity: {
    type: 'visit' | 'favorite' | 'unfavorite' | 'search';
    toolId?: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await this.pb.collection('user_activities').create({
        user: userId,
        activity_type: activity.type,
        tool_id: activity.toolId,
        metadata: activity.metadata
      });
    } catch (error) {
      console.error('记录活动失败:', error);
    }
  }

  // 获取用户活动历史
  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const records = await this.pb.collection('user_activities').getList(1, limit, {
        filter: `user = "${userId}"`,
        sort: '-created'
      });
      
      return records.items as UserActivity[];
    } catch (error) {
      console.error('获取活动记录失败:', error);
      return [];
    }
  }

  // 兑换激活码
  async redeemActivationCode(code: string, userId: string): Promise<{ success: boolean; error?: string; data?: any }> {
    try {
      // 查找激活码
      const codeRecord = await this.pb.collection('activation_codes').getFirstListItem(
        `code = "${code}" && used = false && (expires_at = "" || expires_at > @now)`
      );

      if (!codeRecord) {
        return { success: false, error: '激活码无效或已过期' };
      }

      // 获取当前用户信息
      const user = await this.pb.collection('users').getOne(userId);
      let updateData: any = {};

      // 根据激活码类型更新用户
      switch (codeRecord.type) {
        case 'premium_month':
          const currentExpires = user.subscription_expires ? new Date(user.subscription_expires) : new Date();
          const newExpires = new Date(Math.max(currentExpires.getTime(), Date.now()));
          newExpires.setMonth(newExpires.getMonth() + codeRecord.value);
          
          updateData = {
            subscription_type: 'premium',
            subscription_expires: newExpires.toISOString()
          };
          break;
          
        case 'premium_year':
          const currentExpiresYear = user.subscription_expires ? new Date(user.subscription_expires) : new Date();
          const newExpiresYear = new Date(Math.max(currentExpiresYear.getTime(), Date.now()));
          newExpiresYear.setFullYear(newExpiresYear.getFullYear() + codeRecord.value);
          
          updateData = {
            subscription_type: 'premium',
            subscription_expires: newExpiresYear.toISOString()
          };
          break;
          
        case 'credits':
          updateData = {
            credits: (user.credits || 0) + codeRecord.value
          };
          break;
      }

      // 更新用户信息
      await this.pb.collection('users').update(userId, updateData);

      // 标记激活码为已使用
      await this.pb.collection('activation_codes').update(codeRecord.id, {
        used: true,
        used_by: userId,
        used_at: new Date().toISOString()
      });

      return { success: true, data: updateData };
    } catch (error: any) {
      console.error('兑换激活码失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 检查用户权限（付费功能）
  async checkUserPermission(userId: string, feature: 'premium_tools' | 'api_access' | 'advanced_features'): Promise<{
    hasPermission: boolean;
    reason?: string;
    subscription?: any;
  }> {
    try {
      const user = await this.pb.collection('users').getOne(userId);
      const now = new Date();

      // 检查订阅状态
      if (user.subscription_type === 'premium' || user.subscription_type === 'enterprise') {
        const expiresAt = user.subscription_expires ? new Date(user.subscription_expires) : null;
        
        if (!expiresAt || expiresAt > now) {
          return { 
            hasPermission: true,
            subscription: {
              type: user.subscription_type,
              expires: user.subscription_expires
            }
          };
        }
      }

      // 检查积分
      if (feature === 'api_access' && user.credits > 0) {
        return { 
          hasPermission: true,
          subscription: {
            type: 'credits',
            credits: user.credits
          }
        };
      }

      return { 
        hasPermission: false, 
        reason: 'subscription_required',
        subscription: {
          type: user.subscription_type,
          expires: user.subscription_expires,
          credits: user.credits
        }
      };
    } catch (error) {
      console.error('检查权限失败:', error);
      return { hasPermission: false, reason: 'error' };
    }
  }

  // 消耗用户积分
  async consumeCredits(userId: string, amount: number): Promise<{ success: boolean; remaining?: number; error?: string }> {
    try {
      const user = await this.pb.collection('users').getOne(userId);
      
      if ((user.credits || 0) < amount) {
        return { success: false, error: '积分不足' };
      }

      const newCredits = (user.credits || 0) - amount;
      await this.pb.collection('users').update(userId, {
        credits: newCredits
      });

      return { success: true, remaining: newCredits };
    } catch (error: any) {
      console.error('消耗积分失败:', error);
      return {
        success: false,
        error: this.getErrorMessage(error)
      };
    }
  }

  // 监听认证状态变化
  onAuthStateChange(callback: (isValid: boolean, user: PBUser | null) => void) {
    this.pb.authStore.onChange((token, model) => {
      callback(this.pb.authStore.isValid, model as PBUser);
    });

    // 返回取消监听的函数
    return () => {
      // PocketBase 没有直接的取消监听方法
      // 这里返回一个空函数，实际取消在组件卸载时处理
    };
  }

  // 错误消息本地化
  private getErrorMessage(error: any): string {
    const message = error?.message || error?.data?.message || '操作失败';
    
    const errorMap: Record<string, string> = {
      'Failed to authenticate.': '邮箱或密码错误',
      'User not found.': '用户不存在',
      'The email is invalid or already in use.': '邮箱格式错误或已被使用',
      'The username is invalid or already in use.': '用户名格式错误或已被使用',
      'Body params validation failed.': '输入信息格式错误',
      'You are not allowed to perform this request.': '权限不足',
      'Something went wrong while processing your request.': '服务器错误，请稍后重试',
      'Failed to send email.': '发送邮件失败',
      'The record does not exist.': '记录不存在',
    };

    // 尝试匹配已知错误
    for (const [key, value] of Object.entries(errorMap)) {
      if (message.includes(key)) {
        return value;
      }
    }

    // 处理验证错误
    if (error?.data?.data) {
      const firstError = Object.values(error.data.data)[0] as any;
      if (firstError?.message) {
        return firstError.message;
      }
    }

    return message || '操作失败，请稍后重试';
  }
}

export const pbAuthService = new PocketBaseAuthService();
export default pbAuthService;