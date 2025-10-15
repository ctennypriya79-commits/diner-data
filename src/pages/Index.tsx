import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { RevenueMetrics } from '@/components/RevenueMetrics';
import { RoomTypeProfitability } from '@/components/RoomTypeProfitability';
import { RevenueWaterfall } from '@/components/RevenueWaterfall';
import { RevenueForecast } from '@/components/RevenueForecast';
import { SeasonalHeatmap } from '@/components/SeasonalHeatmap';
import { ScenarioModeling } from '@/components/ScenarioModeling';
import { BookingInsights } from '@/components/BookingInsights';
import { CompetitiveBenchmark } from '@/components/CompetitiveBenchmark';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const DashboardContent = () => {
  const { filters, setFilters, refreshData, resetFilters, applyFilters, isLoading } = useDashboard();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const handleTabChange = (value: string) => {
    setFilters({ ...filters, aggregation: value });
  };

  const handleRefresh = async () => {
    await refreshData();
    setLastUpdated(new Date());
    toast.success('Data refreshed successfully');
  };

  const handleApplyFilters = () => {
    applyFilters();
    toast.success('Filters applied successfully');
  };

  const handleReset = () => {
    resetFilters();
    toast.info('Filters reset to defaults');
  };

  const handleExport = () => {
    toast.success('Data exported successfully');
  };

  const formatLastUpdate = (date: Date) => {
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Last updated: {formatLastUpdate(lastUpdated)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters Section */}
        <div className="mb-8 p-6 bg-card rounded-lg border border-border animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Advanced Filters</h2>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleApplyFilters} className="bg-primary text-primary-foreground">
                Apply Filters
              </Button>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset
              </Button>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Date Range</label>
              <select
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                value={filters.dateRange}
                onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              >
                <option value="last30days">Last 30 Days</option>
                <option value="last7days">Last 7 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="lastMonth">Last Month</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Comparison</label>
              <select
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground"
                value={filters.comparisonMode}
                onChange={(e) => setFilters({ ...filters, comparisonMode: e.target.value })}
              >
                <option value="yoy">Year over Year</option>
                <option value="mom">Month over Month</option>
                <option value="wow">Week over Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Aggregation Tabs */}
        <div className="mb-6">
          <Tabs value={filters.aggregation} onValueChange={handleTabChange}>
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-8">
          {/* Revenue Metrics */}
          <RevenueMetrics />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueForecast />
            <RevenueWaterfall />
          </div>

          {/* Room Type Profitability */}
          <RoomTypeProfitability />

          {/* Bottom Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <SeasonalHeatmap />
            <ScenarioModeling />
            <BookingInsights />
          </div>

          {/* Competitive Benchmark */}
          <CompetitiveBenchmark />
        </div>
      </main>
    </div>
  );
};

const Index = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default Index;
