import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const RoomTypeProfitability = () => {
  const [data, setData] = useState(null);
  const [sortField, setSortField] = useState('revenue');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('/data/room_profitability.json');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching room profitability data:', error);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleExport = () => {
    if (!data) return;
    
    const csv = [
      ['Room Type', 'Rooms', 'Occupancy', 'ADR', 'RevPAR', 'Revenue', 'Profit', 'Margin'].join(','),
      ...sortedRoomTypes.map(room => [
        room.name,
        room.rooms,
        `${room.occupancy}%`,
        `₹${room.adr.toLocaleString('en-IN')}`,
        `₹${room.revpar.toLocaleString('en-IN')}`,
        `₹${room.revenue.toLocaleString('en-IN')}`,
        `₹${room.profit.toLocaleString('en-IN')}`,
        `${room.margin}%`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'room_profitability.csv';
    a.click();
    
    toast({
      title: "Export Successful",
      description: "Room profitability data exported to CSV",
    });
  };

  if (!data) return null;

  const sortedRoomTypes = [...data.roomTypes].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    return aValue > bValue ? modifier : -modifier;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground">Room Type Profitability Analysis</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Performance metrics with inline rate adjustment capabilities</p>
          </div>
          <Button onClick={handleExport} size="sm" className="w-full sm:w-auto bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-900 font-medium rounded-md px-4 py-2 border-0 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px] sm:w-[200px]">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Room Type <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('rooms')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Rooms <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('occupancy')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Occ% <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <button
                    onClick={() => handleSort('adr')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    ADR <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right hidden md:table-cell">
                  <button
                    onClick={() => handleSort('revpar')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    RevPAR <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Revenue <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right hidden lg:table-cell">
                  <button
                    onClick={() => handleSort('profit')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Profit <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('margin')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors text-xs sm:text-sm"
                  >
                    Margin <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRoomTypes.map((room) => (
                <TableRow key={room.id}>
                  <TableCell className="py-2 sm:py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-warning/20 rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-warning text-xs">🏨</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-xs sm:text-sm truncate">{room.name}</div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground">{room.bookings} bookings</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm">{room.rooms}</TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm">{room.occupancy}%</TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm hidden sm:table-cell">₹{room.adr.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm hidden md:table-cell">₹{room.revpar.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm">₹{room.revenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-semibold text-success text-xs sm:text-sm hidden lg:table-cell">₹{room.profit.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium text-xs sm:text-sm">{room.margin}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
          <span className="truncate">Showing {data.roomTypes.length} room types • Total Revenue: ₹{data.summary.totalRevenue.toLocaleString('en-IN')}</span>
          <span className="whitespace-nowrap">Average Margin: {data.summary.averageMargin}%</span>
        </div>
      </Card>
    </motion.div>
  );
};
