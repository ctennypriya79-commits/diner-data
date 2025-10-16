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
  applyFilters: () => void;
  isLoading: boolean;
  dataVersion: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  dateRange: 'last30days',
  comparisonMode: 'yoy',
  aggregation: 'daily'
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);
  const [dataVersion, setDataVersion] = useState(0);

  const refreshData = async () => {
    setIsLoading(true);
    setFilters(defaultFilters);
    setDataVersion(prev => prev + 1);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setDataVersion(prev => prev + 1);
  };

  const applyFilters = () => {
    setDataVersion(prev => prev + 1);
  };

  return (
    <DashboardContext.Provider value={{ filters, setFilters, refreshData, resetFilters, applyFilters, isLoading, dataVersion }}>
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
