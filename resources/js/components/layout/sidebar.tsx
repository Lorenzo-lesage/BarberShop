import { Link } from '@inertiajs/react';

export default function Sidebar() {
    return (
        <aside className="h-screen w-64 space-y-2 bg-gray-50 p-4 dark:bg-gray-900">
            <Link
                href="/dashboard"
                className="block rounded p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Dashboard
            </Link>
            <Link
                href="/profile"
                className="block rounded p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Profile
            </Link>
            <Link
                href="/settings"
                className="block rounded p-2 text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-gray-700"
            >
                Settings
            </Link>
        </aside>
    );
}
