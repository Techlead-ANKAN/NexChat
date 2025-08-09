import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [deviceType, setDeviceType] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({ width, height });
      
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    // Set initial values
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    ...windowSize,
    ...deviceType,
    isSmallScreen: windowSize.width < 640,
    isMediumScreen: windowSize.width >= 640 && windowSize.width < 1024,
    isLargeScreen: windowSize.width >= 1024,
  };
};

export const useBreakpoint = (breakpoint) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const breakpoints = {
      xs: '(min-width: 475px)',
      sm: '(min-width: 640px)',
      md: '(min-width: 768px)',
      lg: '(min-width: 1024px)',
      xl: '(min-width: 1280px)',
      '2xl': '(min-width: 1536px)',
    };

    const mediaQuery = window.matchMedia(breakpoints[breakpoint]);
    setMatches(mediaQuery.matches);

    const handleChange = (e) => setMatches(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpoint]);

  return matches;
};
