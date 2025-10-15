import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FilterState {
  dateRange: string;
  comparisonMode: string;
  aggregation: string;
}

interface DashboardContextType {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  refreshData: () => void;
  resetFilters: () => void;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  dateRange: 'last30days',
  comparisonMode: 'yoy',
  aggregation: 'monthly'
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <DashboardContext.Provider value={{ filters, setFilters, refreshData, resetFilters, isLoading }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
