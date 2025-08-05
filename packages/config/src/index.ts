// 工具配置
export interface ToolConfig {
  id: string
  name: string
  description: string
  url: string
  status: 'live' | 'coming-soon' | 'development'
  category: string
  icon?: string
}

// 网站配置
export interface SiteConfig {
  title: string
  description: string
  url: string
  domain: string
  tools: ToolConfig[]
}

// 默认网站配置
export const defaultSiteConfig: SiteConfig = {
  title: 'AIPush - AI工具集合站',
  description: '探索人工智能的无限可能，精心打造的AI工具集合',
  url: 'https://aipush.fun',
  domain: 'aipush.fun',
  tools: [
    {
      id: 'ai-news',
      name: 'AI 世界新闻',
      description: '智能聚合全球AI新闻，提供中文翻译和AI深度点评',
      url: 'https://news.aipush.fun',
      status: 'live',
      category: '新闻聚合'
    },
    {
      id: 'text-generator',
      name: 'AI 文本生成器',
      description: '基于先进语言模型的智能文本生成工具',
      url: '#',
      status: 'coming-soon',
      category: '文本处理'
    },
    {
      id: 'image-analyzer',
      name: 'AI 图像分析',
      description: '智能图像识别、分析和内容理解工具',
      url: '#',
      status: 'development',
      category: '图像处理'  
    },
    {
      id: 'chat-assistant',
      name: 'AI 对话助手',
      description: '智能对话助手，支持多场景应用',
      url: '#',
      status: 'coming-soon',
      category: '对话助手'
    }
  ]
}

// API配置
export const apiConfig = {
  baseUrl: process.env.NODE_ENV === 'production' 
    ? 'https://api.aipush.fun' 
    : 'http://localhost:3001',
  timeout: 10000
}

// 主题配置
export const themeConfig = {
  colors: {
    primary: 'hsl(221.2 83.2% 53.3%)',
    secondary: 'hsl(210 40% 96%)',
    accent: 'hsl(210 40% 96%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 84% 4.9%)'
  },
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'monospace']
  }
}