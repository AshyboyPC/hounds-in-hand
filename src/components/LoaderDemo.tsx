import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { triggerLoader } from '@/utils/loaderUtils';

/**
 * Demo component to test the loader manually
 * Add this to any page to test the loader functionality
 */
const LoaderDemo = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleTriggerLoader = async () => {
    setIsLoading(true);
    await triggerLoader(1450);
    setIsLoading(false);
  };

  const handleNavigateWithLoader = async (path: string) => {
    await triggerLoader(1450);
    navigate(path);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '20px',
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 'bold' }}>
        Loader Demo
      </h3>
      
      <button
        onClick={handleTriggerLoader}
        disabled={isLoading}
        style={{
          padding: '8px 16px',
          background: '#1a1a1a',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          fontSize: '12px',
          opacity: isLoading ? 0.6 : 1
        }}
      >
        Trigger Loader
      </button>

      <button
        onClick={() => handleNavigateWithLoader('/')}
        style={{
          padding: '8px 16px',
          background: '#4b5563',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Go Home (with loader)
      </button>

      <button
        onClick={() => handleNavigateWithLoader('/adopt')}
        style={{
          padding: '8px 16px',
          background: '#4b5563',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px'
        }}
      >
        Go to Adopt (with loader)
      </button>
    </div>
  );
};

export default LoaderDemo;
