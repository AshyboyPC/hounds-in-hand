'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isInitialLoad: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider = ({ children }: LoadingProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const handleSetIsLoading = (loading: boolean) => {
    setIsLoading(loading);
    if (!loading && isInitialLoad) {
      setIsInitialLoad(false);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading: handleSetIsLoading, isInitialLoad }}>
      {children}
    </LoadingContext.Provider>
  );
};
