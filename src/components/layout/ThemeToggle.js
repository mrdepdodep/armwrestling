'use client';

import { useTheme } from '@/lib/theme/ThemeContext';
import Icon from '@/components/ui/Icon';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const next = theme === 'dark' ? 'light' : 'dark';
  return (
    <button
      type="button"
      className="icon-btn"
      onClick={toggleTheme}
      title={`Switch to ${next} theme`}
      aria-label="Toggle theme"
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
    </button>
  );
}
