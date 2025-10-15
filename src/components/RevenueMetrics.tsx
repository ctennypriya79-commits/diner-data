import { useEffect, useState } from 'react';
import axios from 'axios';
import { MetricCard } from './MetricCard';
import { useDashboard } from '@/context/DashboardContext';

interface SummaryData {
  totalRevenue: number;
  profitMargin: number;
  revpar: number;
  bookingConversion: number;
  comparison: {
    totalRevenue: { changePercent: number };
    profitMargin: { changePercent: number };
    revpar: { changePercent: number };
    bookingConversion: { changePercent: number };
  };
}

export const RevenueMetrics = () => {
  const { filters, dataVersion } = useDashboard();
  const [data, setData] = useState<SummaryData | null>(null);

  useEffect(() => {
    fetchData();
  }, [filters.aggregation, dataVersion]);

  const fetchData = async () => {
    try {
      const fileMap: Record<string, string> = {
        daily: '/data/revenue_daily.json',
        weekly: '/data/revenue_weekly.json',
        monthly: '/data/revenue_monthly.json',
        quarterly: '/data/revenue_quarterly.json'
      };
      
      const file = fileMap[filters.aggregation] || '/data/summary.json';
      const response = await axios.get(file);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
    }
  };

  if (!data) return null;

  const formatValue = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(2)}Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(2)}L`;
    return value.toLocaleString('en-IN');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatValue(data.totalRevenue)}
        change={`${data.comparison.totalRevenue.changePercent > 0 ? '+' : ''}${data.comparison.totalRevenue.changePercent}%`}
        changeType={data.comparison.totalRevenue.changePercent >= 0 ? 'positive' : 'negative'}
        icon="revenue"
      />
      <MetricCard
        title="Profit Margin"
        value={formatValue(data.profitMargin)}
        change={`${data.comparison.profitMargin.changePercent > 0 ? '+' : ''}${data.comparison.profitMargin.changePercent}%`}
        changeType={data.comparison.profitMargin.changePercent >= 0 ? 'positive' : 'negative'}
        icon="margin"
      />
      <MetricCard
        title="RevPAR"
        value={data.revpar.toLocaleString('en-IN')}
        change={`${data.comparison.revpar.changePercent > 0 ? '+' : ''}${data.comparison.revpar.changePercent}%`}
        changeType={data.comparison.revpar.changePercent >= 0 ? 'positive' : 'negative'}
        icon="revpar"
      />
      <MetricCard
        title="Booking Conversion"
        value={`${data.bookingConversion}%`}
        change={`${data.comparison.bookingConversion.changePercent > 0 ? '+' : ''}${data.comparison.bookingConversion.changePercent}%`}
        changeType={data.comparison.bookingConversion.changePercent >= 0 ? 'positive' : 'negative'}
        icon="conversion"
        currency=""
      />
    </div>
  );
};
