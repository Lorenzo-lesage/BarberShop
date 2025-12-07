import { create } from 'zustand';

// Interface
import { Theme, ThemeState } from '@/interfaces/theme';

export const useThemeStore = create<ThemeState>((set) => {
    const savedTheme = (
        typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    ) as Theme | null;

    return {
        theme: savedTheme ?? 'light', // se c'è un tema salvato lo usa
        toggleTheme: () =>
            set((state) => {
                const newTheme = state.theme === 'light' ? 'dark' : 'light';
                localStorage.setItem('theme', newTheme);
                return { theme: newTheme };
            }),
        setTheme: (theme) => {
            localStorage.setItem('theme', theme);
            set({ theme });
        },
    };
});
