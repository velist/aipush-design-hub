import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Newspaper, Zap, Brain, MessageSquare } from "lucide-react"

interface AITool {
  id: string
  name: string
  description: string
  url: string
  status: 'live' | 'coming-soon' | 'development'
  icon: React.ReactNode
  category: string
}

const aiTools: AITool[] = [
  {
    id: 'ai-news',
    name: 'AI 世界新闻',
    description: '智能聚合全球AI新闻，提供中文翻译和AI深度点评',
    url: 'https://news.aipush.fun',
    status: 'live',
    icon: <Newspaper className="h-6 w-6" />,
    category: '新闻聚合'
  },
  {
    id: 'text-generator',
    name: 'AI 文本生成器',
    description: '基于先进语言模型的智能文本生成工具',
    url: '#',
    status: 'coming-soon',
    icon: <Zap className="h-6 w-6" />,
    category: '文本处理'
  },
  {
    id: 'image-analyzer',
    name: 'AI 图像分析',
    description: '智能图像识别、分析和内容理解工具',
    url: '#',
    status: 'development',
    icon: <Brain className="h-6 w-6" />,
    category: '图像处理'
  },
  {
    id: 'chat-assistant',
    name: 'AI 对话助手',
    description: '智能对话助手，支持多场景应用',
    url: '#',
    status: 'coming-soon',
    icon: <MessageSquare className="h-6 w-6" />,
    category: '对话助手'
  }
]

const statusColors = {
  live: 'bg-green-100 text-green-800 border-green-200',
  'coming-soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  development: 'bg-blue-100 text-blue-800 border-blue-200'
}

const statusText = {
  live: '已上线',
  'coming-soon': '即将上线',
  development: '开发中'
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AIPush</h1>
                <p className="text-sm text-gray-600">AI工具集合站</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              GitHub
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            探索 AI 工具的
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              {" "}无限可能
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            精心打造的AI工具集合，让人工智能为您的工作和生活带来更多便利
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600">
              探索工具
            </Button>
            <Button variant="outline" size="lg">
              了解更多
            </Button>
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {aiTools.map((tool) => (
            <Card key={tool.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {tool.icon}
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[tool.status]}`}>
                    {statusText[tool.status]}
                  </span>
                </div>
                <CardTitle className="text-lg">{tool.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {tool.category}
                  </span>
                  {tool.status === 'live' ? (
                    <Button 
                      size="sm" 
                      onClick={() => window.open(tool.url, '_blank')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      访问
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" disabled>
                      {tool.status === 'coming-soon' ? '敬请期待' : '开发中'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">AIPush</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2024 AIPush. 让AI为生活带来更多可能。
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}