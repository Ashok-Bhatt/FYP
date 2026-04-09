import React, { useEffect, ReactNode } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import AnimatedRoutes from './components/AnimatedRoutes';
import ThemeToggle from './components/ThemeToggle';

interface LenisWrapperProps {
    children: ReactNode;
}

// Component to handle Lenis initialization inside Router
const LenisWrapper: React.FC<LenisWrapperProps> = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        const shouldDisableLenis = () => {
            const location = window.location.pathname;
            return (
                location.startsWith('/agent') ||
                location.startsWith('/partner') ||
                location.startsWith('/traveler') ||
                location === '/login' ||
                location === '/signup' ||
                location === '/thank-you' ||
                location.startsWith('/quote/')
            );
        };

        if (shouldDisableLenis()) {
            return; // Skip Lenis for these routes
        }

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, [location.pathname]);

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <LenisWrapper>
                        <div className="app-shell font-sans antialiased selection:bg-emerald-500 selection:text-white">
                            <div className="fixed right-4 top-4 z-[90] md:right-6 md:top-6">
                                <ThemeToggle />
                            </div>
                            <AnimatedRoutes />
                        </div>
                    </LenisWrapper>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
