import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import clsx from 'clsx';

export const CursorFollower: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      const target = e.target as HTMLElement;
      if (window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer') {
        setIsPointer(true);
      } else {
        setIsPointer(false);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const followerClasses = clsx(
    "fixed top-0 left-0 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 blur-2xl transition-transform duration-200 ease-out",
    theme.colors.gradientTo, // Use theme color for the glow
    {
      'w-48 h-48 opacity-20': !isPointer,
      'w-64 h-64 opacity-30 transform scale-125': isPointer,
    }
  );

  return (
    <div
      className={followerClasses}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    />
  );
};
