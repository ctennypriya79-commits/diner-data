import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface BookingData {
  thisWeek: { total: number; lastYear: number; change: number; revenue: number };
  nextWeek: { total: number; lastYear: number; change: number; revenue: number };
  nextMonth: { total: number; lastYear: number; change: number; revenue: number };
  insights: Array<{ id: number; type: string; title: string; description: string }>;
}

export const BookingInsights = () => {
  const [data, setData] = useState<BookingData | null>(null);

  useEffect(() => {
    axios.get('/data/booking.json').then(res => setData(res.data));
  }, []);

  if (!data) return null;

  const bookingPeriods = [
    { label: 'This Week', ...data.thisWeek },
    { label: 'Next Week', ...data.nextWeek },
    { label: 'Next Month', ...data.nextMonth }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Booking Pace</h3>
        <div className="space-y-4">
          {bookingPeriods.map((period) => (
            <div key={period.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div>
                <p className="text-sm font-medium">{period.label}</p>
                <p className="text-xs text-muted-foreground">
                  {period.total} bookings (vs {period.lastYear} last year)
                </p>
              </div>
              <div className={`flex items-center text-sm font-semibold ${period.change >= 0 ? 'text-success' : 'text-error'}`}>
                {period.change >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {period.change > 0 ? '+' : ''}{period.change}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h4 className="text-sm font-semibold text-foreground mb-3">Key Insights</h4>
          <div className="space-y-3">
            {data.insights.map((insight) => (
              <div key={insight.id} className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg">
                {insight.type === 'positive' ? (
                  <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-medium">{insight.title}</p>
                  <p className="text-xs text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
