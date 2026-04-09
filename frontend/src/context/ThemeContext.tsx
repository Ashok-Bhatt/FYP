import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
    theme: Theme;
    isDark: boolean;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
}

const STORAGE_KEY = 'voyagegen-theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getPreferredTheme = (): Theme => {
    if (typeof window === 'undefined') {
        return 'light';
    }

    const storedTheme = window.localStorage.getItem(STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyTheme = (theme: Theme) => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.colorScheme = theme;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [hasStoredPreference, setHasStoredPreference] = useState<boolean>(() => {
        if (typeof window === 'undefined') {
            return false;
        }

        const storedTheme = window.localStorage.getItem(STORAGE_KEY);
        return storedTheme === 'light' || storedTheme === 'dark';
    });

    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof document !== 'undefined') {
            if (document.documentElement.classList.contains('dark')) return 'dark';
            if (document.documentElement.classList.contains('light')) return 'light';
        }

        return getPreferredTheme();
    });

    useEffect(() => {
        applyTheme(theme);

        if (hasStoredPreference) {
            window.localStorage.setItem(STORAGE_KEY, theme);
        } else {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, [hasStoredPreference, theme]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleSystemThemeChange = (event: MediaQueryListEvent) => {
            const storedTheme = window.localStorage.getItem(STORAGE_KEY);
            if (storedTheme === 'light' || storedTheme === 'dark') {
                return;
            }

            setThemeState(event.matches ? 'dark' : 'light');
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }, []);

    const setTheme = (nextTheme: Theme) => {
        setHasStoredPreference(true);
        setThemeState(nextTheme);
    };

    const value = useMemo<ThemeContextValue>(() => ({
        theme,
        isDark: theme === 'dark',
        setTheme,
        toggleTheme: () => {
            setHasStoredPreference(true);
            setThemeState((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark');
        },
    }), [theme]);

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }

    return context;
};
