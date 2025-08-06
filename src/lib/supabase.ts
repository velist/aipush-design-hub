import { createClient } from '@supabase/supabase-js'

// 这些是演示用的公开密钥，在实际部署时需要替换为真实的Supabase项目密钥
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'

// 开发环境的临时配置
// 在生产环境中，这些值应该从环境变量中获取
const DEMO_SUPABASE_URL = 'https://demo.supabase.co'
const DEMO_SUPABASE_ANON_KEY = 'demo-key'

// 创建Supabase客户端
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL || DEMO_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY || DEMO_SUPABASE_ANON_KEY
)

// 数据库表类型定义
export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  provider: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  username: string | null
  bio: string | null
  website: string | null
  location: string | null
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    language: string
    notifications: boolean
  }
  created_at: string
  updated_at: string
}

export interface FavoriteTool {
  id: string
  user_id: string
  tool_id: string
  tool_name: string
  tool_url: string
  tool_description: string | null
  tool_category: string | null
  created_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: 'visit' | 'favorite' | 'unfavorite' | 'search'
  tool_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

// SQL创建表的语句（用于Supabase SQL编辑器）
export const CREATE_TABLES_SQL = `
-- 用户资料表
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  bio TEXT,
  website TEXT,
  location TEXT,
  preferences JSONB DEFAULT '{"theme": "auto", "language": "zh-CN", "notifications": true}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- 用户收藏工具表
CREATE TABLE favorite_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  tool_url TEXT NOT NULL,
  tool_description TEXT,
  tool_category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, tool_id)
);

-- 用户活动记录表
CREATE TABLE user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('visit', 'favorite', 'unfavorite', 'search')),
  tool_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_favorite_tools_user_id ON favorite_tools(user_id);
CREATE INDEX idx_favorite_tools_tool_id ON favorite_tools(tool_id);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);

-- 启用行级安全策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- 用户资料表的RLS策略
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 收藏工具表的RLS策略
CREATE POLICY "Users can manage own favorites" ON favorite_tools
  FOR ALL USING (auth.uid() = user_id);

-- 用户活动表的RLS策略
CREATE POLICY "Users can view own activities" ON user_activities
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON user_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 创建触发器以自动更新 updated_at 字段
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 创建函数：用户注册时自动创建用户资料
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建触发器：当新用户注册时自动创建用户资料
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
`;

export default supabase;