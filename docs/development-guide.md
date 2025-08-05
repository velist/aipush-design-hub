# 开发指南

## 项目结构详解

### Monorepo 架构说明

本项目采用 **Turbo** 驱动的 Monorepo 架构，将多个相关的应用和包组织在同一个仓库中：

#### 核心目录说明

```
aipush-design-hub/
├── apps/                    # 应用层
│   ├── ai-news/            # AI新闻工具 (集成现有项目)
│   ├── text-generator/     # 文本生成工具 (待开发)
│   ├── image-analyzer/     # 图像分析工具 (待开发)
│   └── chat-assistant/     # 对话助手 (待开发)
├── packages/               # 共享包层
│   ├── ui/                # UI组件库 (@aipush/ui)
│   ├── utils/             # 工具函数 (@aipush/utils)  
│   └── config/            # 配置管理 (@aipush/config)
├── www/                   # 主站点 (工具导航和展示)
└── .github/workflows/     # 自动化部署配置
```

### 技术选型原则

1. **统一性**: 所有应用使用相同的技术栈
2. **复用性**: 最大化组件和逻辑的共享
3. **扩展性**: 易于添加新工具和功能
4. **性能**: 优化打包和运行时性能

## 开发工作流

### 1. 环境准备

```bash
# 安装Node.js 18+
node --version

# 克隆仓库
git clone https://github.com/velist/aipush-design-hub.git
cd aipush-design-hub

# 安装全局依赖
npm install
```

### 2. 开发模式

```bash
# 启动所有应用 (并行开发)
npm run dev

# 启动特定应用
npm run dev:www          # 主站点
npm run dev:news         # AI新闻工具
```

### 3. 构建和测试

```bash
# 构建所有项目
npm run build

# 类型检查
npm run type-check

# 代码质量检查
npm run lint

# 清理构建缓存
npm run clean
```

## 添加新AI工具

### 创建新应用的完整流程

#### 1. 初始化应用结构

```bash
# 创建应用目录
mkdir -p apps/your-tool-name/src/{components,pages,hooks,types}
cd apps/your-tool-name
```

#### 2. 配置 package.json

```json
{
  "name": "@aipush/your-tool-name",
  "version": "1.0.0",
  "description": "你的AI工具描述",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@aipush/ui": "workspace:*",
    "@aipush/utils": "workspace:*",
    "@aipush/config": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.56",
    "@types/react-dom": "^18.2.19",
    "@vitejs/plugin-react-swc": "^3.5.0",
    "typescript": "^5.2.2",
    "vite": "^5.1.4"
  }
}
```

#### 3. Vite配置 (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3002, // 使用不同端口
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
```

#### 4. TypeScript配置

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

#### 5. 应用入口文件

```typescript
// src/App.tsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button, Card } from '@aipush/ui'
import { formatDate } from '@aipush/utils'
import { defaultSiteConfig } from '@aipush/config'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>你的AI工具</CardTitle>
          <CardDescription>工具描述</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>开始使用</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
```

### 6. 更新主站点配置

在 `packages/config/src/index.ts` 中添加新工具：

```typescript
export const defaultSiteConfig: SiteConfig = {
  // ... 其他配置
  tools: [
    // ... 现有工具
    {
      id: 'your-tool-name',
      name: '你的AI工具',
      description: '工具功能描述',
      url: 'https://your-tool.aipush.fun',
      status: 'development',
      category: '工具分类'
    }
  ]
}
```

## 共享组件使用

### UI组件库 (@aipush/ui)

```typescript
import { 
  Button, 
  Card, CardHeader, CardTitle, CardDescription, CardContent,
  cn 
} from '@aipush/ui'

// 使用示例
<Card className="hover:shadow-lg transition-shadow">
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述文本</CardDescription>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="lg">
      操作按钮
    </Button>
  </CardContent>
</Card>
```

### 工具函数库 (@aipush/utils)

```typescript
import { 
  formatDate, 
  isValidUrl, 
  truncateText, 
  debounce 
} from '@aipush/utils'

// 使用示例
const formattedDate = formatDate(new Date(), 'relative')
const isValid = isValidUrl('https://example.com')
const shortText = truncateText('很长的文本...', 50)
```

### 配置管理 (@aipush/config)

```typescript
import { 
  defaultSiteConfig, 
  apiConfig, 
  themeConfig 
} from '@aipush/config'

// 获取工具列表
const tools = defaultSiteConfig.tools

// API配置
const baseUrl = apiConfig.baseUrl
```

## 样式系统

### Tailwind CSS 配置

所有应用共享相同的设计系统：

```css
/* 主色调变量 */
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96%;
  --accent: 210 40% 96%;
}

/* 响应式断点 */
sm: 640px
md: 768px  
lg: 1024px
xl: 1280px
2xl: 1536px
```

### 组件样式规范

```typescript
// 使用 cn 函数组合样式
import { cn } from '@aipush/ui'

<div className={cn(
  "base-styles",
  variant === "primary" && "primary-styles",
  className
)}>
```

## 部署配置

### 环境变量管理

```bash
# .env.local (本地开发)
VITE_APP_TITLE=AIPush
VITE_API_URL=http://localhost:3001

# .env.production (生产环境)  
VITE_APP_TITLE=AIPush
VITE_API_URL=https://api.aipush.fun
```

### 多应用部署策略

1. **主站点**: `aipush.fun` (www目录)
2. **AI新闻**: `news.aipush.fun` (apps/ai-news)
3. **新工具**: `tool-name.aipush.fun` (apps/tool-name)

### GitHub Actions 配置

```yaml
# .github/workflows/deploy-tool.yml
name: 部署新工具
on:
  push:
    paths: ['apps/your-tool/**']
    
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: 构建和部署
        run: |
          cd apps/your-tool
          npm run build
          # 部署逻辑
```

## 性能优化建议

### 1. 代码分割

```typescript
// 路由级别的懒加载
const HomePage = React.lazy(() => import('./pages/HomePage'))
const ToolPage = React.lazy(() => import('./pages/ToolPage'))

<Suspense fallback={<div>加载中...</div>}>
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/tool" element={<ToolPage />} />
  </Routes>
</Suspense>
```

### 2. 组件优化

```typescript
// 使用 memo 避免不必要的重渲染
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* 复杂组件 */}</div>
})

// 使用 useMemo 缓存计算结果
const processedData = useMemo(() => {
  return expensiveCalculation(data)
}, [data])
```

### 3. 打包优化

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@aipush/ui']
        }
      }
    }
  }
})
```

## 调试技巧

### 1. 开发工具

```bash
# 查看构建信息
npm run build -- --debug

# 分析包大小
npm run build -- --analyze

# 查看类型错误详情
npm run type-check -- --verbose
```

### 2. 浏览器调试

```typescript
// React DevTools
// Vite 热重载调试
if (import.meta.hot) {
  import.meta.hot.accept()
}
```

## 常见问题解决

### 1. 依赖版本冲突

```bash
# 清理node_modules
npm run clean
npm install

# 检查依赖树
npm ls
```

### 2. TypeScript错误

```bash
# 重新生成类型文件
npm run type-check

# 检查tsconfig配置
npx tsc --showConfig
```

### 3. 构建失败

```bash
# 查看详细错误
npm run build -- --verbose

# 清理缓存重试
rm -rf dist node_modules/.vite
npm run build
```

这个开发指南应该能帮助团队成员快速上手项目开发。有任何问题都可以通过GitHub Issues讨论。