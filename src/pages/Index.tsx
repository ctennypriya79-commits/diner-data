import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import { RoomTypeProfitability } from '@/components/RoomTypeProfitability';
import { RevenueWaterfall } from '@/components/RevenueWaterfall';
import { SeasonalHeatmap } from '@/components/SeasonalHeatmap';
import { RevenueMetrics } from '@/components/RevenueMetrics';
import { toast } from 'sonner';

const DashboardContent = () => {
  const { filters, setFilters, refreshData, resetFilters, applyFilters, isLoading } = useDashboard();
  const [lastUpdated, setLastUpdated] = useState(new Date());


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
    // Export all current dashboard data as JSON
    const exportData = {
      filters,
      timestamp: new Date().toISOString(),
      lastUpdated: lastUpdated.toISOString(),
      aggregation: filters.aggregation
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_export_${new Date().getTime()}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    
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
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Revenue Analytics</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Last updated: {formatLastUpdate(lastUpdated)}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
                className="flex-1 sm:flex-none"
              >
                <RefreshCw className={`w-4 h-4 sm:mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex-1 sm:flex-none"
              >
                <Download className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Filters Section */}
        <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-card rounded-lg border border-border animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">Advanced Filters</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                size="sm" 
                onClick={handleApplyFilters} 
                className="bg-[#FDB913] hover:bg-[#FDB913]/90 text-black font-semibold flex-1 sm:flex-none"
              >
                Apply Filters
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleReset}
                className="flex-1 sm:flex-none"
              >
                Reset
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block text-foreground">Date Range</label>
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
                <label className="text-sm font-medium mb-2 block text-foreground">Comparison</label>
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

            {/* Aggregation Tabs */}
            <div className="flex gap-2 sm:gap-4 border-b border-border overflow-x-auto">
              {['daily', 'weekly', 'monthly', 'quarterly'].map((agg) => (
                <button
                  key={agg}
                  onClick={() => setFilters({ ...filters, aggregation: agg })}
                  className={`px-4 py-2 text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    filters.aggregation === agg
                      ? 'text-foreground border-b-2 border-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {agg}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue Metrics Cards */}
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <RevenueMetrics />
        </div>

        {/* Components - Full Width Vertical Stack */}
        <div className="space-y-6 sm:space-y-8">
          {/* Revenue Waterfall */}
          <RevenueWaterfall />

          {/* Room Type Profitability */}
          <RoomTypeProfitability />

          {/* Seasonal Heat Map - Full Screen */}
          <SeasonalHeatmap />
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
