import { ExternalLink, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import newsIcon from '@/assets/news-icon-new.png';
import chatIcon from '@/assets/chat-icon-new.png';
import imageIcon from '@/assets/image-icon-new.png';
import writingIcon from '@/assets/writing-icon-new.png';
import codeIcon from '@/assets/code-icon-new.png';
import analyticsIcon from '@/assets/analytics-icon-new.png';

const ToolsGrid = () => {
  const tools = [
    {
      id: 1,
      name: 'AI新闻推送',
      description: '实时AI新闻聚合，智能翻译与深度分析，让您第一时间掌握AI行业动态',
      icon: newsIcon,
      url: 'https://news.aipush.fun/',
      status: '已上线',
      users: '5K+',
      category: '资讯',
      featured: true,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 2,
      name: 'AI智能对话',
      description: '基于最新大语言模型，提供智能对话、文本生成、问答助手等功能',
      icon: chatIcon,
      url: '#',
      status: '开发中',
      users: '即将推出',
      category: '对话',
      featured: true,
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 3,
      name: 'AI图像生成',
      description: '文本转图像、图像编辑、风格转换，释放您的创意想象力',
      icon: imageIcon,
      url: '#',
      status: '开发中',
      users: '即将推出',
      category: '创意',
      featured: false,
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 4,
      name: 'AI写作助手',
      description: '智能文章生成、语法检查、内容优化，提升您的写作效率',
      icon: writingIcon,
      url: '#',
      status: '规划中',
      users: '敬请期待',
      category: '写作',
      featured: false,
      color: 'from-orange-500 to-red-500',
    },
    {
      id: 5,
      name: 'AI代码助手',
      description: '智能代码生成、Bug修复、代码优化，成为您的编程伙伴',
      icon: codeIcon,
      url: '#',
      status: '规划中',
      users: '敬请期待',
      category: '开发',
      featured: false,
      color: 'from-indigo-500 to-blue-500',
    },
    {
      id: 6,
      name: 'AI数据分析',
      description: '智能数据洞察、可视化图表、趋势预测，让数据说话',
      icon: analyticsIcon,
      url: '#',
      status: '规划中',
      users: '敬请期待',
      category: '分析',
      featured: false,
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已上线': return 'bg-green-500';
      case '开发中': return 'bg-yellow-500';
      case '规划中': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <section id="tools" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 glass-button">
            AI工具合集
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-gradient">强大的AI工具</span>
            <br />
            一站式解决方案
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            从新闻资讯到创意生成，从代码开发到数据分析，我们为您提供全方位的AI工具支持
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className={`group bg-white/80 backdrop-blur-sm border border-white/60 p-6 rounded-2xl hover-lift transition-all duration-500 shadow-sm ${
                tool.featured ? 'ring-2 ring-blue-200/50' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Tool Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color} shimmer-effect`}>
                    <img src={tool.icon} alt={tool.name} className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                        {tool.category}
                      </Badge>
                      {tool.featured && (
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                      )}
                    </div>
                  </div>
                </div>
                <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`}></div>
              </div>

              {/* Tool Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {tool.description}
              </p>

              {/* Tool Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{tool.users}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>{tool.status}</span>
                  </div>
                </div>
              </div>

              {/* Tool Actions */}
              <div className="flex space-x-2">
                {tool.status === '已上线' ? (
                  <Button
                    asChild
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white group/btn border-0 shadow-lg"
                  >
                    <a href={tool.url} target="_blank" rel="noopener noreferrer">
                      立即使用
                      <ExternalLink className="ml-2 h-4 w-4 group-hover/btn:rotate-12 transition-transform" />
                    </a>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="flex-1 bg-white/60 border-gray-200 hover:bg-white/80"
                    disabled
                  >
                    {tool.status === '开发中' ? '敬请期待' : '即将推出'}
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="bg-white/40 hover:bg-white/60">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 p-8 rounded-2xl inline-block shadow-sm">
            <h3 className="text-2xl font-bold text-gradient mb-4">更多工具即将推出</h3>
            <p className="text-gray-600 mb-6">
              我们正在开发更多创新的AI工具，敬请期待！
            </p>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
              订阅更新通知
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ToolsGrid;