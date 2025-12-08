import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import type { AuthProps } from '@/interfaces/auth';
import { cn } from '@/lib/utils';
import { router, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function MobileMenu() {
    const { auth } = usePage<AuthProps>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    /**
     * Handles user logout with feedback toasts.
     */
    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        setMobileMenuOpen(false);

        const loadingToast = toast.loading('Logging out...');

        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    toast.success('Logged out!', {
                        id: loadingToast,
                        description: 'See you soon!',
                    });
                },
                onError: () => {
                    toast.error('Logout failed', {
                        id: loadingToast,
                        description: 'Please try again',
                    });
                },
            },
        );
    };

    return (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="mt-8 flex flex-col space-y-4">
                    {auth?.user ? (
                        <>
                            <a
                                href={route('dashboard')}
                                className={cn(
                                    'block py-2 text-lg font-medium transition-colors hover:text-primary',
                                    route().current('dashboard') &&
                                        'text-primary',
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    router.get(route('dashboard'));
                                }}
                            >
                                Dashboard
                            </a>
                            <a
                                href={route('profile.edit')}
                                className={cn(
                                    'block py-2 text-lg font-medium transition-colors hover:text-primary',
                                    route().current('profile.edit') &&
                                        'text-primary',
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    router.get(route('profile.edit'));
                                }}
                            >
                                Profile
                            </a>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <button
                                onClick={handleLogout}
                                className="block py-2 text-left text-lg font-medium transition-colors hover:text-destructive"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <a
                                href={route('login')}
                                className={cn(
                                    'block py-2 text-lg font-medium transition-colors hover:text-primary',
                                    route().current('login') && 'text-primary',
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    router.get(route('login'));
                                }}
                            >
                                Log in
                            </a>
                            <a
                                href={route('register')}
                                className={cn(
                                    'block py-2 text-lg font-medium transition-colors hover:text-primary',
                                    route().current('register') &&
                                        'text-primary',
                                )}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setMobileMenuOpen(false);
                                    router.get(route('register'));
                                }}
                            >
                                Register
                            </a>
                        </>
                    )}
                </nav>
            </SheetContent>
        </Sheet>
    );
}
