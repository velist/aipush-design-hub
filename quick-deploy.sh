#!/bin/bash

# =============================================================================
# AI Push - 简易部署配置
# 使用Railway.app一键部署PocketBase
# =============================================================================

print_header() {
    echo "=================================================="
    echo "       AI Push PocketBase Railway部署"
    echo "=================================================="
}

print_header

echo "🚀 部署选项："
echo
echo "1. Railway.app 一键部署 (推荐新手)"
echo "   - 免费$5月额度"
echo "   - 自动SSL证书"
echo "   - GitHub集成"
echo
echo "2. 自有服务器部署"
echo "   - 更多控制权"
echo "   - 需要服务器管理经验"
echo

read -p "请选择部署方式 (1/2): " choice

case $choice in
    1)
        echo
        echo "📋 Railway部署步骤："
        echo
        echo "1. 访问: https://railway.app"
        echo "2. 登录GitHub账号"
        echo "3. 点击 'New Project'"
        echo "4. 选择 'Deploy from GitHub repo'"
        echo "5. 选择这个项目: aipush-design-hub"
        echo "6. 设置环境变量:"
        echo "   DOMAIN=aipush.fun"
        echo "   PORT=8080"
        echo "7. 点击Deploy"
        echo
        echo "🔧 完成后配置："
        echo "1. 获取Railway提供的域名"
        echo "2. 配置您的域名CNAME记录指向Railway域名"
        echo "3. 访问管理面板设置管理员账户"
        echo
        ;;
    2)
        echo
        echo "📋 服务器部署步骤："
        echo
        echo "1. 确保有Ubuntu/Debian/CentOS服务器"
        echo "2. 配置域名DNS指向服务器IP："
        echo "   aipush.fun -> 您的服务器IP"
        echo "   api.aipush.fun -> 您的服务器IP"
        echo "3. 在服务器上运行："
        echo "   wget https://raw.githubusercontent.com/velist/aipush-design-hub/main/deploy-pocketbase.sh"
        echo "   chmod +x deploy-pocketbase.sh"
        echo "   sudo ./deploy-pocketbase.sh"
        echo
        echo "💡 或者使用Docker部署："
        echo "   git clone https://github.com/velist/aipush-design-hub.git"
        echo "   cd aipush-design-hub"
        echo "   docker-compose up -d"
        echo
        ;;
    *)
        echo "无效选择，请重新运行脚本"
        exit 1
        ;;
esac

echo "📚 部署后步骤："
echo
echo "1. 访问管理面板: https://api.aipush.fun/_/"
echo "2. 创建管理员账户"
echo "3. 导入数据库集合配置"
echo "4. 更新前端环境变量"
echo "5. 测试用户注册登录功能"
echo
echo "📞 需要帮助？"
echo "- 查看文档: DEPLOY_GUIDE.md" 
echo "- GitHub Issues: https://github.com/velist/aipush-design-hub/issues"
echo
echo "🎉 感谢使用AI Push！"