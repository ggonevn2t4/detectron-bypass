
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const usePageTransition = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState('page-enter');
  
  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('page-exit-active');
      
      const timeout = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('page-enter');
        
        const enterTimeout = setTimeout(() => {
          setTransitionStage('page-enter-active');
        }, 10);
        
        return () => clearTimeout(enterTimeout);
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [location, displayLocation]);
  
  return { transitionStage, displayLocation };
};
