import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Settings, 
  Heart, 
  Activity,
  Bell,
  Shield,
  Eye,
  EyeOff,
  Save,
  Edit,
  Mail,
  Calendar,
  MapPin,
  Globe,
  Star,
  Clock,
  ArrowLeft,
  Loader2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { userAuthService, type UserProfile, type FavoriteTool, type UserActivity } from '@/services/userAuthService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<FavoriteTool[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      const [profileData, favoritesData, activitiesData] = await Promise.all([
        userAuthService.getUserProfile(user.id),
        userAuthService.getUserFavorites(user.id),
        userAuthService.getUserActivities(user.id, 20)
      ]);

      setProfile(profileData);
      setFavorites(favoritesData);
      setActivities(activitiesData);
    } catch (error) {
      console.error('加载用户数据失败:', error);
      toast({
        title: '加载失败',
        description: '无法加载用户数据，请刷新页面重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;

    setSaving(true);
    try {
      const result = await userAuthService.updateUserProfile(user.id, updates);
      
      if (result.success) {
        setProfile({ ...profile, ...updates });
        toast({
          title: '保存成功',
          description: '您的资料已更新'
        });
      } else {
        toast({
          title: '保存失败',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '保存失败',
        description: '更新资料时发生错误',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavorite = async (toolId: string) => {
    if (!user) return;

    try {
      const result = await userAuthService.removeFavorite(user.id, toolId);
      
      if (result.success) {
        setFavorites(favorites.filter(fav => fav.tool_id !== toolId));
        toast({
          title: '移除成功',
          description: '已从收藏中移除'
        });
      } else {
        toast({
          title: '移除失败',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '移除失败',
        description: '移除收藏时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: '密码不匹配',
        description: '新密码和确认密码不一致',
        variant: 'destructive'
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: '密码过短',
        description: '新密码至少需要6位字符',
        variant: 'destructive'
      });
      return;
    }

    try {
      const result = await userAuthService.updatePassword(passwordData.newPassword);
      
      if (result.success) {
        setShowPasswordDialog(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        toast({
          title: '密码更新成功',
          description: '您的密码已更新'
        });
      } else {
        toast({
          title: '密码更新失败',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '密码更新失败',
        description: '更新密码时发生错误',
        variant: 'destructive'
      });
    }
  };

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      navigate('/');
    } else {
      toast({
        title: '退出失败',
        description: result.error,
        variant: 'destructive'
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return <Eye className="h-4 w-4" />;
      case 'favorite': return <Heart className="h-4 w-4 text-red-500" />;
      case 'unfavorite': return <Heart className="h-4 w-4" />;
      case 'search': return <Activity className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityText = (activity: UserActivity) => {
    switch (activity.activity_type) {
      case 'visit': return '访问了工具';
      case 'favorite': return '收藏了工具';
      case 'unfavorite': return '取消收藏工具';
      case 'search': return '搜索了';
      default: return '进行了操作';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回首页
            </Button>
            <h1 className="text-xl font-semibold">个人中心</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            退出登录
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 用户信息卡片 */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="text-lg">
                  {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">
                  {user.user_metadata?.full_name || profile?.username || '用户'}
                </h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <Mail className="h-4 w-4 mr-2" />
                  {user.email}
                </p>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    加入时间: {formatDate(user.created_at)}
                  </span>
                  <Badge variant="outline">
                    {user.app_metadata?.provider || 'email'} 用户
                  </Badge>
                </div>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{favorites.length}</div>
                <div className="text-sm text-gray-600">收藏工具</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activities.length}</div>
                <div className="text-sm text-gray-600">活动记录</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {activities.filter(a => a.activity_type === 'visit').length}
                </div>
                <div className="text-sm text-gray-600">工具访问</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 主要内容区域 */}
        <Tabs defaultValue="favorites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="favorites">我的收藏</TabsTrigger>
            <TabsTrigger value="activity">活动记录</TabsTrigger>
            <TabsTrigger value="profile">个人资料</TabsTrigger>
            <TabsTrigger value="settings">账户设置</TabsTrigger>
          </TabsList>

          {/* 我的收藏 */}
          <TabsContent value="favorites">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  我的收藏 ({favorites.length})
                </CardTitle>
                <CardDescription>您收藏的AI工具</CardDescription>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="space-y-4">
                    {favorites.map((favorite) => (
                      <div key={favorite.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{favorite.tool_name}</h3>
                            {favorite.tool_category && (
                              <Badge variant="outline">{favorite.tool_category}</Badge>
                            )}
                          </div>
                          {favorite.tool_description && (
                            <p className="text-gray-600 text-sm mb-2">{favorite.tool_description}</p>
                          )}
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              收藏于 {formatDate(favorite.created_at)}
                            </span>
                            <a 
                              href={favorite.tool_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-blue-600 hover:text-blue-800"
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              访问工具
                            </a>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFavorite(favorite.tool_id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>您还没有收藏任何工具</p>
                    <p className="text-sm">浏览工具页面并点击收藏按钮来添加您喜欢的工具</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 活动记录 */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  活动记录
                </CardTitle>
                <CardDescription>您的最近活动</CardDescription>
              </CardHeader>
              <CardContent>
                {activities.length > 0 ? (
                  <div className="space-y-3">
                    {activities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                        <div className="flex-shrink-0">
                          {getActivityIcon(activity.activity_type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">
                            {getActivityText(activity)}
                            {activity.tool_id && (
                              <span className="font-medium"> {activity.tool_id}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>暂无活动记录</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 个人资料 */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  个人资料
                </CardTitle>
                <CardDescription>管理您的个人信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>用户名</Label>
                    <Input
                      value={profile?.username || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, username: e.target.value } : null)}
                      placeholder="设置您的用户名"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>邮箱地址</Label>
                    <Input value={user.email || ''} disabled />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>个人简介</Label>
                  <Input
                    value={profile?.bio || ''}
                    onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                    placeholder="介绍一下自己"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>网站</Label>
                    <Input
                      value={profile?.website || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, website: e.target.value } : null)}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>位置</Label>
                    <Input
                      value={profile?.location || ''}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                      placeholder="城市, 国家"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    onClick={() => handleUpdateProfile(profile!)}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        保存更改
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 账户设置 */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* 偏好设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    偏好设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>主题</Label>
                      <p className="text-sm text-gray-600">选择您偏好的界面主题</p>
                    </div>
                    <Select
                      value={profile?.preferences?.theme || 'auto'}
                      onValueChange={(value) => 
                        setProfile(prev => prev ? {
                          ...prev,
                          preferences: { ...prev.preferences, theme: value as 'light' | 'dark' | 'auto' }
                        } : null)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">浅色</SelectItem>
                        <SelectItem value="dark">深色</SelectItem>
                        <SelectItem value="auto">跟随系统</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>通知</Label>
                      <p className="text-sm text-gray-600">接收系统通知和更新</p>
                    </div>
                    <Switch
                      checked={profile?.preferences?.notifications || true}
                      onCheckedChange={(checked) =>
                        setProfile(prev => prev ? {
                          ...prev,
                          preferences: { ...prev.preferences, notifications: checked }
                        } : null)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 安全设置 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    安全设置
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>修改密码</Label>
                      <p className="text-sm text-gray-600">定期更新密码以保护账户安全</p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowPasswordDialog(true)}
                    >
                      修改密码
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* 修改密码对话框 */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>修改密码</DialogTitle>
            <DialogDescription>
              请输入当前密码和新密码
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>当前密码</Label>
              <div className="relative">
                <Input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>新密码</Label>
              <div className="relative">
                <Input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>确认新密码</Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              取消
            </Button>
            <Button onClick={handleChangePassword}>
              更新密码
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;