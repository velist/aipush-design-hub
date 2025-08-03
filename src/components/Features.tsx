import { Shield, Zap, Globe, Heart, Cpu, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';

const Features = () => {
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: '极速响应',
      description: '毫秒级响应速度，让AI工具使用如丝般顺滑',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: '安全可靠',
      description: '企业级安全保障，保护您的数据隐私和使用安全',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: '全球覆盖',
      description: '多地区CDN加速，全球用户均可享受高速稳定服务',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Cpu className="h-8 w-8" />,
      title: '智能算法',
      description: '基于最新AI模型，持续优化算法提升服务质量',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: '用户友好',
      description: '简洁直观的界面设计，让每个人都能轻松上手',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: '持续创新',
      description: '定期更新功能，不断引入最前沿的AI技术',
      color: 'from-indigo-500 to-purple-500',
    },
  ];

  return (
    <section id="features" className="py-20 relative">
      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-48 h-48 bg-blue-100/30 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-100/30 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 glass-button">
            核心优势
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            为什么选择
            <span className="text-gradient"> AI Push</span>
          </h2>
          <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
            我们致力于为用户提供最优质的AI工具体验，从技术到服务，每个细节都经过精心打磨
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/80 backdrop-blur-sm border border-white/60 p-8 rounded-2xl hover-lift transition-all duration-500 shadow-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 shimmer-effect group-hover:scale-110 transition-transform duration-300`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="mt-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <div className="w-full h-1 bg-gradient-to-r from-blue-400/50 to-purple-400/50 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="bg-white/70 backdrop-blur-sm border border-white/60 p-12 rounded-3xl max-w-4xl mx-auto shadow-sm">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Sparkles className="h-12 w-12 text-white animate-bounce-gentle" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gradient mb-6">
              准备好体验AI的强大力量了吗？
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              加入我们的AI工具生态，让智能技术为您的工作和生活带来全新的可能性。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                立即开始使用
              </button>
              <button className="px-8 py-4 bg-white/60 border border-white/60 backdrop-blur-sm font-semibold rounded-xl hover:bg-white/80 transition-all">
                联系我们
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;