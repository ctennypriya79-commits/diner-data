import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sun, CloudRain, Cloud, CloudSun } from 'lucide-react';

const weatherIcons = {
  Sunny: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
  'Partly Cloudy': CloudSun,
};

// Generate realistic hotel data for India with proper seasonal patterns
const generateMonthData = (month) => {
  const daysInMonth = {
    January: 31, February: 28, March: 31, April: 30, May: 31, June: 30,
    July: 31, August: 31, September: 30, October: 31, November: 30, December: 31
  };
  
  // Weather patterns for India (Tirupati region)
  const weatherPatterns = {
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
  const occupancyRanges = {
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
  const data = [];
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
    if (occupancy >= 80) return 'bg-green-600';
    if (occupancy >= 50) return 'bg-amber-500';
    return 'bg-gray-300';
  };

  const WeatherIcon = ({ weather }) => {
    const Icon = weatherIcons[weather] || Sun;
    return <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />;
  };

  return (
    <Card className="p-6 lg:p-8 bg-card w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h3 className="text-xl lg:text-2xl font-bold text-foreground">Seasonal Demand Heatmap</h3>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">Daily occupancy and weather correlation</p>
        </div>
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-full sm:w-48 border-input text-base">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 lg:gap-3 mb-3">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm lg:text-base font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendar Grid - Full Screen Sized */}
      <div className="grid grid-cols-7 gap-2 lg:gap-3 mb-6">
        {calendarCells}
        {data.map((day) => (
          <motion.div
            key={day.day}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className={`${getIntensityColor(day.occupancy)} rounded-lg p-3 lg:p-4 cursor-pointer transition-all shadow-md hover:shadow-xl relative group min-h-[80px] lg:min-h-[100px]`}
          >
            <div className="flex flex-col items-center justify-center h-full space-y-1 lg:space-y-2">
              <span className="text-base lg:text-lg font-bold text-white">{day.day}</span>
              <WeatherIcon weather={day.weather} />
              <span className="text-sm lg:text-base font-bold text-white">{day.occupancy}%</span>
            </div>
            
            {/* Enhanced Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block z-20">
              <div className="bg-card text-foreground border-2 border-border text-sm rounded-lg px-4 py-3 whitespace-nowrap shadow-2xl">
                <div className="font-bold text-base mb-2">{month} {day.day}</div>
                <div className="space-y-1">
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pt-6 border-t-2 border-border">
        <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-sm lg:text-base text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 lg:w-5 lg:h-5 bg-gray-300 rounded" />
            <span className="whitespace-nowrap font-medium">Low (&lt;50%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 lg:w-5 lg:h-5 bg-amber-500 rounded" />
            <span className="whitespace-nowrap font-medium">Medium (50-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-600 rounded" />
            <span className="whitespace-nowrap font-medium">High (80%+)</span>
          </div>
        </div>
        <div className="text-lg lg:text-xl text-foreground font-bold bg-primary/10 px-4 py-2 rounded-lg">
          Average Occupancy: {avgOccupancy}%
        </div>
      </div>
    </Card>
  );
};
