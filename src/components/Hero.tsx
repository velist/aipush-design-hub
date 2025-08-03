import { ArrowRight, Zap, Star, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import heroBg from '@/assets/hero-bg.jpg';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 bg-primary/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: '2s' }}>
        <div className="w-24 h-24 bg-accent/20 rounded-full blur-xl"></div>
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: '4s' }}>
        <div className="w-20 h-20 bg-secondary/30 rounded-full blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 glass-card px-4 py-2 rounded-full mb-8 animate-scale-in">
          <Star className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">AI工具合集平台</span>
          <Sparkles className="h-4 w-4 text-primary" />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up">
          <span className="text-gradient">AI Push</span>
          <br />
          <span className="text-foreground">智能工具生态</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-foreground/70 mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          汇聚最前沿的AI工具，为您提供
          <span className="text-primary font-semibold"> 智能化 </span>
          的工作解决方案
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          {['实时AI新闻', '智能对话', '图像生成', '代码助手', '数据分析'].map((feature, index) => (
            <div key={feature} className="glass-card px-4 py-2 rounded-full hover-lift">
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button size="lg" className="accent-gradient text-white shadow-2xl hover:shadow-primary/25 transition-all duration-300 group">
            <Zap className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            立即体验
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" size="lg" className="glass-button">
            了解更多
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
          {[
            { number: '10+', label: '核心AI工具' },
            { number: '50K+', label: '活跃用户' },
            { number: '99.9%', label: '服务可用性' },
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 rounded-2xl hover-lift">
              <div className="text-3xl font-bold text-gradient mb-2">{stat.number}</div>
              <div className="text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full">
          <div className="w-1 h-3 bg-primary rounded-full mx-auto mt-2 animate-bounce-gentle"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;