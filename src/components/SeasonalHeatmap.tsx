import { useState } from 'react';
import { motion } from 'framer-motion';
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

// Generate realistic hotel data for India with proper seasonal patterns
const generateMonthData = (month: string): DayData[] => {
  const daysInMonth: { [key: string]: number } = {
    January: 31, February: 28, March: 31, April: 30, May: 31, June: 30,
    July: 31, August: 31, September: 30, October: 31, November: 30, December: 31
  };
  
  // Weather patterns for India (Tirupati region)
  const weatherPatterns: { [key: string]: string[] } = {
    January: ['Sunny', 'Sunny', 'Partly Cloudy', 'Sunny'],
    February: ['Sunny', 'Sunny', 'Sunny', 'Partly Cloudy'],
    March: ['Sunny', 'Sunny', 'Partly Cloudy', 'Sunny'],
    April: ['Sunny', 'Sunny', 'Partly Cloudy', 'Cloudy'],
    May: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Sunny'],
    June: ['Rainy', 'Cloudy', 'Rainy', 'Partly Cloudy'],
    July: ['Rainy', 'Rainy', 'Cloudy', 'Rainy'],
    August: ['Rainy', 'Cloudy', 'Rainy', 'Partly Cloudy'],
    September: ['Rainy', 'Cloudy', 'Partly Cloudy', 'Sunny'],
    October: ['Sunny', 'Partly Cloudy', 'Sunny', 'Sunny'],
    November: ['Sunny', 'Sunny', 'Partly Cloudy', 'Sunny'],
    December: ['Sunny', 'Sunny', 'Sunny', 'Partly Cloudy']
  };
  
  // Occupancy patterns (peak season: Oct-Mar, low season: Jun-Aug)
  const occupancyRanges: { [key: string]: { min: number; max: number } } = {
    January: { min: 75, max: 92 },
    February: { min: 78, max: 91 },
    March: { min: 86, max: 95 },
    April: { min: 78, max: 91 },
    May: { min: 68, max: 84 },
    June: { min: 58, max: 73 },
    July: { min: 62, max: 79 },
    August: { min: 67, max: 83 },
    September: { min: 79, max: 89 },
    October: { min: 87, max: 96 },
    November: { min: 85, max: 94 },
    December: { min: 93, max: 99 }
  };
  
  const days = daysInMonth[month];
  const data: DayData[] = [];
  const patterns = weatherPatterns[month];
  const occRange = occupancyRanges[month];
  
  for (let i = 1; i <= days; i++) {
    const weather = patterns[i % patterns.length];
    let occupancy = Math.floor(Math.random() * (occRange.max - occRange.min + 1)) + occRange.min;
    
    // Weekend boost (Friday-Sunday)
    const dayOfWeek = (i - 1) % 7;
    if (dayOfWeek >= 4) {
      occupancy = Math.min(99, occupancy + Math.floor(Math.random() * 8) + 3);
    }
    
    // Weather impact
    if (weather === 'Rainy') occupancy = Math.max(50, occupancy - Math.floor(Math.random() * 10));
    
    const bookings = Math.floor(occupancy * 0.7);
    const revenue = occupancy * 3900 + Math.floor(Math.random() * 5000);
    
    data.push({ day: i, occupancy, revenue, weather, bookings });
  }
  
  return data;
};

export const SeasonalHeatmap = () => {
  const [month, setMonth] = useState('October');
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const data = generateMonthData(month);
  
  // Calculate average occupancy
  const avgOccupancy = Math.round(data.reduce((sum, d) => sum + d.occupancy, 0) / data.length);
  
  // Get first day of month (for calendar alignment)
  const getFirstDayOfMonth = (monthName: string) => {
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
  
  const getIntensityColor = (occupancy: number) => {
    if (occupancy >= 80) return 'bg-green-600';
    if (occupancy >= 50) return 'bg-amber-500';
    return 'bg-gray-300';
  };

  const WeatherIcon = ({ weather }: { weather: string }) => {
    const Icon = weatherIcons[weather as keyof typeof weatherIcons] || Sun;
    return <Icon className="w-4 h-4 text-white" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="w-full"
    >
      <Card className="p-4 sm:p-6 bg-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Seasonal Demand Heatmap</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Daily occupancy and weather correlation</p>
          </div>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-40 border-input">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarCells}
          {data.map((day) => (
            <motion.div
              key={day.day}
              whileHover={{ scale: 1.08, zIndex: 10 }}
              className={`${getIntensityColor(day.occupancy)} rounded aspect-square p-2 cursor-pointer transition-all shadow-sm relative group`}
            >
              <div className="flex flex-col items-center justify-center h-full space-y-0.5">
                <span className="text-xs font-semibold text-white">{day.day}</span>
                <WeatherIcon weather={day.weather} />
                <span className="text-[10px] font-bold text-white">{day.occupancy}%</span>
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                <div className="bg-card text-foreground border border-border text-xs rounded px-3 py-2 whitespace-nowrap shadow-lg">
                  <div className="font-semibold">{month} {day.day}</div>
                  <div>Occupancy: {day.occupancy}%</div>
                  <div>Bookings: {day.bookings}</div>
                  <div>Weather: {day.weather}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 sm:mt-6 pt-4 border-t border-border">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-300 rounded" />
              <span className="whitespace-nowrap">Low (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span className="whitespace-nowrap">Medium (50-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-600 rounded" />
              <span className="whitespace-nowrap">High (80%+)</span>
            </div>
          </div>
          <div className="text-sm text-foreground font-medium whitespace-nowrap">
            Avg Occupancy: {avgOccupancy}%
          </div>
        </div>
      </Card>
    </motion.div>
  );
};