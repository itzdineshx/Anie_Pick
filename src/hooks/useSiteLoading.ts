import { useState, useEffect } from 'react';

export const useSiteLoading = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate minimum loading time for smooth experience
    const minLoadTime = 2000; // 2 seconds minimum
    const startTime = Date.now();

    const checkReadyState = () => {
      const elapsed = Date.now() - startTime;
      const isDocumentReady = document.readyState === 'complete';
      
      if (isDocumentReady && elapsed >= minLoadTime) {
        setIsLoading(false);
      } else {
        setTimeout(checkReadyState, 100);
      }
    };

    checkReadyState();
  }, []);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return { isLoading, handleLoadComplete };
};