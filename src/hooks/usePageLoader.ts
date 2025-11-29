import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Routes that should trigger the loader (login/logout related)
const LOADER_ROUTES = ['/dashboard', '/dashboard/community', '/dashboard/shelter', '/dashboard/admin'];

export const usePageLoader = (initialLoadDuration = 1450) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const location = useLocation();
  const previousPath = useRef<string | null>(null);
  const hasShownInitialLoader = useRef(false);

  // Handle initial page load only (first time website loads)
  useEffect(() => {
    if (hasShownInitialLoader.current) return;
    
    hasShownInitialLoader.current = true;
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
      setShowLoader(false);
    }, initialLoadDuration);

    return () => clearTimeout(timer);
  }, [initialLoadDuration]);

  // Handle route changes - only show loader for login/logout transitions to dashboard
  useEffect(() => {
    // Skip initial mount
    if (isInitialLoad) {
      previousPath.current = location.pathname;
      return;
    }

    const prevPath = previousPath.current;
    const currentPath = location.pathname;
    
    // Check if navigating TO a dashboard route FROM login or FROM a non-dashboard route
    const isGoingToDashboard = LOADER_ROUTES.some(route => currentPath.startsWith(route));
    const isComingFromLogin = prevPath === '/login';
    const isComingFromNonDashboard = prevPath && !LOADER_ROUTES.some(route => prevPath.startsWith(route));
    
    // Only show loader when:
    // 1. Coming from login page to dashboard (after login)
    // 2. Going to login from dashboard (after logout - handled by redirect)
    const shouldShowLoader = isGoingToDashboard && isComingFromLogin;
    
    if (shouldShowLoader) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 1450);
      
      previousPath.current = currentPath;
      return () => clearTimeout(timer);
    }
    
    previousPath.current = currentPath;
  }, [location.pathname, isInitialLoad]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    setIsInitialLoad(false);
  };

  // Trigger loader manually (can be called after login/logout)
  const triggerLoader = () => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 1450);
  };

  return {
    showLoader: isInitialLoad || showLoader,
    handleLoaderComplete,
    triggerLoader
  };
};
