import ApplicationLogo from '@/Components/ApplicationLogo';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between bg-white p-4 shadow-md dark:bg-gray-900">
            <div className="flex items-center gap-4">
                <Link href="/">
                    <ApplicationLogo className="h-10 fill-current text-gray-500" />
                </Link>
                <Link
                    href="/"
                    className="text-gray-700 hover:underline dark:text-gray-200"
                >
                    Home
                </Link>
                <Link
                    href="/dashboard"
                    className="text-gray-700 hover:underline dark:text-gray-200"
                >
                    Dashboard
                </Link>
            </div>
            <div>
                <ThemeSwitcher />
            </div>
        </nav>
    );
}
