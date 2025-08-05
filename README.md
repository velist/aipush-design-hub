# AIPush Design Hub

> **AI工具集合站** - 探索人工智能的无限可能

[![Deploy](https://github.com/velist/aipush-design-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/velist/aipush-design-hub/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 项目概述

AIPush Design Hub 是一个基于 Monorepo 架构的 AI 工具集合站，旨在将多个AI应用统一管理和部署。项目采用现代化的技术栈，提供一致的用户体验和高效的开发流程。

### 🎯 核心特性

- ✅ **Monorepo 架构** - 统一管理多个AI工具应用
- ✅ **组件共享** - 基于 shadcn/ui 的统一设计系统  
- ✅ **TypeScript** - 全面的类型安全保障
- ✅ **响应式设计** - 支持桌面和移动设备
- ✅ **自动化部署** - GitHub Actions + Vercel/Netlify
- ✅ **SEO优化** - 完善的元数据和结构化数据

## 🏗️ 项目架构

```
aipush-design-hub/
├── apps/                    # 各个AI工具应用
│   ├── ai-news/            # AI新闻聚合工具
│   ├── text-generator/     # 文本生成工具 (规划中)
│   └── image-analyzer/     # 图像分析工具 (规划中)
├── packages/               # 共享包
│   ├── ui/                # 通用UI组件库
│   ├── utils/             # 工具函数库
│   └── config/            # 配置管理
├── www/                   # 主站点(工具导航页)
├── .github/workflows/     # CI/CD配置
└── docs/                  # 项目文档
```

## 🚀 技术栈

### 核心技术
- **React 18** - 现代化React应用
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的构建工具
- **Tailwind CSS** - 实用优先的CSS框架

### UI组件
- **shadcn/ui** - 高质量组件库
- **Radix UI** - 无障碍访问的原语组件
- **Lucide React** - 美观的图标库

### 工具链
- **Turbo** - 单体仓库构建系统
- **ESLint** - 代码质量检查
- **PostCSS** - CSS处理工具

### 部署平台
- **Vercel** - 主要部署平台
- **Netlify** - 备用部署平台
- **GitHub Pages** - 静态站点托管

## 📦 快速开始

### 环境要求
- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/velist/aipush-design-hub.git
   cd aipush-design-hub
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **开发模式**
   ```bash
   # 启动所有应用
   npm run dev
   
   # 仅启动主站点
   npm run dev:www
   
   # 仅启动AI新闻工具
   npm run dev:news
   ```

4. **构建项目**
   ```bash
   # 构建所有项目
   npm run build
   
   # 类型检查
   npm run type-check
   
   # 代码检查
   npm run lint
   ```

## 🛠️ 开发指南

### 添加新工具

1. **创建应用目录**
   ```bash
   mkdir -p apps/your-tool/src
   cd apps/your-tool
   ```

2. **初始化应用**
   ```bash
   npm init -y
   # 配置package.json，参考现有应用结构
   ```

3. **使用共享组件**
   ```typescript
   import { Button, Card } from '@aipush/ui'
   import { formatDate } from '@aipush/utils'
   import { defaultSiteConfig } from '@aipush/config'
   ```

### 部署配置

#### Vercel部署
1. 连接GitHub仓库到Vercel
2. 配置构建设置：
   - Build Command: `npm run build`
   - Output Directory: `www/dist`

#### Netlify部署  
1. 连接GitHub仓库到Netlify
2. 使用项目根目录的 `netlify.toml` 配置

#### 自定义域名
1. 在DNS提供商添加CNAME记录
2. 在部署平台配置自定义域名

## 🎨 设计系统

### 颜色主题
```css
/* 主色调 */
--primary: 221.2 83.2% 53.3%;
--secondary: 210 40% 96%;

/* 语义色彩 */
--success: 142 76% 36%;
--warning: 38 92% 50%;
--error: 0 84% 60%;
```

### 组件使用
```typescript
// 按钮组件
<Button variant="default" size="lg">
  点击我
</Button>

// 卡片组件  
<Card>
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    内容区域
  </CardContent>
</Card>
```

## 📊 工具列表

| 工具名称 | 状态 | 访问地址 | 描述 |
|---------|------|----------|------|
| AI世界新闻 | ✅ 已上线 | [news.aipush.fun](https://news.aipush.fun) | 智能AI新闻聚合 |
| 文本生成器 | 🚧 开发中 | - | AI文本生成工具 |
| 图像分析 | 📋 规划中 | - | 智能图像识别 |
| 对话助手 | 📋 规划中 | - | AI对话机器人 |

## 🤝 贡献指南

### 开发流程
1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/new-tool`)
3. 提交更改 (`git commit -am 'Add new tool'`)
4. 推送分支 (`git push origin feature/new-tool`)
5. 创建 Pull Request

### 代码规范
- 遵循 ESLint 规则
- 使用 TypeScript 类型注解
- 组件名使用 PascalCase
- 文件名使用 kebab-case

## 📈 性能优化

### 构建优化
- **代码分割** - 按需加载应用模块
- **Tree Shaking** - 去除未使用代码
- **静态资源压缩** - Gzip/Brotli压缩

### 运行时优化  
- **React.lazy** - 懒加载组件
- **useMemo/useCallback** - 避免不必要的重渲染
- **图片优化** - WebP格式和懒加载

## 🔒 安全考虑

- **CSP策略** - 内容安全策略配置
- **XSS防护** - 输入输出过滤
- **HTTPS强制** - 全站HTTPS加密
- **环境变量** - 敏感信息隔离

## 📝 许可证

本项目采用 [MIT 许可证](LICENSE)。

## 🙏 致谢

- [shadcn/ui](https://ui.shadcn.com/) - 优秀的组件库
- [Tailwind CSS](https://tailwindcss.com/) - 实用的CSS框架
- [Vercel](https://vercel.com/) - 出色的部署平台

---

<p align="center">
  <strong>让AI为生活带来更多可能 🚀</strong>
</p>

<p align="center">
  <a href="https://aipush.fun">🌐 访问网站</a> •
  <a href="https://github.com/velist/aipush-design-hub/issues">🐛 报告问题</a> •
  <a href="https://github.com/velist/aipush-design-hub/discussions">💬 讨论交流</a>
</p>