import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Toaster } from '@/components/ui/sonner';
import { useTheme } from '@/hooks/useTheme';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function AppShell({ children }: PropsWithChildren) {
    const { theme } = useTheme();

    return (
        <div className="flex min-h-screen flex-col text-foreground">
            {/* NAVBAR */}
            <header className="bg-transparent">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                    {/* LOGO */}
                    <Link href="/" className="text-xl font-semibold">
                        MyApp
                    </Link>

                    {/* RIGHT ACTIONS */}
                    <div className="flex items-center gap-3">
                        <ThemeSwitcher />
                    </div>
                </div>
            </header>

            {/* MAIN PAGE CONTENT */}
            <main className="flex-1">{children}</main>

            {/* FOOTER */}
            <footer className="mt-10 border-t bg-card py-4">
                <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} MyApp. All rights reserved.
                </div>
            </footer>

            {/* TOASTER */}
            <Toaster
                richColors
                position="bottom-left"
                closeButton
                theme={theme}
            />
        </div>
    );
}
