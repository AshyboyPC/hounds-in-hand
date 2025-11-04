import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageLoader = (initialLoadDuration = 1450) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();

  // Handle initial page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, initialLoadDuration);

    return () => clearTimeout(timer);
  }, [initialLoadDuration]);

  // Handle route changes
  useEffect(() => {
    // Skip initial mount
    if (isLoading) return;

    setShowLoader(true);
    const timer = setTimeout(() => {
      setShowLoader(false);
    }, 1450);

    return () => clearTimeout(timer);
  }, [location.pathname, isLoading]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsLoading(false);
  };

  return {
    showLoader: isLoading || showLoader,
    handleLoaderComplete
  };
};
