import { router, usePage } from '@inertiajs/react';

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
import { LayoutDashboard, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export default function DropdownDashboard() {
    const { auth } = usePage<AuthProps>().props;
    const user = auth.user;

    const handleLogout = () => {
        const loadingToast = toast.loading('Terminating session...');
        router.post(
            route('logout'),
            {},
            {
                onSuccess: () => {
                    toast.success('Session Terminated', {
                        id: loadingToast,
                        description: 'Access credentials cleared.',
                    });
                },
            },
        );
    };

    return (
        <NavigationMenu delayDuration={0}>
            <NavigationMenuList>
                <NavigationMenuItem>
                    {/* TRIGGER: Più tecnico e pulito */}
                    <NavigationMenuTrigger className="group flex items-center gap-3 !bg-transparent px-0 py-2 text-[11px] font-black uppercase tracking-[0.2em] transition-colors hover:text-primary data-[state=open]:text-primary">
                        <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                        {user.name}
                    </NavigationMenuTrigger>

                    {/* CONTENT: Quadrato, bordo netto e stile "Blueprint" */}
                    <NavigationMenuContent className="border border-border bg-background shadow-2xl">
                        <div className="w-[200px] divide-y divide-border p-0">
                            {/* Header Info */}
                            <div className="bg-muted/30 px-4 py-4">
                                <p className="mb-1 text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                                    Active Operator
                                </p>
                                <p className="truncate text-xs font-bold uppercase tracking-tighter">
                                    {user.email}
                                </p>
                            </div>

                            {/* Menu Actions */}
                            <div className="p-1">
                                <button
                                    onClick={() =>
                                        router.get(route('dashboard'))
                                    }
                                    className="group flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <div className="flex items-center gap-3">
                                        <LayoutDashboard
                                            size={14}
                                            className="opacity-50 group-hover:opacity-100"
                                        />
                                        Dashboard
                                    </div>
                                    <span className="translate-x-2 text-[8px] italic opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                                        Go
                                    </span>
                                </button>

                                <button
                                    onClick={() =>
                                        router.get(route('profile.edit'))
                                    }
                                    className="group flex w-full items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors hover:bg-primary hover:text-primary-foreground"
                                >
                                    <div className="flex items-center gap-3">
                                        <User
                                            size={14}
                                            className="opacity-50 group-hover:opacity-100"
                                        />
                                        Identity
                                    </div>
                                    <span className="translate-x-2 text-[8px] italic opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                                        Edit
                                    </span>
                                </button>
                            </div>

                            {/* Logout Action */}
                            <div className="bg-destructive/5 p-1">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-3 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-destructive transition-colors hover:bg-destructive hover:text-white"
                                >
                                    <LogOut size={14} />
                                    Terminate
                                </button>
                            </div>
                        </div>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
}
