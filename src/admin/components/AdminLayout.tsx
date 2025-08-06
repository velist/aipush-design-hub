import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  LayoutDashboard,
  Wrench,
  BarChart3,
  Settings,
  Users,
  FileText,
  Menu,
  X,
  LogOut,
  Home,
  Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/admin/services/authService';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const menuItems = [
    {
      name: '仪表板',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      count: null,
      permission: null
    },
    {
      name: '工具管理',
      href: '/admin/tools',
      icon: Wrench,
      count: null,
      permission: 'tools:read'
    },
    {
      name: '数据统计',
      href: '/admin/analytics',
      icon: BarChart3,
      count: null,
      permission: 'analytics:read'
    },
    {
      name: '内容管理',
      href: '/admin/content',
      icon: FileText,
      count: null,
      permission: 'content:read'
    },
    {
      name: '用户管理',
      href: '/admin/users',
      icon: Users,
      count: null,
      permission: 'users:read'
    },
    {
      name: '系统设置',
      href: '/admin/settings',
      icon: Settings,
      count: null,
      permission: 'settings:read'
    }
  ];

  // 根据权限过滤菜单项
  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || authService.hasPermission(item.permission)
  );

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900">AI Push</h2>
            <p className="text-xs text-gray-500">管理后台</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.href);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </div>
              {item.count && (
                <Badge variant="secondary" className="text-xs">
                  {item.count}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => navigate('/')}
        >
          <Home className="h-4 w-4 mr-2" />
          返回前台
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {filteredMenuItems.find(item => item.href === location.pathname)?.name || '管理后台'}
                </h1>
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    weekday: 'long'
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {currentUser?.username?.charAt(0).toUpperCase() || '管'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {currentUser?.username || '管理员'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.email || 'admin@aipush.fun'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {currentUser?.role === 'admin' ? '管理员' : 
                         currentUser?.role === 'editor' ? '编辑员' : '查看员'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authService.hasPermission('settings:read') && (
                    <DropdownMenuItem onClick={() => navigate('/admin/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      系统设置
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => navigate('/')}>
                    <Home className="mr-2 h-4 w-4" />
                    返回前台
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;