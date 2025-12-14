import { Link, usePage } from '@inertiajs/react';

export default function Footer() {
    const { auth } = usePage().props;
    return (
        <footer className="p-4 text-center text-gray-700 dark:text-gray-200">
            &copy; {new Date().getFullYear()} BarberShop
            {!auth?.user?.is_barber && (
                <Link href="/become-barber" className="text-sm underline">
                    Become a Barber
                </Link>
            )}
        </footer>
    );
}
