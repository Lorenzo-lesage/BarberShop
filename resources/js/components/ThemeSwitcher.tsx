import { useEffect } from 'react';

// Stores
import { useThemeStore } from '@/stores/themeStores';

// Libraries
import { AnimatePresence, motion } from 'framer-motion';

// Icons
import { Moon, Sun } from 'lucide-react';

export default function ThemeSwitcher() {
    /*
    |----------------------------------------------------------------
    | Data
    |----------------------------------------------------------------
    */

    const theme = useThemeStore((state) => state.theme);
    const toggleTheme = useThemeStore((state) => state.toggleTheme);

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    /*
    |----------------------------------------------------------------
    | Render
    |----------------------------------------------------------------
    */

    return (
        <div
            className="relative h-5 w-5 cursor-pointer rounded-full p-3 transition-colors duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            onClick={toggleTheme}
        >
            <AnimatePresence mode="popLayout" initial={false}>
                {theme === 'light' ? (
                    <motion.div
                        key="sun"
                        initial={{ opacity: 0, rotate: -45, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: 45, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Sun className="text-amber-500" size={18} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="moon"
                        initial={{ opacity: 0, rotate: 45, scale: 0.6 }}
                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                        exit={{ opacity: 0, rotate: -45, scale: 0.6 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <Moon className="text-blue-400" size={18} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
