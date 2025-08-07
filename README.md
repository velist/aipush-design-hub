# 🚀 AI Push - AI工具导航平台

一个现代化的AI工具导航和管理平台，集成用户认证、工具收藏、付费订阅等功能。

## ✨ 特性

### 🎯 核心功能
- **工具导航** - 精选AI工具分类展示
- **用户系统** - 邮箱注册、OAuth登录（GitHub、Google）
- **收藏功能** - 收藏喜爱的AI工具
- **付费系统** - 激活码兑换、订阅管理
- **活动追踪** - 用户行为分析
- **管理后台** - 完整的管理界面

### 🛠 技术栈
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **UI组件**: shadcn/ui
- **后端**: PocketBase (开源BaaS)
- **部署**: GitHub Pages + 自托管API
- **数据库**: SQLite/PostgreSQL

## 📱 在线体验

- **网站首页**: https://velist.github.io/aipush-design-hub/
- **管理后台**: https://velist.github.io/aipush-design-hub/#/admin/login

### 管理员账号
- 用户名: `admin`
- 密码: `AiPush@2024!`

## 🚀 快速部署

### 方案一：Railway.app（推荐新手）

1. **Fork项目**
   ```bash
   git clone https://github.com/velist/aipush-design-hub.git
   cd aipush-design-hub
   ```

2. **一键部署**
   ```bash
   ./quick-deploy.sh
   # 选择选项 1: Railway.app部署
   ```

3. **配置域名**
   - 在Railway获取部署URL
   - 配置DNS: `api.aipush.fun` CNAME 到 Railway域名

### 方案二：Docker部署

1. **克隆项目**
   ```bash
   git clone https://github.com/velist/aipush-design-hub.git
   cd aipush-design-hub
   ```

2. **配置环境**
   ```bash
   cp .env.example .env
   # 编辑.env文件，配置域名等信息
   ```

3. **启动服务**
   ```bash
   docker-compose up -d
   ```

### 方案三：VPS一键部署

1. **配置域名DNS**
   ```
   aipush.fun        A记录 -> 服务器IP
   api.aipush.fun    A记录 -> 服务器IP
   ```

2. **执行部署脚本**
   ```bash
   wget https://raw.githubusercontent.com/velist/aipush-design-hub/main/deploy-pocketbase.sh
   chmod +x deploy-pocketbase.sh
   sudo ./deploy-pocketbase.sh
   ```

## 💰 付费功能

### 激活码系统
- **高级版月卡/年卡**: 升级用户订阅
- **积分充值卡**: 增加用户积分
- **灵活兑换**: 支持多种激活码类型

## 🔧 开发指南

### 本地开发
```bash
git clone https://github.com/velist/aipush-design-hub.git
cd aipush-design-hub
npm install
npm run dev
```

## 📄 许可证

本项目基于 MIT 许可证开源。

## 📞 支持

- **文档**: [部署指南](DEPLOY_GUIDE.md)
- **问题反馈**: [GitHub Issues](https://github.com/velist/aipush-design-hub/issues)

---

**⭐ 如果这个项目对您有帮助，请给个星标支持！**

© 2024 AI Push - 让AI工具触手可及
