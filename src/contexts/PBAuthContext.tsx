import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { pbAuthService, type PBUser, type AuthResponse } from '@/services/pocketbaseAuthService';

interface PBAuthContextValue {
  // 认证状态
  user: PBUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  // 认证方法
  signUp: (email: string, password: string, fullName?: string, username?: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signInWithProvider: (provider: 'github' | 'google' | 'discord') => Promise<AuthResponse>;
  signOut: () => Promise<{ success: boolean; error?: string }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  
  // 用户资料
  updateProfile: (updates: Partial<PBUser>) => Promise<{ success: boolean; error?: string }>;
  
  // 收藏功能
  getFavorites: () => Promise<any[]>;
  addFavorite: (tool: any) => Promise<{ success: boolean; error?: string }>;
  removeFavorite: (toolId: string) => Promise<{ success: boolean; error?: string }>;
  
  // 活动记录
  recordActivity: (activity: { type: string; toolId?: string; metadata?: any }) => Promise<void>;
  getActivities: (limit?: number) => Promise<any[]>;
  
  // 付费功能
  redeemCode: (code: string) => Promise<{ success: boolean; error?: string; data?: any }>;
  checkPermission: (feature: string) => Promise<{ hasPermission: boolean; reason?: string; subscription?: any }>;
  consumeCredits: (amount: number) => Promise<{ success: boolean; remaining?: number; error?: string }>;
  
  // 刷新用户数据
  refreshUser: () => Promise<void>;
}

const PBAuthContext = createContext<PBAuthContextValue | undefined>(undefined);

export function usePBAuth() {
  const context = useContext(PBAuthContext);
  if (context === undefined) {
    throw new Error('usePBAuth must be used within a PBAuthProvider');
  }
  return context;
}

interface PBAuthProviderProps {
  children: React.ReactNode;
}

export function PBAuthProvider({ children }: PBAuthProviderProps) {
  const [user, setUser] = useState<PBUser | null>(null);
  const [loading, setLoading] = useState(true);

  // 初始化认证状态
  useEffect(() => {
    const initAuth = () => {
      try {
        const currentUser = pbAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // 监听认证状态变化
    const unsubscribe = pbAuthService.onAuthStateChange((isValid, userData) => {
      console.log('认证状态变化:', isValid, userData?.email);
      setUser(isValid ? userData : null);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // 刷新用户数据
  const refreshUser = useCallback(async () => {
    try {
      if (user) {
        const pb = pbAuthService.getPB();
        const updatedUser = await pb.collection('users').getOne(user.id);
        setUser(updatedUser as PBUser);
      }
    } catch (error) {
      console.error('刷新用户数据失败:', error);
    }
  }, [user]);

  // 注册
  const signUp = useCallback(async (email: string, password: string, fullName?: string, username?: string) => {
    setLoading(true);
    try {
      const result = await pbAuthService.signUp({ email, password, fullName, username });
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // 登录
  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await pbAuthService.signIn(email, password);
      if (result.success && result.user) {
        setUser(result.user);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // OAuth登录
  const signInWithProvider = useCallback(async (provider: 'github' | 'google' | 'discord') => {
    setLoading(true);
    try {
      const result = await pbAuthService.signInWithProvider(provider);
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // 退出登录
  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const result = await pbAuthService.signOut();
      if (result.success) {
        setUser(null);
      }
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  // 重置密码
  const resetPassword = useCallback(async (email: string) => {
    return await pbAuthService.resetPassword(email);
  }, []);

  // 更新密码
  const updatePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    return await pbAuthService.updatePassword(oldPassword, newPassword);
  }, []);

  // 更新用户资料
  const updateProfile = useCallback(async (updates: Partial<PBUser>) => {
    if (!user) {
      return { success: false, error: '用户未登录' };
    }

    const result = await pbAuthService.updateUserProfile(user.id, updates);
    if (result.success) {
      await refreshUser();
    }
    return result;
  }, [user, refreshUser]);

  // 获取收藏列表
  const getFavorites = useCallback(async () => {
    if (!user) return [];
    return await pbAuthService.getUserFavorites(user.id);
  }, [user]);

  // 添加收藏
  const addFavorite = useCallback(async (tool: {
    toolId: string;
    toolName: string;
    toolUrl: string;
    toolDescription?: string;
    toolCategory?: string;
  }) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    const result = await pbAuthService.addFavorite(user.id, tool);
    if (result.success) {
      // 记录活动
      await pbAuthService.recordActivity(user.id, {
        type: 'favorite',
        toolId: tool.toolId,
        metadata: { toolName: tool.toolName, category: tool.toolCategory }
      });
    }
    return result;
  }, [user]);

  // 移除收藏
  const removeFavorite = useCallback(async (toolId: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    const result = await pbAuthService.removeFavorite(user.id, toolId);
    if (result.success) {
      // 记录活动
      await pbAuthService.recordActivity(user.id, {
        type: 'unfavorite',
        toolId: toolId
      });
    }
    return result;
  }, [user]);

  // 记录活动
  const recordActivity = useCallback(async (activity: {
    type: 'visit' | 'favorite' | 'unfavorite' | 'search';
    toolId?: string;
    metadata?: any;
  }) => {
    if (!user) return;

    await pbAuthService.recordActivity(user.id, activity);
  }, [user]);

  // 获取活动记录
  const getActivities = useCallback(async (limit: number = 50) => {
    if (!user) return [];
    return await pbAuthService.getUserActivities(user.id, limit);
  }, [user]);

  // 兑换激活码
  const redeemCode = useCallback(async (code: string) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    const result = await pbAuthService.redeemActivationCode(code, user.id);
    if (result.success) {
      await refreshUser();
    }
    return result;
  }, [user, refreshUser]);

  // 检查权限
  const checkPermission = useCallback(async (feature: 'premium_tools' | 'api_access' | 'advanced_features') => {
    if (!user) {
      return { hasPermission: false, reason: 'not_logged_in' };
    }

    return await pbAuthService.checkUserPermission(user.id, feature);
  }, [user]);

  // 消耗积分
  const consumeCredits = useCallback(async (amount: number) => {
    if (!user) {
      return { success: false, error: '请先登录' };
    }

    const result = await pbAuthService.consumeCredits(user.id, amount);
    if (result.success) {
      await refreshUser();
    }
    return result;
  }, [user, refreshUser]);

  const value: PBAuthContextValue = {
    // 状态
    user,
    loading,
    isAuthenticated: !!user && pbAuthService.isAuthenticated(),

    // 认证方法
    signUp,
    signIn,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,

    // 用户资料
    updateProfile,

    // 收藏功能
    getFavorites,
    addFavorite,
    removeFavorite,

    // 活动记录
    recordActivity,
    getActivities,

    // 付费功能
    redeemCode,
    checkPermission,
    consumeCredits,

    // 工具方法
    refreshUser,
  };

  return <PBAuthContext.Provider value={value}>{children}</PBAuthContext.Provider>;
}

export default PBAuthProvider;