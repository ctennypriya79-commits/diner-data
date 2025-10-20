import { useEffect, useState } from 'react';
import axios from 'axios';
import { MetricCard } from './MetricCard.jsx';
import { useDashboard } from '@/context/DashboardContext.jsx';

export const RevenueMetrics = () => {
  const [data, setData] = useState(null);
  const { filters, dataVersion } = useDashboard();

  useEffect(() => {
    fetchData();
  }, [filters.aggregation, dataVersion]);

  const fetchData = async () => {
    try {
      let endpoint = '/data/summary.json';
      
      switch (filters.aggregation) {
        case 'daily':
          endpoint = '/data/revenue_daily.json';
          break;
        case 'weekly':
          endpoint = '/data/revenue_weekly.json';
          break;
        case 'monthly':
          endpoint = '/data/revenue_monthly.json';
          break;
        case 'quarterly':
          endpoint = '/data/revenue_quarterly.json';
          break;
        default:
          endpoint = '/data/summary.json';
      }

      const response = await axios.get(endpoint);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching revenue metrics:', error);
    }
  };

  if (!data) return null;

  const formatValue = (value) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} L`;
    }
    return value.toLocaleString('en-IN');
  };

  // Extract change percentages from comparison object
  const revenueChange = data.comparison?.totalRevenue?.changePercent || 0;
  const marginChange = data.comparison?.profitMargin?.changePercent || 0;
  const revparChange = data.comparison?.revpar?.changePercent || 0;
  const conversionChange = data.comparison?.bookingConversion?.changePercent || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatValue(data.totalRevenue)}
        change={`${revenueChange > 0 ? '+' : ''}${revenueChange.toFixed(1)}%`}
        changeType={revenueChange >= 0 ? 'positive' : 'negative'}
        icon="revenue"
      />
      <MetricCard
        title="Profit Margin"
        value={formatValue(data.profitMargin)}
        change={`${marginChange > 0 ? '+' : ''}${marginChange.toFixed(1)}%`}
        changeType={marginChange >= 0 ? 'positive' : 'negative'}
        icon="margin"
      />
      <MetricCard
        title="RevPAR"
        value={formatValue(data.revpar)}
        change={`${revparChange > 0 ? '+' : ''}${revparChange.toFixed(1)}%`}
        changeType={revparChange >= 0 ? 'positive' : 'negative'}
        icon="revpar"
      />
      <MetricCard
        title="Booking Conversion"
        value={`${data.bookingConversion}%`}
        change={`${conversionChange > 0 ? '+' : ''}${conversionChange.toFixed(1)}%`}
        changeType={conversionChange >= 0 ? 'positive' : 'negative'}
        icon="conversion"
        currency=""
      />
    </div>
  );
};
