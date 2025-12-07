import { Toaster } from '@/components/ui/sonner';
import { useThemeStore } from '@/stores/themeStores';

// Components
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';
import Sidebar from '@/components/layout/sidebar';

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    const theme = useThemeStore((state) => state.theme);
    return (
        <div className="relative z-50 flex min-h-screen flex-col dark:bg-gray-900 dark:text-gray-200">
            <Navbar />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1">{children}</main>
            </div>
            <Footer />
            <Toaster
                richColors
                position="bottom-left"
                closeButton
                theme={theme}
            />
        </div>
    );
}
