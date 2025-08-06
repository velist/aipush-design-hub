# 用户认证系统部署指南

## 🚀 概述

本项目集成了完整的用户认证系统，支持：
- ✅ 邮箱注册/登录
- ✅ 第三方OAuth登录（GitHub、Google等）
- ✅ 用户个人中心
- ✅ 工具收藏功能
- ✅ 用户活动记录

## 📋 部署前准备

### 1. 创建Supabase项目

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 等待项目初始化完成
4. 获取以下信息：
   - Project URL
   - Anon Key

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# Supabase配置
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. 数据库设置

在 Supabase Dashboard > SQL Editor 中执行以下SQL：

```sql
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

-- 创建索引
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_favorite_tools_user_id ON favorite_tools(user_id);
CREATE INDEX idx_favorite_tools_tool_id ON favorite_tools(tool_id);
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at DESC);

-- 启用行级安全
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activities ENABLE ROW LEVEL SECURITY;

-- RLS策略
CREATE POLICY "Users can manage own profile" ON user_profiles
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own favorites" ON favorite_tools
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own activities" ON user_activities
  FOR ALL USING (auth.uid() = user_id);

-- 触发器
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

-- 自动创建用户资料
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (user_id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
```

### 4. 配置认证提供商

#### GitHub OAuth
1. 在 GitHub Settings > Developer settings > OAuth Apps 创建新应用
2. 设置回调URL: `https://your-project.supabase.co/auth/v1/callback`
3. 在 Supabase Dashboard > Authentication > Providers 中配置GitHub
4. 输入Client ID和Client Secret

#### Google OAuth
1. 在 Google Cloud Console 创建OAuth 2.0客户端
2. 设置回调URL: `https://your-project.supabase.co/auth/v1/callback`
3. 在 Supabase Dashboard中配置Google提供商

### 5. 邮件模板配置

在 Supabase Dashboard > Authentication > Email Templates 中自定义：
- 确认注册邮件
- 密码重置邮件
- 邮箱更改确认邮件

## 🛠 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 📁 文件结构

```
src/
├── lib/
│   └── supabase.ts              # Supabase配置和类型定义
├── services/
│   └── userAuthService.ts       # 用户认证服务
├── contexts/
│   └── AuthContext.tsx          # 认证状态管理
├── pages/
│   ├── Auth.tsx                 # 登录/注册页面
│   └── Profile.tsx              # 用户个人中心
└── components/
    ├── Navigation.tsx           # 导航栏（含用户状态）
    └── ToolsGrid.tsx           # 工具网格（含收藏功能）
```

## 🔧 功能特性

### 认证功能
- 邮箱注册（含验证）
- 邮箱登录
- 第三方OAuth登录
- 密码重置
- 会话管理

### 用户功能
- 个人资料管理
- 偏好设置
- 工具收藏
- 活动历史
- 密码修改

### 管理功能
- 用户行为分析
- 收藏统计
- 活动追踪

## 🚀 部署说明

### GitHub Pages部署
项目已配置GitHub Actions自动部署，推送到main分支即可触发部署。

### 环境变量配置
在GitHub项目的Settings > Secrets and variables > Actions中添加：
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### 注意事项
1. 确保Supabase项目的域名已添加到允许的源列表
2. OAuth回调URL需要配置为部署域名
3. 邮件模板中的链接需要指向正确的域名

## 📞 支持

如有问题，请检查：
1. Supabase项目是否正确配置
2. 环境变量是否正确设置
3. 数据库表是否创建成功
4. OAuth提供商是否正确配置

项目地址：https://velist.github.io/aipush-design-hub/
管理后台：https://velist.github.io/aipush-design-hub/#/admin/login

---

© 2024 AI Push - AI工具导航平台