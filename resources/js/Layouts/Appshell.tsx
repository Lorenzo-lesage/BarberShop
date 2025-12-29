import { cn } from '@/lib/utils';

// Components
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function AppShell({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}): React.ReactNode {
    return (
        <div className="dark:bg-darkbg light:bg-lightbg min-h-screen">
            <div className="sticky top-0 z-40">
                <Navbar />
            </div>
            <main className={cn('min-h-screen flex-1 py-6', className)}>
                {children}
            </main>
            <Footer />
        </div>
    );
}
