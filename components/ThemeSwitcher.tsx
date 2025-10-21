import React from 'react';
import { useTheme, themes } from '../contexts/ThemeContext';
import clsx from 'clsx';

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 bg-gray-800/50 backdrop-blur-sm p-2 rounded-full flex items-center space-x-2">
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          aria-label={`Switch to ${t.name} theme`}
          className={clsx(
            'w-6 h-6 rounded-full transition-transform duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900',
            t.colors.buttonBg,
            {
              'scale-125 ring-2 ring-white/80': theme.name === t.name,
              'hover:scale-110': theme.name !== t.name,
            }
          )}
        />
      ))}
    </div>
  );
};
