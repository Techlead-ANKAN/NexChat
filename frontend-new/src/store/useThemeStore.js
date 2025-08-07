import { create } from "zustand";

const useThemeStore = create((set, get) => ({
  theme: "tiger-stripes",
  
  setTheme: (theme) => {
    console.log('Setting theme to:', theme);
    set({ theme });
    // Apply theme to document root for CSS variables
    document.documentElement.setAttribute("data-theme", theme);
    // Store in localStorage for persistence
    localStorage.setItem("wild-by-nature-theme", theme);
    
    // Apply theme-specific styles
    applyThemeStyles(theme);
  },
  
  // Initialize theme from localStorage or default
  initTheme: () => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem("wild-by-nature-theme") || "tiger-stripes";
      set({ theme: savedTheme });
      document.documentElement.setAttribute("data-theme", savedTheme);
      applyThemeStyles(savedTheme);
    }
  },
}));

// Apply theme-specific CSS variables
const applyThemeStyles = (theme) => {
  if (typeof document === 'undefined') return;
  
  console.log('Applying theme styles for:', theme);
  const root = document.documentElement;
  
  // Remove existing theme classes
  root.classList.remove('theme-tiger-stripes', 'theme-forest-depths', 'theme-arctic-wolf', 'theme-golden-savanna');
  
  // Add new theme class
  root.classList.add(`theme-${theme}`);
  
  switch (theme) {
    case "tiger-stripes":
      // Tiger theme - minimal orange/black
      root.style.setProperty('--primary', '24 88% 58%'); // Orange
      root.style.setProperty('--background', '30 15% 6%'); // Dark brown-black
      root.style.setProperty('--foreground', '0 0% 95%'); // Off-white
      root.style.setProperty('--muted', '30 10% 15%'); // Dark muted
      root.style.setProperty('--muted-foreground', '0 0% 60%'); // Light muted
      root.style.setProperty('--accent', '24 88% 58%'); // Orange accent
      document.body.style.background = 'hsl(30, 15%, 6%)';
      break;
      
    case "forest-depths":
      // Forest theme - minimal green/dark
      root.style.setProperty('--primary', '152 65% 35%'); // Forest green
      root.style.setProperty('--background', '155 25% 8%'); // Very dark green
      root.style.setProperty('--foreground', '0 0% 95%'); // Off-white
      root.style.setProperty('--muted', '155 15% 15%'); // Dark muted
      root.style.setProperty('--muted-foreground', '0 0% 60%'); // Light muted
      root.style.setProperty('--accent', '152 65% 35%'); // Green accent
      document.body.style.background = 'hsl(155, 25%, 8%)';
      break;
      
    case "arctic-wolf":
      // Arctic theme - minimal blue/gray
      root.style.setProperty('--primary', '205 65% 45%'); // Steel blue
      root.style.setProperty('--background', '210 15% 8%'); // Dark blue-gray
      root.style.setProperty('--foreground', '0 0% 95%'); // Off-white
      root.style.setProperty('--muted', '210 10% 15%'); // Dark muted
      root.style.setProperty('--muted-foreground', '0 0% 60%'); // Light muted
      root.style.setProperty('--accent', '205 65% 45%'); // Blue accent
      document.body.style.background = 'hsl(210, 15%, 8%)';
      break;
      
    case "golden-savanna":
      // Savanna theme - minimal brown/gold
      root.style.setProperty('--primary', '35 55% 55%'); // Golden brown
      root.style.setProperty('--background', '30 20% 8%'); // Dark earth
      root.style.setProperty('--foreground', '0 0% 95%'); // Off-white
      root.style.setProperty('--muted', '30 15% 15%'); // Dark muted
      root.style.setProperty('--muted-foreground', '0 0% 60%'); // Light muted
      root.style.setProperty('--accent', '35 55% 55%'); // Golden accent
      document.body.style.background = 'hsl(30, 20%, 8%)';
      break;
      
    default: // tiger-stripes
      root.style.setProperty('--primary', '24 88% 58%');
      root.style.setProperty('--background', '30 15% 6%');
      root.style.setProperty('--foreground', '0 0% 95%');
      root.style.setProperty('--muted', '30 10% 15%');
      root.style.setProperty('--muted-foreground', '0 0% 60%');
      root.style.setProperty('--accent', '24 88% 58%');
      document.body.style.background = 'hsl(30, 15%, 6%)';
      break;
  }
  
  console.log('Theme styles applied successfully');
};

export { useThemeStore };
