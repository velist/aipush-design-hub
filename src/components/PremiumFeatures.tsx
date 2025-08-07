import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Gift, 
  Star, 
  Crown,
  Coins,
  Calendar,
  Clock,
  Check,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { usePBAuth } from '@/contexts/PBAuthContext';
import { useToast } from '@/hooks/use-toast';

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  badge?: string;
  popular?: boolean;
}

const PremiumFeatures = () => {
  const { user, redeemCode, checkPermission, refreshUser } = usePBAuth();
  const { toast } = useToast();
  
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);

  // 订阅计划
  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: '免费版',
      price: 0,
      period: '永久',
      features: [
        '访问基础AI工具',
        '每月10个积分',
        '基础客服支持',
        '工具收藏功能'
      ]
    },
    {
      id: 'premium',
      name: '高级版',
      price: 29,
      period: '月',
      badge: '推荐',
      popular: true,
      features: [
        '无限使用所有AI工具',
        '每月200个积分',
        '优先客服支持',
        '高级数据分析',
        '自定义工具配置',
        '无广告体验',
        '批量处理功能'
      ]
    },
    {
      id: 'enterprise',
      name: '企业版',
      price: 99,
      period: '月',
      badge: '企业',
      features: [
        '包含高级版所有功能',
        '每月1000个积分',
        '专属客服经理',
        'API访问权限',
        '自定义集成',
        '团队协作功能',
        '数据导出功能',
        '白标服务'
      ]
    }
  ];

  const handleRedeemCode = async () => {
    if (!activationCode.trim()) {
      toast({
        title: '请输入激活码',
        variant: 'destructive'
      });
      return;
    }

    setIsRedeeming(true);
    try {
      const result = await redeemCode(activationCode.trim());
      
      if (result.success) {
        setShowCodeDialog(false);
        setActivationCode('');
        await refreshUser();
        
        toast({
          title: '兑换成功！',
          description: '您的账户已升级，请刷新页面查看新功能'
        });
      } else {
        toast({
          title: '兑换失败',
          description: result.error,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '兑换失败',
        description: '系统错误，请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatExpiryDate = (dateString?: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPremium = user?.subscription_type === 'premium' || user?.subscription_type === 'enterprise';
  const isExpired = user?.subscription_expires ? new Date(user.subscription_expires) < new Date() : false;

  return (
    <div className="space-y-6">
      {/* 当前状态卡片 */}
      {user && (
        <Card className={`border-2 ${isPremium && !isExpired ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-200'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${isPremium && !isExpired ? 'bg-yellow-100' : 'bg-gray-100'}`}>
                  {isPremium && !isExpired ? (
                    <Crown className="h-6 w-6 text-yellow-600" />
                  ) : (
                    <Star className="h-6 w-6 text-gray-600" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold flex items-center space-x-2">
                    <span>
                      {user.subscription_type === 'enterprise' ? '企业版' : 
                       user.subscription_type === 'premium' ? '高级版' : '免费版'}
                    </span>
                    {isPremium && !isExpired && (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        {user.subscription_type === 'enterprise' ? '企业' : '高级'}
                      </Badge>
                    )}
                    {isExpired && (
                      <Badge variant="outline" className="text-red-600 border-red-200">
                        已过期
                      </Badge>
                    )}
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Coins className="h-4 w-4 mr-1" />
                        积分: {user.credits || 0}
                      </span>
                      {user.subscription_expires && (
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {isExpired ? '已于' : '到期'}: {formatExpiryDate(user.subscription_expires)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => setShowCodeDialog(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                <Gift className="h-4 w-4 mr-2" />
                兑换激活码
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 订阅计划 */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">选择适合您的计划</h2>
          <p className="text-gray-600">解锁更多AI工具和高级功能</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-200 shadow-lg' : 'border-gray-200'}`}>
              {plan.badge && (
                <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 px-3 py-1 text-xs font-semibold rounded-full ${
                  plan.popular ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.badge}
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">¥{plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Separator className="my-6" />
                
                <div className="space-y-3">
                  {plan.id === 'free' ? (
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      disabled
                    >
                      当前计划
                    </Button>
                  ) : (
                    <>
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700' 
                            : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
                        }`}
                        onClick={() => {
                          toast({
                            title: '即将开放',
                            description: '在线支付功能正在开发中，请使用激活码升级',
                          });
                        }}
                      >
                        立即订阅
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => setShowCodeDialog(true)}
                      >
                        <Gift className="h-4 w-4 mr-2" />
                        使用激活码
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 功能对比表 */}
      <Card>
        <CardHeader>
          <CardTitle>功能对比</CardTitle>
          <CardDescription>详细了解各版本功能差异</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">功能</th>
                  <th className="text-center py-3 px-4">免费版</th>
                  <th className="text-center py-3 px-4">高级版</th>
                  <th className="text-center py-3 px-4">企业版</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">AI工具使用</td>
                  <td className="text-center py-3 px-4"><span className="text-gray-500">限制使用</span></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">每月积分</td>
                  <td className="text-center py-3 px-4">10</td>
                  <td className="text-center py-3 px-4">200</td>
                  <td className="text-center py-3 px-4">1000</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">API访问</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">数据导出</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">优先客服</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4">团队协作</td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><X className="h-4 w-4 text-red-500 mx-auto" /></td>
                  <td className="text-center py-3 px-4"><Check className="h-4 w-4 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 兑换激活码对话框 */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              兑换激活码
            </DialogTitle>
            <DialogDescription>
              输入您的激活码来升级账户或增加积分
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activation-code">激活码</Label>
              <Input
                id="activation-code"
                value={activationCode}
                onChange={(e) => setActivationCode(e.target.value)}
                placeholder="请输入激活码"
                disabled={isRedeeming}
              />
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-sm text-blue-700">
                  <p className="font-medium">激活码类型：</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    <li>• 高级版月卡：升级为高级版用户1个月</li>
                    <li>• 高级版年卡：升级为高级版用户1年</li>
                    <li>• 积分卡：增加指定数量的积分</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCodeDialog(false)}
              disabled={isRedeeming}
            >
              取消
            </Button>
            <Button 
              onClick={handleRedeemCode}
              disabled={isRedeeming || !activationCode.trim()}
            >
              {isRedeeming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  兑换中...
                </>
              ) : (
                '立即兑换'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumFeatures;