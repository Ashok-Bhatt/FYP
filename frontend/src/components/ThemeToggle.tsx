import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

interface ThemeToggleProps {
    className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300 hover:-translate-y-0.5 ${className}`}
            style={{
                background: 'var(--toggle-bg)',
                borderColor: 'var(--border-strong)',
                color: 'var(--text-primary)',
                boxShadow: 'var(--shadow-soft)',
            }}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors duration-300"
                style={{ background: 'var(--toggle-icon-bg)', color: 'var(--accent-strong)' }}
            >
                {isDark ? <FaSun size={14} /> : <FaMoon size={14} />}
            </span>
        </button>
    );
};

export default ThemeToggle;
