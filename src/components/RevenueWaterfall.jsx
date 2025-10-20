import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const RevenueWaterfall = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('/data/waterfall.json').then(res => setData(res.data.data));
  }, []);

  const getBarColor = (type) => {
    switch (type) {
      case 'positive': return 'hsl(var(--success))';
      case 'negative': return 'hsl(var(--error))';
      case 'start':
      case 'end': return 'hsl(var(--primary))';
      default: return 'hsl(var(--muted))';
    }
  };

  const handleExport = () => {
    const csv = [
      ['Category', 'Amount'],
      ...data.map(item => [item.name, item.value])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'revenue_waterfall.csv';
    a.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Revenue Waterfall</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Monthly revenue breakdown and progression</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full" />
                <span className="text-xs sm:text-sm text-muted-foreground">Gains</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-error rounded-full" />
                <span className="text-xs sm:text-sm text-muted-foreground">Losses</span>
              </div>
            </div>
            <Button size="sm" onClick={handleExport} variant="outline" className="w-full sm:w-auto font-medium rounded-lg border-border hover:bg-muted/50">
              <Download className="w-4 h-4 sm:mr-2" />
              <span className="sm:inline">Export</span>
            </Button>
          </div>
        </div>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 10 }} width={60} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.type)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
