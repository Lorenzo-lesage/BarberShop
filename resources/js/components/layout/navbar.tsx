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
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;

    return (
        <nav className="flex items-center justify-between p-4">
            {/* Logo */}
            <div className="flex items-center gap-4">
                <Link href="/">
                    <ApplicationLogo className="h-10 fill-current text-gray-500" />
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:block">
                    {auth?.user ? (
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={route('dashboard')}
                                            className={cn(
                                                route().current('dashboard') &&
                                                    'text-foreground underline underline-offset-4',
                                            )}
                                        >
                                            Dashboard
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
                                                route().current('login') &&
                                                    'text-foreground underline underline-offset-4',
                                            )}
                                        >
                                            Log in
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink asChild>
                                        <Link
                                            href={route('register')}
                                            className={cn(
                                                route().current('register') &&
                                                    'text-foreground underline underline-offset-4',
                                            )}
                                        >
                                            Register
                                        </Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    )}
                </div>
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
