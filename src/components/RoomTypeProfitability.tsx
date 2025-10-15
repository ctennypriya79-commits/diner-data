import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpDown, Download } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface RoomType {
  id: number;
  name: string;
  bookings: number;
  rooms: number;
  occupancy: number;
  adr: number;
  revpar: number;
  revenue: number;
  profit: number;
  margin: number;
}

interface RoomProfitabilityData {
  roomTypes: RoomType[];
  summary: {
    totalRooms: number;
    totalRevenue: number;
    averageMargin: number;
  };
}

export const RoomTypeProfitability = () => {
  const [data, setData] = useState<RoomProfitabilityData | null>(null);
  const [sortField, setSortField] = useState<keyof RoomType>('revenue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

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

  const handleSort = (field: keyof RoomType) => {
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
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Room Type Profitability Analysis</h3>
            <p className="text-sm text-muted-foreground">Performance metrics with inline rate adjustment capabilities</p>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                  >
                    Room Type <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('rooms')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    Rooms <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('occupancy')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    Occupancy <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('adr')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    ADR <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('revpar')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    RevPAR <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    Revenue <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('profit')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    Profit <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
                <TableHead className="text-right">
                  <button
                    onClick={() => handleSort('margin')}
                    className="flex items-center gap-2 ml-auto hover:text-foreground transition-colors"
                  >
                    Margin <ArrowUpDown className="w-3 h-3" />
                  </button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRoomTypes.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-warning/20 rounded flex items-center justify-center">
                        <span className="text-warning text-xs">🏨</span>
                      </div>
                      <div>
                        <div className="font-medium">{room.name}</div>
                        <div className="text-xs text-muted-foreground">{room.bookings} bookings</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{room.rooms}</TableCell>
                  <TableCell className="text-right font-medium">{room.occupancy}%</TableCell>
                  <TableCell className="text-right font-medium">₹{room.adr.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium">₹{room.revpar.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium">₹{room.revenue.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-semibold text-success">₹{room.profit.toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right font-medium">{room.margin}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 pt-4 border-t flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing {data.roomTypes.length} room types • Total Revenue: ₹{data.summary.totalRevenue.toLocaleString('en-IN')}</span>
          <span>Average Margin: {data.summary.averageMargin}%</span>
        </div>
      </Card>
    </motion.div>
  );
};
