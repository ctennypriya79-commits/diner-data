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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <MetricCard
        title="Total Revenue"
        value={formatValue(data.totalRevenue)}
        change={`${data.revenueChange > 0 ? '+' : ''}${data.revenueChange}%`}
        changeType={data.revenueChange >= 0 ? 'positive' : 'negative'}
        icon="revenue"
      />
      <MetricCard
        title="Profit Margin"
        value={`${data.profitMargin}`}
        change={`${data.marginChange > 0 ? '+' : ''}${data.marginChange}%`}
        changeType={data.marginChange >= 0 ? 'positive' : 'negative'}
        icon="margin"
        currency=""
      />
      <MetricCard
        title="RevPAR"
        value={formatValue(data.revpar)}
        change={`${data.revparChange > 0 ? '+' : ''}${data.revparChange}%`}
        changeType={data.revparChange >= 0 ? 'positive' : 'negative'}
        icon="revpar"
      />
      <MetricCard
        title="Booking Conversion"
        value={`${data.bookingConversion}%`}
        change={`${data.conversionChange > 0 ? '+' : ''}${data.conversionChange}%`}
        changeType={data.conversionChange >= 0 ? 'positive' : 'negative'}
        icon="conversion"
        currency=""
      />
    </div>
  );
};
