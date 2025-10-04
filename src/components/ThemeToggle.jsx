import React, { useEffect, useState } from 'react';
import Icon from './AppIcon';

const STORAGE_KEY = 'expenseflow-theme';

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="fixed top-4 right-4 z-300">
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="p-2 rounded-md bg-card text-card-foreground border border-border shadow-sm"
      >
        {theme === 'dark' ? <Icon name="Sun" size={18} /> : <Icon name="Moon" size={18} />}
      </button>
    </div>
  );
};

export default ThemeToggle;
