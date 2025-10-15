import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, CloudRain, Cloud, CloudSun } from 'lucide-react';

interface DayData {
  day: number;
  occupancy: number;
  revenue: number;
  weather: string;
  bookings: number;
}

const weatherIcons = {
  Sunny: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
  'Partly Cloudy': CloudSun,
};

export const SeasonalHeatmap = () => {
  const [month, setMonth] = useState('October');
  const [data, setData] = useState<DayData[]>([]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    axios.get('/data/seasonal_heatmap.json').then(res => {
      setData(res.data[month] || []);
    });
  }, [month]);

  const getIntensityColor = (occupancy: number) => {
    if (occupancy > 80) return 'bg-primary';
    if (occupancy > 50) return 'bg-warning';
    return 'bg-error/20';
  };

  const WeatherIcon = ({ weather }: { weather: string }) => {
    const Icon = weatherIcons[weather as keyof typeof weatherIcons] || Sun;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Seasonal Demand Heatmap</h3>
            <p className="text-sm text-muted-foreground">Daily occupancy and weather correlation</p>
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {data.map((day) => (
            <motion.div
              key={day.day}
              whileHover={{ scale: 1.05 }}
              className={`${getIntensityColor(day.occupancy)} rounded-lg p-3 cursor-pointer transition-all`}
            >
              <div className="flex flex-col items-center space-y-1">
                <span className="text-xs font-semibold">{day.day}</span>
                <WeatherIcon weather={day.weather} />
                <span className="text-xs font-bold">{day.occupancy}%</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-error/20 rounded" />
            <span>Low (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded" />
            <span>Medium (50-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded" />
            <span>High (&gt;80%)</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
