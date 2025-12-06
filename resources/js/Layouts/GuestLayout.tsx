import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="mb-8 w-full border-b bg-gray-900 dark:border-gray-700 dark:bg-gray-800">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="h-20 fill-current text-gray-500" />
                    </Link>
                </div>
            </nav>
            <div className="w-25 flex min-h-screen flex-col items-center py-6 dark:bg-gray-900 sm:justify-center sm:pt-0">
                <div className="w-50">{children}</div>
            </div>
        </div>
    );
}
