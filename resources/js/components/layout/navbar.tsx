import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

// Components
import ApplicationLogo from '@/Components/ApplicationLogo';
import DropdownDashboard from '@/components/navbarComponents/dropdownDashboard';
import MobileMenu from '@/components/navbarComponents/mobileMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '@/components/ui/navigation-menu';

// Icons
import { LayoutDashboard, LogIn } from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="flex items-center justify-between p-4">
            {/* Logo */}
            <Link href="/">
                <ApplicationLogo className="h-10 fill-current text-gray-500" />
            </Link>

            {/* Desktop Navigation */}
            <div className="ml-auto mr-4 hidden items-center gap-4 md:flex">
                {auth?.user ? (
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={route('dashboard')}
                                        className={cn(
                                            'flex items-center gap-2 text-sm underline-offset-4 hover:underline',
                                            route().current('dashboard') &&
                                                'text-foreground underline underline-offset-4',
                                        )}
                                    >
                                        Dashboard
                                        <LayoutDashboard size={15} />
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                ) : (
                    <NavigationMenu>
                        <NavigationMenuList className="flex flex-row gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink asChild>
                                    <Link
                                        href={route('login')}
                                        className={cn(
                                            'flex items-center gap-1 text-sm underline-offset-4 hover:underline',
                                            route().current('login') &&
                                                'text-foreground underline underline-offset-4',
                                        )}
                                    >
                                        Log in
                                        <LogIn size={12} />
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden items-center gap-4 md:flex">
                {auth?.user && <DropdownDashboard />}
                <ThemeSwitcher />
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center gap-2 md:hidden">
                <ThemeSwitcher />
                <MobileMenu />
            </div>
        </nav>
    );
}
