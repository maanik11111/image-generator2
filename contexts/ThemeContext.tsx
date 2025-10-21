import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

type Theme = {
  name: string;
  colors: {
    gradientFrom: string;
    gradientTo: string;
    buttonBg: string;
    buttonHoverBg: string;
    imageBorder: string;
    iconHover: string;
    borderHover: string;
    spinner: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Indigo',
    colors: {
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-indigo-600',
      buttonBg: 'bg-indigo-600',
      buttonHoverBg: 'hover:bg-indigo-700',
      imageBorder: 'border-indigo-500/50',
      iconHover: 'group-hover:text-indigo-400',
      borderHover: 'hover:border-indigo-500',
      spinner: 'text-indigo-400',
    },
  },
  {
    name: 'Crimson',
    colors: {
      gradientFrom: 'from-red-400',
      gradientTo: 'to-rose-600',
      buttonBg: 'bg-rose-600',
      buttonHoverBg: 'hover:bg-rose-700',
      imageBorder: 'border-rose-500/50',
      iconHover: 'group-hover:text-rose-400',
      borderHover: 'hover:border-rose-500',
      spinner: 'text-rose-400',
    },
  },
  {
    name: 'Emerald',
    colors: {
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600',
      buttonBg: 'bg-teal-600',
      buttonHoverBg: 'hover:bg-teal-700',
      imageBorder: 'border-teal-500/50',
      iconHover: 'group-hover:text-teal-400',
      borderHover: 'hover:border-teal-500',
      spinner: 'text-teal-400',
    },
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeName, setThemeName] = useState<string>(() => {
    try {
      const storedTheme = window.localStorage.getItem('app-theme');
      return storedTheme || 'Indigo';
    } catch (error) {
      return 'Indigo';
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('app-theme', themeName);
    } catch (error) {
      console.error('Failed to save theme to localStorage', error);
    }
  }, [themeName]);

  const activeTheme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);

  const value = {
    theme: activeTheme,
    setTheme: setThemeName,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
