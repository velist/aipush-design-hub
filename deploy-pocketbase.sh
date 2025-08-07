#!/bin/bash

# =============================================================================
# AI Push - PocketBase 一键部署脚本
# 域名: aipush.fun
# 作者: Claude AI
# =============================================================================

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置变量
DOMAIN="aipush.fun"
API_SUBDOMAIN="api.aipush.fun"
POCKETBASE_VERSION="0.22.0"
INSTALL_DIR="/opt/aipush"
SERVICE_NAME="aipush-pocketbase"
NGINX_CONF="/etc/nginx/sites-available/aipush"

# 打印带颜色的消息
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

print_header() {
    echo -e "${GREEN}"
    echo "=================================================="
    echo "       AI Push PocketBase 一键部署工具"
    echo "=================================================="
    echo -e "${NC}"
}

# 检查是否为root用户
check_root() {
    if [ "$EUID" -ne 0 ]; then
        print_error "请使用 sudo 权限运行此脚本"
    fi
}

# 检查系统类型
check_system() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
        VER=$VERSION_ID
    else
        print_error "无法确定操作系统类型"
    fi
    
    print_status "检测到系统: $OS $VER"
}

# 安装依赖
install_dependencies() {
    print_status "安装系统依赖..."
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        apt update
        apt install -y nginx certbot python3-certbot-nginx wget unzip curl jq
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        yum update -y
        yum install -y nginx certbot python3-certbot-nginx wget unzip curl jq
    else
        print_error "不支持的操作系统: $OS"
    fi
    
    print_success "依赖安装完成"
}

# 下载并安装 PocketBase
install_pocketbase() {
    print_status "下载 PocketBase v$POCKETBASE_VERSION..."
    
    # 创建安装目录
    mkdir -p $INSTALL_DIR
    cd $INSTALL_DIR
    
    # 检测系统架构
    ARCH=$(uname -m)
    case $ARCH in
        x86_64)
            ARCH="amd64"
            ;;
        aarch64)
            ARCH="arm64"
            ;;
        *)
            print_error "不支持的系统架构: $ARCH"
            ;;
    esac
    
    # 下载PocketBase
    DOWNLOAD_URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/pocketbase_${POCKETBASE_VERSION}_linux_${ARCH}.zip"
    
    wget -q --show-progress "$DOWNLOAD_URL" -O pocketbase.zip
    
    if [ $? -ne 0 ]; then
        print_error "下载 PocketBase 失败"
    fi
    
    # 解压并设置权限
    unzip -o pocketbase.zip
    chmod +x pocketbase
    rm pocketbase.zip
    
    print_success "PocketBase 安装完成"
}

# 创建数据目录和配置
setup_pocketbase() {
    print_status "配置 PocketBase..."
    
    # 创建数据目录
    mkdir -p $INSTALL_DIR/pb_data
    mkdir -p $INSTALL_DIR/pb_public
    
    # 创建配置文件
    cat > $INSTALL_DIR/config.json << EOL
{
    "debug": false,
    "httpAddr": "127.0.0.1:8080",
    "httpsAddr": "",
    "dataDir": "./pb_data",
    "encryptionEnv": "PB_ENCRYPTION_KEY",
    "hideStartBanner": false,
    "maxBodySize": 134217728
}
EOL

    # 创建环境变量文件
    cat > $INSTALL_DIR/.env << EOL
PB_ENCRYPTION_KEY=$(openssl rand -hex 32)
DOMAIN=$DOMAIN
API_DOMAIN=$API_SUBDOMAIN
EOL

    # 设置权限
    chmod 600 $INSTALL_DIR/.env
    chown -R www-data:www-data $INSTALL_DIR
    
    print_success "PocketBase 配置完成"
}

# 创建系统服务
create_service() {
    print_status "创建 systemd 服务..."
    
    cat > /etc/systemd/system/$SERVICE_NAME.service << EOL
[Unit]
Description=AI Push PocketBase Service
Documentation=https://pocketbase.io/docs/
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$INSTALL_DIR
ExecStart=$INSTALL_DIR/pocketbase serve --config=$INSTALL_DIR/config.json
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=$SERVICE_NAME
KillMode=mixed
KillSignal=SIGINT

# 环境变量
Environment=PB_ENCRYPTION_KEY_FILE=$INSTALL_DIR/.env

[Install]
WantedBy=multi-user.target
EOL

    # 重新加载systemd并启用服务
    systemctl daemon-reload
    systemctl enable $SERVICE_NAME
    
    print_success "系统服务创建完成"
}

# 配置 Nginx
configure_nginx() {
    print_status "配置 Nginx 反向代理..."
    
    cat > $NGINX_CONF << EOL
# AI Push 前端 (aipush.fun)
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;
    
    # GitHub Pages 反向代理
    location / {
        proxy_pass https://velist.github.io/aipush-design-hub/;
        proxy_set_header Host velist.github.io;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 处理 GitHub Pages 重定向
        proxy_redirect https://velist.github.io/aipush-design-hub/ https://$DOMAIN/;
        
        # 缓存静态资源
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # 健康检查
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}

# AI Push API (api.aipush.fun)  
server {
    listen 80;
    listen [::]:80;
    server_name $API_SUBDOMAIN;
    
    # PocketBase API
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # CORS 配置
        add_header Access-Control-Allow-Origin "https://$DOMAIN" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;
        
        if (\$request_method = 'OPTIONS') {
            return 204;
        }
    }
    
    # PocketBase 管理面板
    location /_/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # 限制访问（可选，只允许特定IP访问管理面板）
        # allow 你的IP地址;
        # deny all;
    }
}
EOL

    # 创建软链接并测试配置
    ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    
    nginx -t
    if [ $? -ne 0 ]; then
        print_error "Nginx 配置测试失败"
    fi
    
    print_success "Nginx 配置完成"
}

# 申请SSL证书
setup_ssl() {
    print_status "申请 SSL 证书..."
    
    # 启动 Nginx
    systemctl restart nginx
    
    # 申请证书
    certbot --nginx --non-interactive --agree-tos --email admin@$DOMAIN \
            -d $DOMAIN -d www.$DOMAIN -d $API_SUBDOMAIN
    
    if [ $? -eq 0 ]; then
        print_success "SSL 证书申请成功"
        
        # 设置自动续期
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
        print_success "SSL 证书自动续期已配置"
    else
        print_warning "SSL 证书申请失败，将使用 HTTP"
    fi
}

# 启动服务
start_services() {
    print_status "启动服务..."
    
    # 启动 PocketBase
    systemctl start $SERVICE_NAME
    systemctl restart nginx
    
    # 等待服务启动
    sleep 5
    
    # 检查服务状态
    if systemctl is-active --quiet $SERVICE_NAME; then
        print_success "PocketBase 服务启动成功"
    else
        print_error "PocketBase 服务启动失败"
    fi
    
    if systemctl is-active --quiet nginx; then
        print_success "Nginx 服务运行正常"
    else
        print_error "Nginx 服务启动失败"
    fi
}

# 初始化数据库
init_database() {
    print_status "初始化数据库..."
    
    # 等待 PocketBase 完全启动
    sleep 10
    
    # 创建管理员账户 (需要手动设置)
    print_warning "请访问 https://$API_SUBDOMAIN/_/ 设置管理员账户"
    
    # TODO: 可以通过API自动创建集合和管理员
    # 这里先提供手动步骤说明
    
    cat > $INSTALL_DIR/collections.json << 'EOL'
{
  "collections": [
    {
      "name": "users",
      "type": "auth",
      "system": false,
      "schema": [
        {
          "name": "username",
          "type": "text",
          "required": false,
          "unique": true
        },
        {
          "name": "avatar",
          "type": "file",
          "required": false,
          "options": {
            "maxSelect": 1,
            "maxSize": 5242880,
            "mimeTypes": ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
          }
        },
        {
          "name": "subscription_type", 
          "type": "select",
          "required": true,
          "options": {
            "values": ["free", "premium", "enterprise"],
            "maxSelect": 1
          }
        },
        {
          "name": "subscription_expires",
          "type": "date",
          "required": false
        },
        {
          "name": "credits",
          "type": "number",
          "required": false
        },
        {
          "name": "referral_code",
          "type": "text",
          "required": false,
          "unique": true
        }
      ]
    },
    {
      "name": "activation_codes",
      "type": "base",
      "system": false,
      "schema": [
        {
          "name": "code",
          "type": "text",
          "required": true,
          "unique": true
        },
        {
          "name": "type",
          "type": "select",
          "required": true,
          "options": {
            "values": ["premium_month", "premium_year", "credits"],
            "maxSelect": 1
          }
        },
        {
          "name": "value",
          "type": "number",
          "required": true
        },
        {
          "name": "used",
          "type": "bool",
          "required": true
        },
        {
          "name": "used_by",
          "type": "relation",
          "required": false,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": false
          }
        },
        {
          "name": "used_at",
          "type": "date",
          "required": false
        },
        {
          "name": "expires_at",
          "type": "date",
          "required": false
        }
      ]
    },
    {
      "name": "favorites",
      "type": "base", 
      "system": false,
      "schema": [
        {
          "name": "user",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true
          }
        },
        {
          "name": "tool_id",
          "type": "text",
          "required": true
        },
        {
          "name": "tool_name",
          "type": "text",
          "required": true
        },
        {
          "name": "tool_url",
          "type": "url",
          "required": true
        },
        {
          "name": "tool_description",
          "type": "text",
          "required": false
        },
        {
          "name": "tool_category",
          "type": "text",
          "required": false
        }
      ]
    },
    {
      "name": "user_activities",
      "type": "base",
      "system": false,
      "schema": [
        {
          "name": "user",
          "type": "relation",
          "required": true,
          "options": {
            "collectionId": "_pb_users_auth_",
            "cascadeDelete": true
          }
        },
        {
          "name": "activity_type",
          "type": "select",
          "required": true,
          "options": {
            "values": ["visit", "favorite", "unfavorite", "search"],
            "maxSelect": 1
          }
        },
        {
          "name": "tool_id",
          "type": "text",
          "required": false
        },
        {
          "name": "metadata",
          "type": "json",
          "required": false
        }
      ]
    }
  ]
}
EOL
    
    print_success "数据库配置文件已创建: $INSTALL_DIR/collections.json"
}

# 创建防火墙规则
configure_firewall() {
    print_status "配置防火墙..."
    
    if command -v ufw >/dev/null 2>&1; then
        ufw --force enable
        ufw allow 22
        ufw allow 80
        ufw allow 443
        print_success "UFW 防火墙配置完成"
    elif command -v firewall-cmd >/dev/null 2>&1; then
        firewall-cmd --permanent --add-service=ssh
        firewall-cmd --permanent --add-service=http
        firewall-cmd --permanent --add-service=https
        firewall-cmd --reload
        print_success "Firewall 配置完成"
    else
        print_warning "未检测到防火墙，请手动开放 80 和 443 端口"
    fi
}

# 显示部署信息
show_deployment_info() {
    print_success "部署完成！"
    echo
    echo -e "${GREEN}==================== 部署信息 ====================${NC}"
    echo -e "前端地址:     ${BLUE}https://$DOMAIN${NC}"
    echo -e "API地址:      ${BLUE}https://$API_SUBDOMAIN${NC}"  
    echo -e "管理面板:     ${BLUE}https://$API_SUBDOMAIN/_/${NC}"
    echo -e "服务状态:     ${GREEN}$(systemctl is-active $SERVICE_NAME)${NC}"
    echo
    echo -e "${YELLOW}==================== 后续步骤 ====================${NC}"
    echo "1. 访问管理面板设置管理员账户"
    echo "2. 导入数据库集合配置: $INSTALL_DIR/collections.json"
    echo "3. 更新前端项目的 API 地址为: https://$API_SUBDOMAIN"
    echo
    echo -e "${YELLOW}==================== 有用命令 ====================${NC}"
    echo "查看服务状态:   systemctl status $SERVICE_NAME"
    echo "查看服务日志:   journalctl -fu $SERVICE_NAME"
    echo "重启服务:       systemctl restart $SERVICE_NAME"
    echo "更新SSL证书:    certbot renew"
    echo
    print_warning "请保存好管理员密码和访问密钥！"
}

# 主函数
main() {
    print_header
    
    # 检查运行环境
    check_root
    check_system
    
    # 询问用户确认
    read -p "即将部署到域名 $DOMAIN，是否继续？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "部署已取消"
    fi
    
    print_status "开始部署 AI Push PocketBase 服务..."
    
    # 执行部署步骤
    install_dependencies
    install_pocketbase
    setup_pocketbase
    create_service
    configure_nginx
    configure_firewall
    start_services
    setup_ssl
    init_database
    
    # 显示部署结果
    show_deployment_info
}

# 错误处理
trap 'print_error "部署过程中发生错误，请检查日志"' ERR

# 运行主函数
main "$@"