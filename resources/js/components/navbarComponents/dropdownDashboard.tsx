import { router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';

// Interfaces
import type { AuthProps } from '@/interfaces/auth';

// UI Components
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

// Icons
import { CircleUserRound, LayoutDashboard, LogOut, User } from 'lucide-react';

// Toast
import { toast } from 'sonner';

export default function DropdownDashboard() {
    const { auth, flash } = usePage<AuthProps>().props;
    const user = auth.user;

    /**
     * Displays toast notifications based on flash messages.
     */
    useEffect(() => {
        if (flash?.toast) {
            const { type, message, description } = flash.toast;

            setTimeout(() => {
                if (type === 'success') {
                    toast.success(message, { description });
                } else if (type === 'error') {
                    toast.error(message, { description });
                }
            }, 100);
        }
    }, [flash]);

    /**
     * Handles user logout with feedback toasts.
     */
    const handleLogout = () => {
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

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <NavigationMenu delayDuration={100}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger className="flex items-center gap-2 rounded-md !bg-transparent px-3 py-2 text-sm font-medium underline-offset-4 focus:underline data-[state=open]:underline">
                        {user.name}
                    </NavigationMenuTrigger>

                    <NavigationMenuContent>
                        <div className="w-[150px] p-2">
                            <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium">
                                <CircleUserRound size={18} />
                                My Account
                            </div>

                            <button
                                onClick={() => router.get(route('dashboard'))}
                                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                            >
                                <LayoutDashboard size={14} />
                                Dashboard
                            </button>

                            <button
                                onClick={() =>
                                    router.get(route('profile.edit'))
                                }
                                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                            >
                                <User size={14} />
                                Profile
                            </button>

                            <hr className="my-1 border-gray-200 dark:border-gray-700" />

                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent"
                            >
                                <LogOut size={14} />
                                Log Out
                            </button>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
