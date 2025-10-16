import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';

const iconMap = {
  revenue: DollarSign,
  margin: TrendingUp,
  revpar: BarChart3,
  conversion: Target,
};

export const MetricCard = ({ title, value, change, changeType, icon, currency = '₹' }) => {
  const IconComponent = iconMap[icon];
  const isPositive = changeType === 'positive';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          <span className="text-sm text-muted-foreground">{title}</span>
        </div>
        <div className="space-y-2">
          <div className="text-2xl font-bold text-foreground">
            {currency}{value}
          </div>
          <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
            <span className="font-medium">{change}</span>
            <span className="text-muted-foreground ml-1">vs last period</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
