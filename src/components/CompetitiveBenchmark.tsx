import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface CompetitiveData {
  metrics: Array<{
    name: string;
    yours: number;
    competitor: number;
    change: number;
    unit: string;
  }>;
}

export const CompetitiveBenchmark = () => {
  const [data, setData] = useState<CompetitiveData | null>(null);

  useEffect(() => {
    axios.get('/data/competitive.json').then(res => setData(res.data));
  }, []);

  if (!data) return null;

  const chartData = data.metrics.map(metric => ({
    name: metric.name.replace(' Comparison', ''),
    'Your Property': metric.yours,
    'Competitor Avg': metric.competitor
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.6 }}
    >
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Competitive Benchmarking</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Bar dataKey="Your Property" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Competitor Avg" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </motion.div>
  );
};
