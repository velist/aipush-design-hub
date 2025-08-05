import { Github, Twitter, Mail, Heart, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    '产品': [
      { name: 'AI新闻推送', href: 'https://news.aipush.fun/' },
      { name: 'AI对话助手', href: '#' },
      { name: 'AI图像生成', href: '#' },
      { name: '更多工具', href: '#tools' },
    ],
    '公司': [
      { name: '关于我们', href: '#about' },
      { name: '联系我们', href: '#contact' },
      { name: '隐私政策', href: '#privacy' },
      { name: '服务条款', href: '#terms' },
    ],
    '资源': [
      { name: '帮助中心', href: '#help' },
      { name: 'API文档', href: '#api' },
      { name: '开发者指南', href: '#dev' },
      { name: '更新日志', href: '#changelog' },
    ],
  };

  const socialLinks = [
    { name: 'Github', icon: <Github className="h-5 w-5" />, href: '#' },
    { name: 'Twitter', icon: <Twitter className="h-5 w-5" />, href: '#' },
    { name: 'Email', icon: <Mail className="h-5 w-5" />, href: 'mailto:contact@aipush.fun' },
  ];

  return (
    <footer className="relative pt-20 pb-8">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative">
                <Sparkles className="h-8 w-8 text-primary animate-bounce-gentle" />
                <div className="absolute inset-0 animate-glow-pulse rounded-full"></div>
              </div>
              <span className="text-2xl font-bold text-gradient">AI Push</span>
            </div>
            <p className="text-foreground/70 mb-6 leading-relaxed max-w-md">
              致力于为用户提供最前沿的AI工具解决方案，让人工智能技术真正服务于每个人的工作和生活。
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="glass-button p-3 rounded-lg hover:text-primary transition-colors group"
                  aria-label={social.name}
                >
                  <div className="group-hover:scale-110 transition-transform">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-gradient">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-foreground/70 hover:text-primary transition-colors duration-200 relative group"
                    >
                      {link.name}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="glass-card p-8 rounded-2xl mb-12">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gradient mb-4">
              订阅我们的更新
            </h3>
            <p className="text-foreground/70 mb-6">
              第一时间获取新工具发布、功能更新和AI行业资讯
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="输入您的邮箱地址"
                className="flex-1 px-4 py-3 rounded-lg glass-card border border-white/20 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300">
                订阅
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-foreground/60">
              <span>© {currentYear} AI Push. </span>
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current animate-bounce-gentle" />
              <span>for the AI community</span>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-foreground/60 hover:text-primary transition-colors">
                隐私政策
              </a>
              <a href="#terms" className="text-foreground/60 hover:text-primary transition-colors">
                服务条款
              </a>
              <a href="#contact" className="text-foreground/60 hover:text-primary transition-colors">
                联系我们
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;