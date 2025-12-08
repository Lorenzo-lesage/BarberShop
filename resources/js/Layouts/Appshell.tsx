// Components
import Footer from '@/components/layout/footer';
import Navbar from '@/components/layout/navbar';

export default function AppShell({
    children,
}: {
    children: React.ReactNode;
}): React.ReactNode {
    return (
        <div className="dark:bg-darkbg light:bg-lightbg min-h-screen">
            <Navbar />
            <main className="flex-1 px-4">{children}</main>
            <Footer />
        </div>
    );
}
