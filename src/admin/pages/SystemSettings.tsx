import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Save,
  RefreshCw,
  Database,
  Shield,
  Bell,
  Palette,
  Globe,
  Mail,
  Lock,
  Key,
  Users,
  Server,
  HardDrive,
  Monitor,
  Smartphone,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    siteUrl: string;
    language: string;
    timezone: string;
    dateFormat: string;
    maintenanceMode: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
    enableIpBlocking: boolean;
    allowedIps: string[];
  };
  email: {
    smtpEnabled: boolean;
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    smtpSecurity: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    smsNotifications: boolean;
    adminAlerts: boolean;
  };
  appearance: {
    theme: string;
    primaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
  };
  performance: {
    cacheEnabled: boolean;
    cacheExpiry: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    cdnUrl: string;
  };
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'AI Push',
      siteDescription: 'AI工具导航平台',
      siteUrl: 'https://aipush.fun',
      language: 'zh-CN',
      timezone: 'Asia/Shanghai',
      dateFormat: 'YYYY-MM-DD',
      maintenanceMode: false,
    },
    security: {
      enableTwoFactor: false,
      passwordMinLength: 8,
      sessionTimeout: 3600,
      maxLoginAttempts: 5,
      enableIpBlocking: false,
      allowedIps: [],
    },
    email: {
      smtpEnabled: false,
      smtpHost: '',
      smtpPort: 587,
      smtpUsername: '',
      smtpPassword: '',
      smtpSecurity: 'STARTTLS',
      fromEmail: 'noreply@aipush.fun',
      fromName: 'AI Push',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      smsNotifications: false,
      adminAlerts: true,
    },
    appearance: {
      theme: 'light',
      primaryColor: '#3b82f6',
      logoUrl: '',
      faviconUrl: '',
      customCss: '',
    },
    performance: {
      cacheEnabled: true,
      cacheExpiry: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      cdnUrl: '',
    },
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      // 在实际应用中，这里应该从API加载设置
      // const response = await fetch('/api/admin/settings');
      // const data = await response.json();
      // setSettings(data);
      
      // 模拟加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      toast({
        title: '加载失败',
        description: '无法加载系统设置',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // 在实际应用中，这里应该调用API保存设置
      // await fetch('/api/admin/settings', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(settings)
      // });
      
      // 模拟保存延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: '保存成功',
        description: '系统设置已更新'
      });
    } catch (error) {
      toast({
        title: '保存失败',
        description: '保存设置时发生错误',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSettings = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleBackupData = async () => {
    try {
      // 模拟备份操作
      const backupData = {
        settings,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      };
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aipush-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: '备份成功',
        description: '系统数据已导出'
      });
      setShowBackupDialog(false);
    } catch (error) {
      toast({
        title: '备份失败',
        description: '导出数据时发生错误',
        variant: 'destructive'
      });
    }
  };

  const testEmailConnection = async () => {
    try {
      // 模拟邮件连接测试
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast({
        title: '连接成功',
        description: 'SMTP服务器连接正常'
      });
    } catch (error) {
      toast({
        title: '连接失败',
        description: 'SMTP服务器连接失败',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">系统设置</h1>
          <p className="text-gray-600 mt-2">配置系统参数和功能设置</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadSettings}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
          <Button
            onClick={saveSettings}
            disabled={saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">基本设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="email">邮件设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
          <TabsTrigger value="appearance">外观设置</TabsTrigger>
          <TabsTrigger value="system">系统维护</TabsTrigger>
        </TabsList>

        {/* 基本设置 */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                基本设置
              </CardTitle>
              <CardDescription>配置网站基本信息</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">网站名称</Label>
                  <Input
                    id="siteName"
                    value={settings.general.siteName}
                    onChange={(e) => updateSettings('general', 'siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">网站地址</Label>
                  <Input
                    id="siteUrl"
                    value={settings.general.siteUrl}
                    onChange={(e) => updateSettings('general', 'siteUrl', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">网站描述</Label>
                <Input
                  id="siteDescription"
                  value={settings.general.siteDescription}
                  onChange={(e) => updateSettings('general', 'siteDescription', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>语言</Label>
                  <Select
                    value={settings.general.language}
                    onValueChange={(value) => updateSettings('general', 'language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zh-CN">中文（简体）</SelectItem>
                      <SelectItem value="zh-TW">中文（繁体）</SelectItem>
                      <SelectItem value="en-US">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>时区</Label>
                  <Select
                    value={settings.general.timezone}
                    onValueChange={(value) => updateSettings('general', 'timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Shanghai">上海</SelectItem>
                      <SelectItem value="Asia/Hong_Kong">香港</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>日期格式</Label>
                  <Select
                    value={settings.general.dateFormat}
                    onValueChange={(value) => updateSettings('general', 'dateFormat', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YYYY-MM-DD">2024-01-01</SelectItem>
                      <SelectItem value="MM/DD/YYYY">01/01/2024</SelectItem>
                      <SelectItem value="DD/MM/YYYY">01/01/2024</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>维护模式</Label>
                  <p className="text-sm text-gray-600">启用后网站将显示维护页面</p>
                </div>
                <Switch
                  checked={settings.general.maintenanceMode}
                  onCheckedChange={(checked) => updateSettings('general', 'maintenanceMode', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                安全设置
              </CardTitle>
              <CardDescription>配置系统安全参数</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>双因子认证</Label>
                  <p className="text-sm text-gray-600">为管理员账户启用双因子认证</p>
                </div>
                <Switch
                  checked={settings.security.enableTwoFactor}
                  onCheckedChange={(checked) => updateSettings('security', 'enableTwoFactor', checked)}
                />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>最小密码长度</Label>
                  <Input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => updateSettings('security', 'passwordMinLength', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>会话超时（秒）</Label>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => updateSettings('security', 'sessionTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>最大登录尝试次数</Label>
                <Input
                  type="number"
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => updateSettings('security', 'maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>IP地址限制</Label>
                  <p className="text-sm text-gray-600">限制只有指定IP可以访问管理后台</p>
                </div>
                <Switch
                  checked={settings.security.enableIpBlocking}
                  onCheckedChange={(checked) => updateSettings('security', 'enableIpBlocking', checked)}
                />
              </div>

              {settings.security.enableIpBlocking && (
                <div className="space-y-2">
                  <Label>允许的IP地址</Label>
                  <Input
                    placeholder="192.168.1.1, 10.0.0.1"
                    value={settings.security.allowedIps.join(', ')}
                    onChange={(e) => updateSettings('security', 'allowedIps', e.target.value.split(',').map(ip => ip.trim()))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 邮件设置 */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                邮件设置
              </CardTitle>
              <CardDescription>配置SMTP邮件发送服务</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>启用SMTP</Label>
                  <p className="text-sm text-gray-600">启用邮件发送功能</p>
                </div>
                <Switch
                  checked={settings.email.smtpEnabled}
                  onCheckedChange={(checked) => updateSettings('email', 'smtpEnabled', checked)}
                />
              </div>

              {settings.email.smtpEnabled && (
                <>
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>SMTP主机</Label>
                      <Input
                        value={settings.email.smtpHost}
                        onChange={(e) => updateSettings('email', 'smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>SMTP端口</Label>
                      <Input
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => updateSettings('email', 'smtpPort', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>用户名</Label>
                      <Input
                        value={settings.email.smtpUsername}
                        onChange={(e) => updateSettings('email', 'smtpUsername', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>密码</Label>
                      <Input
                        type="password"
                        value={settings.email.smtpPassword}
                        onChange={(e) => updateSettings('email', 'smtpPassword', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>加密方式</Label>
                    <Select
                      value={settings.email.smtpSecurity}
                      onValueChange={(value) => updateSettings('email', 'smtpSecurity', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NONE">无</SelectItem>
                        <SelectItem value="STARTTLS">STARTTLS</SelectItem>
                        <SelectItem value="SSL">SSL/TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>发件人邮箱</Label>
                      <Input
                        value={settings.email.fromEmail}
                        onChange={(e) => updateSettings('email', 'fromEmail', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>发件人姓名</Label>
                      <Input
                        value={settings.email.fromName}
                        onChange={(e) => updateSettings('email', 'fromName', e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={testEmailConnection} variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    测试连接
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                通知设置
              </CardTitle>
              <CardDescription>配置系统通知方式</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>邮件通知</Label>
                    <p className="text-sm text-gray-600">通过邮件发送重要通知</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>推送通知</Label>
                    <p className="text-sm text-gray-600">浏览器推送通知</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'pushNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>短信通知</Label>
                    <p className="text-sm text-gray-600">重要事件短信提醒</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => updateSettings('notifications', 'smsNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>管理员警报</Label>
                    <p className="text-sm text-gray-600">系统错误和安全警报</p>
                  </div>
                  <Switch
                    checked={settings.notifications.adminAlerts}
                    onCheckedChange={(checked) => updateSettings('notifications', 'adminAlerts', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 外观设置 */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="h-5 w-5 mr-2" />
                外观设置
              </CardTitle>
              <CardDescription>自定义网站外观</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>主题</Label>
                <Select
                  value={settings.appearance.theme}
                  onValueChange={(value) => updateSettings('appearance', 'theme', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">浅色</SelectItem>
                    <SelectItem value="dark">深色</SelectItem>
                    <SelectItem value="auto">跟随系统</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>主色调</Label>
                <Input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => updateSettings('appearance', 'primaryColor', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input
                  value={settings.appearance.logoUrl}
                  onChange={(e) => updateSettings('appearance', 'logoUrl', e.target.value)}
                  placeholder="https://example.com/logo.png"
                />
              </div>

              <div className="space-y-2">
                <Label>网站图标 URL</Label>
                <Input
                  value={settings.appearance.faviconUrl}
                  onChange={(e) => updateSettings('appearance', 'faviconUrl', e.target.value)}
                  placeholder="https://example.com/favicon.ico"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 系统维护 */}
        <TabsContent value="system">
          <div className="space-y-6">
            {/* 性能设置 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="h-5 w-5 mr-2" />
                  性能设置
                </CardTitle>
                <CardDescription>优化系统性能</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>启用缓存</Label>
                    <p className="text-sm text-gray-600">提升页面加载速度</p>
                  </div>
                  <Switch
                    checked={settings.performance.cacheEnabled}
                    onCheckedChange={(checked) => updateSettings('performance', 'cacheEnabled', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>启用压缩</Label>
                    <p className="text-sm text-gray-600">压缩静态资源</p>
                  </div>
                  <Switch
                    checked={settings.performance.compressionEnabled}
                    onCheckedChange={(checked) => updateSettings('performance', 'compressionEnabled', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 数据管理 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  数据管理
                </CardTitle>
                <CardDescription>备份和恢复数据</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">数据备份</h4>
                    <p className="text-sm text-gray-600">导出系统数据和设置</p>
                  </div>
                  <Button onClick={() => setShowBackupDialog(true)} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    创建备份
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">数据恢复</h4>
                    <p className="text-sm text-gray-600">从备份文件恢复数据</p>
                  </div>
                  <Button onClick={() => setShowRestoreDialog(true)} variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    恢复备份
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 危险操作 */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  危险操作
                </CardTitle>
                <CardDescription>谨慎操作，可能影响系统正常运行</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-red-600">清空缓存</h4>
                    <p className="text-sm text-gray-600">清空所有缓存数据</p>
                  </div>
                  <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4 mr-2" />
                    清空缓存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 备份确认对话框 */}
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>创建数据备份</DialogTitle>
            <DialogDescription>
              将创建包含所有系统数据和设置的备份文件
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              取消
            </Button>
            <Button onClick={handleBackupData}>
              创建备份
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 恢复确认对话框 */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>恢复数据备份</DialogTitle>
            <DialogDescription>
              选择备份文件来恢复系统数据。此操作将覆盖当前数据。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="file"
              accept=".json"
              className="cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              取消
            </Button>
            <Button variant="destructive">
              恢复备份
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SystemSettings;