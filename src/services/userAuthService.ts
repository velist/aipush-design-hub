import { User, Session } from '@supabase/supabase-js'
import { supabase, type UserProfile, type FavoriteTool, type UserActivity } from '@/lib/supabase'

// 认证状态类型
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

// 用户注册数据
export interface SignUpData {
  email: string
  password: string
  fullName?: string
}

// 用户登录数据
export interface SignInData {
  email: string
  password: string
}

// 认证响应
export interface AuthResponse {
  success: boolean
  error?: string
  user?: User
}

class UserAuthService {
  // 获取当前用户
  getCurrentUser(): User | null {
    return supabase.auth.getUser().then(({ data: { user } }) => user).catch(() => null) as any;
  }

  // 获取当前会话
  getCurrentSession(): Promise<Session | null> {
    return supabase.auth.getSession().then(({ data: { session } }) => session);
  }

  // 邮箱注册
  async signUp(data: SignUpData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName || '',
          }
        }
      });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: '注册失败，请稍后重试' 
        };
      }

      return { 
        success: true, 
        user: authData.user 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '注册过程中发生错误' 
      };
    }
  }

  // 邮箱登录
  async signIn(data: SignInData): Promise<AuthResponse> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      if (!authData.user) {
        return { 
          success: false, 
          error: '登录失败，请检查邮箱和密码' 
        };
      }

      return { 
        success: true, 
        user: authData.user 
      };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '登录过程中发生错误' 
      };
    }
  }

  // 第三方登录（GitHub、Google等）
  async signInWithProvider(provider: 'github' | 'google' | 'discord'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      // OAuth登录会重定向，这里返回成功
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '第三方登录失败' 
      };
    }
  }

  // 退出登录
  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '退出登录失败' 
      };
    }
  }

  // 发送密码重置邮件
  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '发送重置邮件失败' 
      };
    }
  }

  // 更新密码
  async updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '密码更新失败' 
      };
    }
  }

  // 获取用户资料
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('获取用户资料失败:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('获取用户资料过程中发生错误:', error);
      return null;
    }
  }

  // 更新用户资料
  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '更新用户资料失败' 
      };
    }
  }

  // 获取用户收藏的工具
  async getUserFavorites(userId: string): Promise<FavoriteTool[]> {
    try {
      const { data, error } = await supabase
        .from('favorite_tools')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('获取收藏工具失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取收藏工具过程中发生错误:', error);
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
      const { error } = await supabase
        .from('favorite_tools')
        .insert({
          user_id: userId,
          tool_id: tool.toolId,
          tool_name: tool.toolName,
          tool_url: tool.toolUrl,
          tool_description: tool.toolDescription,
          tool_category: tool.toolCategory
        });

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '添加收藏失败' 
      };
    }
  }

  // 移除收藏工具
  async removeFavorite(userId: string, toolId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('favorite_tools')
        .delete()
        .eq('user_id', userId)
        .eq('tool_id', toolId);

      if (error) {
        return { 
          success: false, 
          error: this.getErrorMessage(error.message) 
        };
      }

      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.message || '移除收藏失败' 
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
      await supabase
        .from('user_activities')
        .insert({
          user_id: userId,
          activity_type: activity.type,
          tool_id: activity.toolId,
          metadata: activity.metadata
        });
    } catch (error) {
      console.error('记录用户活动失败:', error);
    }
  }

  // 获取用户活动历史
  async getUserActivities(userId: string, limit: number = 50): Promise<UserActivity[]> {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('获取用户活动失败:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('获取用户活动过程中发生错误:', error);
      return [];
    }
  }

  // 监听认证状态变化
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }

  // 错误消息本地化
  private getErrorMessage(error: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': '邮箱或密码错误',
      'Email not confirmed': '请先验证您的邮箱',
      'User already registered': '该邮箱已注册',
      'Password should be at least 6 characters': '密码至少需要6位字符',
      'Invalid email': '邮箱格式不正确',
      'Email rate limit exceeded': '发送邮件过于频繁，请稍后再试',
      'Signup is disabled': '注册功能已暂停',
      'Invalid refresh token': '会话已过期，请重新登录',
      'Network request failed': '网络连接失败，请检查网络',
    };

    return errorMap[error] || error || '操作失败，请稍后重试';
  }
}

export const userAuthService = new UserAuthService();
export type { User, Session, AuthState, SignUpData, SignInData, AuthResponse };

// 开发环境说明
export const SETUP_INSTRUCTIONS = `
🔧 Supabase 设置说明

1. 创建 Supabase 项目:
   - 访问 https://supabase.com
   - 创建新项目
   - 获取 Project URL 和 anon key

2. 配置环境变量:
   - 创建 .env.local 文件
   - 添加以下内容:
     VITE_SUPABASE_URL=your-project-url
     VITE_SUPABASE_ANON_KEY=your-anon-key

3. 创建数据库表:
   - 在 Supabase SQL 编辑器中运行 CREATE_TABLES_SQL

4. 配置认证提供商:
   - 在 Supabase Dashboard > Authentication > Providers 中
   - 启用 GitHub、Google 等 OAuth 提供商

5. 配置邮件模板:
   - 在 Authentication > Email Templates 中
   - 自定义确认邮件和密码重置邮件模板
`;

export default userAuthService;