import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '@/admin/services/authService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

const ProtectedRoute = ({ children, requiredPermission }: ProtectedRouteProps) => {
  const location = useLocation();
  const isAuthenticated = authService.isAuthenticated();
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    // 如果用户已登录，刷新token延长过期时间
    if (isAuthenticated) {
      authService.refreshToken();
    }
  }, [isAuthenticated]);

  // 用户未登录，重定向到登录页面
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // 检查特定权限
  if (requiredPermission && !authService.hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">访问被拒绝</h2>
          <p className="text-gray-600 mb-4">
            您没有访问此页面的权限。请联系管理员获取相应权限。
          </p>
          <div className="text-sm text-gray-500">
            <p>当前用户：{currentUser?.username}</p>
            <p>用户角色：{currentUser?.role}</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;