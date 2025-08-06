import { ExternalLink, ArrowRight, Star, Users, TrendingUp, MessageCircle, Palette, Mic, Video, Briefcase, Code, BarChart3, FileText, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { userAuthService } from '@/services/userAuthService';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import newsIcon from '@/assets/news-icon-new.png';
import chatIcon from '@/assets/chat-icon-new.png';
import imageIcon from '@/assets/image-icon-new.png';
import writingIcon from '@/assets/writing-icon-new.png';
import codeIcon from '@/assets/code-icon-new.png';
import analyticsIcon from '@/assets/analytics-icon-new.png';

const ToolsGrid = () => {
  console.log('ToolsGrid component loaded - new version');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteLoading, setFavoriteLoading] = useState<string[]>([]);

  // 获取用户收藏列表
  useEffect(() => {
    if (user) {
      loadUserFavorites();
    }
  }, [user]);

  const loadUserFavorites = async () => {
    if (!user) return;
    
    try {
      const userFavorites = await userAuthService.getUserFavorites(user.id);
      setFavorites(userFavorites.map(fav => fav.tool_id));
    } catch (error) {
      console.error('加载用户收藏失败:', error);
    }
  };

  const handleFavorite = async (tool: any, category?: string) => {
    if (!user) {
      toast({
        title: '请先登录',
        description: '登录后即可收藏您喜爱的工具',
        variant: 'destructive'
      });
      return;
    }

    const toolId = tool.id.toString();
    const isFavorited = favorites.includes(toolId);
    
    setFavoriteLoading(prev => [...prev, toolId]);

    try {
      if (isFavorited) {
        const result = await userAuthService.removeFavorite(user.id, toolId);
        if (result.success) {
          setFavorites(prev => prev.filter(id => id !== toolId));
          toast({
            title: '取消收藏',
            description: `已取消收藏 ${tool.name}`
          });
        } else {
          toast({
            title: '操作失败',
            description: result.error,
            variant: 'destructive'
          });
        }
      } else {
        const result = await userAuthService.addFavorite(user.id, {
          toolId: toolId,
          toolName: tool.name,
          toolUrl: tool.url,
          toolDescription: tool.description,
          toolCategory: category || tool.category
        });
        if (result.success) {
          setFavorites(prev => [...prev, toolId]);
          toast({
            title: '收藏成功',
            description: `已收藏 ${tool.name}`
          });
        } else {
          toast({
            title: '收藏失败',
            description: result.error,
            variant: 'destructive'
          });
        }
      }

      // 记录用户活动
      await userAuthService.recordActivity(user.id, {
        type: isFavorited ? 'unfavorite' : 'favorite',
        toolId: toolId,
        metadata: { toolName: tool.name, category: category || tool.category }
      });
    } catch (error) {
      toast({
        title: '操作失败',
        description: '收藏操作时发生错误',
        variant: 'destructive'
      });
    } finally {
      setFavoriteLoading(prev => prev.filter(id => id !== toolId));
    }
  };

  const handleToolClick = async (tool: any, category?: string) => {
    // 记录访问活动
    if (user && tool.status === '已上线') {
      try {
        await userAuthService.recordActivity(user.id, {
          type: 'visit',
          toolId: tool.id.toString(),
          metadata: { toolName: tool.name, category: category || tool.category }
        });
      } catch (error) {
        console.error('记录访问活动失败:', error);
      }
    }
  };

  // 本站工具
  const myTools = [
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
      category: '绘画',
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
      category: '办公',
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
      category: '办公',
      featured: false,
      color: 'from-teal-500 to-cyan-500',
    },
  ];

  // 站外工具分类
  const externalToolCategories = [
    {
      name: '对话',
      icon: MessageCircle,
      tools: [
        {
          id: 7,
          name: 'ChatGPT',
          description: 'OpenAI推出的强大对话AI，支持文本生成、问答、创意写作等多种功能',
          icon: chatIcon,
          url: 'https://chat.openai.com',
          status: '已上线',
          users: '100M+',
          featured: true,
        },
        {
          id: 8,
          name: 'Claude',
          description: 'Anthropic开发的AI助手，擅长分析推理和安全对话',
          icon: chatIcon,
          url: 'https://claude.ai',
          status: '已上线',
          users: '10M+',
          featured: false,
        },
        {
          id: 9,
          name: 'Gemini',
          description: 'Google推出的多模态AI，支持文本、图像、代码等多种任务',
          icon: chatIcon,
          url: 'https://gemini.google.com',
          status: '已上线',
          users: '50M+',
          featured: false,
        },
      ]
    },
    {
      name: '绘画',
      icon: Palette,
      tools: [
        {
          id: 10,
          name: 'Midjourney',
          description: '顶级AI图像生成工具，创造令人惊叹的艺术作品和视觉内容',
          icon: imageIcon,
          url: 'https://midjourney.com',
          status: '已上线',
          users: '15M+',
          featured: true,
        },
        {
          id: 11,
          name: 'DALL-E 3',
          description: 'OpenAI的图像生成模型，支持自然语言描述生成高质量图像',
          icon: imageIcon,
          url: 'https://openai.com/dall-e-3',
          status: '已上线',
          users: '5M+',
          featured: false,
        },
        {
          id: 12,
          name: 'Stable Diffusion',
          description: '开源的图像生成模型，支持多种风格和自定义训练',
          icon: imageIcon,
          url: 'https://stability.ai',
          status: '已上线',
          users: '20M+',
          featured: false,
        },
      ]
    },
    {
      name: '视频',
      icon: Video,
      tools: [
        {
          id: 13,
          name: 'Runway',
          description: 'AI视频生成和编辑平台，支持文本生成视频、视频风格转换等',
          icon: imageIcon,
          url: 'https://runway.com',
          status: '已上线',
          users: '2M+',
          featured: true,
        },
        {
          id: 14,
          name: 'Pika Labs',
          description: 'AI视频生成工具，支持文本和图像生成短视频',
          icon: imageIcon,
          url: 'https://pika.art',
          status: '已上线',
          users: '1M+',
          featured: false,
        },
      ]
    },
    {
      name: '语音',
      icon: Mic,
      tools: [
        {
          id: 15,
          name: 'ElevenLabs',
          description: 'AI语音合成和克隆工具，支持多种语言和声音风格',
          icon: chatIcon,
          url: 'https://elevenlabs.io',
          status: '已上线',
          users: '3M+',
          featured: true,
        },
        {
          id: 16,
          name: 'Murf',
          description: 'AI配音工具，支持多种语音风格和语言的专业配音',
          icon: chatIcon,
          url: 'https://murf.ai',
          status: '已上线',
          users: '1M+',
          featured: false,
        },
      ]
    },
    {
      name: '办公',
      icon: Briefcase,
      tools: [
        {
          id: 17,
          name: 'Notion AI',
          description: '集成在Notion中的AI写作助手，帮助整理思路和内容创作',
          icon: writingIcon,
          url: 'https://notion.so/product/ai',
          status: '已上线',
          users: '30M+',
          featured: true,
        },
        {
          id: 18,
          name: 'Jasper',
          description: 'AI写作助手，专注于营销文案和内容创作',
          icon: writingIcon,
          url: 'https://jasper.ai',
          status: '已上线',
          users: '100K+',
          featured: false,
        },
        {
          id: 19,
          name: 'Copy.ai',
          description: 'AI文案生成工具，支持多种营销文案和创意写作',
          icon: writingIcon,
          url: 'https://copy.ai',
          status: '已上线',
          users: '10M+',
          featured: false,
        },
      ]
    },
    {
      name: '开发',
      icon: Code,
      tools: [
        {
          id: 20,
          name: 'GitHub Copilot',
          description: 'AI编程助手，智能代码补全和生成，提升开发效率',
          icon: codeIcon,
          url: 'https://github.com/features/copilot',
          status: '已上线',
          users: '1M+',
          featured: true,
        },
        {
          id: 21,
          name: 'Cursor',
          description: 'AI代码编辑器，集成强大的AI编程助手功能',
          icon: codeIcon,
          url: 'https://cursor.sh',
          status: '已上线',
          users: '500K+',
          featured: false,
        },
        {
          id: 22,
          name: 'Replit',
          description: '在线编程平台，集成AI代码生成和调试功能',
          icon: codeIcon,
          url: 'https://replit.com',
          status: '已上线',
          users: '20M+',
          featured: false,
        },
      ]
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

  const ToolCard = ({ tool, index, isExternal = false, category }: { tool: any, index: number, isExternal?: boolean, category?: string }) => {
    const toolId = tool.id.toString();
    const isFavorited = favorites.includes(toolId);
    const isLoadingFavorite = favoriteLoading.includes(toolId);

    return (
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
            <div className={`p-3 rounded-xl ${isExternal ? 'bg-gradient-to-r from-gray-500 to-gray-600' : `bg-gradient-to-r ${tool.color}`} shimmer-effect`}>
              <img src={tool.icon} alt={tool.name} className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                {tool.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                {tool.featured && (
                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                )}
                {isExternal && (
                  <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                    外部工具
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* 收藏按钮 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFavorite(tool, category)}
              disabled={isLoadingFavorite}
              className={`h-8 w-8 p-0 ${
                isFavorited 
                  ? 'text-red-500 hover:text-red-600' 
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
            </Button>
            <div className={`w-2 h-2 rounded-full ${getStatusColor(tool.status)}`}></div>
          </div>
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
              onClick={() => handleToolClick(tool, category)}
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
    );
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

        {/* 本站工具 */}
        <div className="mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white/70 backdrop-blur-sm border border-white/60 p-4 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-center text-gradient flex items-center justify-center space-x-2">
                <Badge className="bg-blue-500 text-white">本站工具</Badge>
                <span>AI Push 工具集</span>
              </h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myTools.map((tool, index) => (
              <ToolCard key={tool.id} tool={tool} index={index} category="本站工具" />
            ))}
          </div>
        </div>

        {/* 站外工具 */}
        <div>
          <div className="flex items-center justify-center mb-12">
            <div className="bg-white/70 backdrop-blur-sm border border-white/60 p-4 rounded-2xl shadow-sm">
              <h3 className="text-2xl font-bold text-center text-gradient flex items-center justify-center space-x-2">
                <Badge className="bg-gray-500 text-white">站外工具</Badge>
                <span>精选AI工具推荐</span>
              </h3>
            </div>
          </div>

          {externalToolCategories.map((category, categoryIndex) => {
            const CategoryIcon = category.icon;
            return (
              <div key={category.name} className="mb-16">
                {/* 分类标题 */}
                <div className="flex items-center justify-center mb-8">
                  <div className="bg-white/60 backdrop-blur-sm border border-white/40 p-3 rounded-xl shadow-sm">
                    <div className="flex items-center space-x-3">
                      <CategoryIcon className="h-6 w-6 text-blue-600" />
                      <h4 className="text-xl font-bold text-gray-800">{category.name}</h4>
                    </div>
                  </div>
                </div>
                
                {/* 工具网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.tools.map((tool, toolIndex) => (
                    <ToolCard 
                      key={tool.id} 
                      tool={tool} 
                      index={categoryIndex * 3 + toolIndex} 
                      isExternal={true}
                      category={category.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coming Soon Banner */}
        <div className="mt-16 text-center">
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 p-8 rounded-2xl inline-block shadow-sm">
            <h3 className="text-2xl font-bold text-gradient mb-4">更多工具即将推出</h3>
            <p className="text-gray-600 mb-6">
              我们正在开发更多创新的AI工具，同时持续收录优质的站外AI工具
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