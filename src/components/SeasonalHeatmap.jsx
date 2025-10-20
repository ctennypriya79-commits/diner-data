import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, CloudRain, Cloud, CloudSun } from 'lucide-react';
import { useDashboard } from '@/context/DashboardContext.jsx';

const weatherIcons = {
  Sunny: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
  'Partly Cloudy': CloudSun,
};

export const SeasonalHeatmap = () => {
  const [month, setMonth] = useState('October');
  const [heatmapData, setHeatmapData] = useState(null);
  const { dataVersion } = useDashboard();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchData();
  }, [dataVersion]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/data/seasonal_heatmap.json');
      setHeatmapData(response.data);
    } catch (error) {
      console.error('Error fetching seasonal heatmap data:', error);
    }
  };

  if (!heatmapData) return null;

  const data = heatmapData[month] || [];
  
  // Calculate average occupancy
  const avgOccupancy = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.occupancy, 0) / data.length)
    : 0;
  
  // Get first day of month (for calendar alignment)
  const getFirstDayOfMonth = (monthName) => {
    const monthIndex = months.indexOf(monthName);
    const date = new Date(2025, monthIndex, 1);
    return date.getDay(); // 0 = Sunday
  };
  
  const firstDay = getFirstDayOfMonth(month);
  
  // Create calendar grid with empty cells for alignment
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  
  const getIntensityColor = (occupancy) => {
    if (occupancy >= 80) return 'bg-success/90 hover:bg-success';
    if (occupancy >= 50) return 'bg-warning/90 hover:bg-warning';
    return 'bg-muted/70 hover:bg-muted';
  };

  const WeatherIcon = ({ weather }) => {
    const Icon = weatherIcons[weather] || Sun;
    return <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <Card className="p-4 sm:p-6 lg:p-8 bg-card w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
          <div>
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground">Seasonal Demand Heatmap</h3>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-1">Daily occupancy and weather correlation</p>
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-48 bg-card border-2 border-border hover:border-primary/50 text-sm sm:text-base font-medium shadow-sm transition-all focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-2 border-border shadow-xl z-[100]">
              {months.map(m => (
                <SelectItem 
                  key={m} 
                  value={m}
                  className="cursor-pointer hover:bg-primary/10 focus:bg-primary/10 transition-colors"
                >
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-2 sm:mb-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs sm:text-sm lg:text-base font-semibold text-muted-foreground py-1 sm:py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar Grid - Fully Responsive */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 lg:gap-3 mb-4 sm:mb-6">
          {calendarCells}
          {data.map((day) => (
            <motion.div
              key={day.day}
              whileHover={{ scale: 1.05, zIndex: 10 }}
              className={`${getIntensityColor(day.occupancy)} rounded-lg p-2 sm:p-3 lg:p-4 cursor-pointer transition-all shadow-lg hover:shadow-2xl relative group min-h-[70px] sm:min-h-[90px] lg:min-h-[110px] border-2 border-transparent hover:border-primary/30`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-1 sm:space-y-2">
                <span className="text-sm sm:text-base lg:text-lg font-bold text-white drop-shadow-md">{day.day}</span>
                <div className="my-1">
                  <WeatherIcon weather={day.weather} />
                </div>
                <span className="text-xs sm:text-sm lg:text-base font-bold text-white drop-shadow-md">{day.occupancy}%</span>
              </div>
              
              {/* Enhanced Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 sm:mb-3 hidden group-hover:block z-20">
                <div className="bg-card text-foreground border-2 border-border text-xs sm:text-sm rounded-lg px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap shadow-2xl">
                  <div className="font-bold text-sm sm:text-base mb-1 sm:mb-2">{month} {day.day}</div>
                  <div className="space-y-0.5 sm:space-y-1">
                    <div>Occupancy: <span className="font-semibold">{day.occupancy}%</span></div>
                    <div>Bookings: <span className="font-semibold">{day.bookings}</span></div>
                    <div>Revenue: <span className="font-semibold">₹{day.revenue.toLocaleString()}</span></div>
                    <div>Weather: <span className="font-semibold">{day.weather}</span></div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Legend and Stats */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-4 sm:pt-6 border-t-2 border-border">
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm lg:text-base text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 lg:w-5 lg:h-5 bg-muted rounded" />
              <span className="whitespace-nowrap font-medium">Low (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 lg:w-5 lg:h-5 bg-warning rounded" />
              <span className="whitespace-nowrap font-medium">Medium (50-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 lg:w-5 lg:h-5 bg-success rounded" />
              <span className="whitespace-nowrap font-medium">High (80%+)</span>
            </div>
          </div>
          <div className="text-base sm:text-lg lg:text-xl text-foreground font-bold bg-primary/10 px-3 sm:px-4 py-2 rounded-lg">
            Average Occupancy: {avgOccupancy}%
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
