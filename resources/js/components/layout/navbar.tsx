import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Components
import ApplicationLogo from '@/Components/ApplicationLogo';
import DropdownDashboard from '@/components/navbarComponents/dropdownDashboard';
import MobileMenu from '@/components/navbarComponents/mobileMenu';
import ThemeSwitcher from '@/components/ThemeSwitcher';

// Icons
import { LogIn } from 'lucide-react';

export default function Navbar() {
    const { auth } = usePage<PageProps>().props;
    const [scrolled, setScrolled] = useState(false);

    // Monitoriamo lo scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                'fixed left-0 right-0 top-0 z-50 transition-all duration-500 ease-in-out',
                scrolled
                    ? 'border-b border-border bg-background/80 backdrop-blur-md'
                    : 'border-b border-transparent bg-transparent',
            )}
        >
            {/* 1. BANNER SUPERIORE (Scompare allo scroll) */}
            <div
                className={cn(
                    'overflow-hidden border-b border-border/10 bg-foreground/5 transition-all duration-500 ease-in-out',
                    scrolled ? 'max-h-0 opacity-0' : 'max-h-10 opacity-100',
                )}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2 md:px-12">
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
                        Official BarberShop — V1
                    </span>
                    <span className="animate-pulse text-[8px] font-black uppercase tracking-[0.4em] text-primary">
                        System Online
                    </span>
                </div>
            </div>

            {/* 2. MAIN NAVBAR */}
            <div
                className={cn(
                    'mx-auto flex max-w-7xl items-center justify-between px-6 transition-all duration-500 md:px-12',
                    scrolled ? 'h-16' : 'h-24',
                )}
            >
                {/* Logo */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="transition-transform duration-500 hover:scale-105"
                    >
                        <ApplicationLogo
                            className={cn(
                                'h-10 w-auto fill-current transition-colors',
                                !scrolled ? 'text-foreground' : 'text-primary',
                            )}
                        />
                    </Link>
                    <div
                        className={cn(
                            'h-4 w-[1px] bg-border transition-opacity duration-500',
                            scrolled ? 'opacity-100' : 'opacity-0',
                        )}
                    />
                    <span
                        className={cn(
                            'hidden text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50 transition-all md:block',
                            scrolled
                                ? 'translate-x-0 opacity-100'
                                : '-translate-x-4 opacity-0',
                        )}
                    >
                        BarberShop
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-6">
                    {!auth?.user ? (
                        <Link
                            href={route('login')}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]"
                        >
                            <LogIn size={14} className="text-primary" />
                            <span
                                className={cn(
                                    'transition-colors',
                                    !scrolled
                                        ? 'text-foreground'
                                        : 'text-muted-foreground hover:text-foreground',
                                )}
                            >
                                Access System
                            </span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-6">
                            <div
                                className={cn(
                                    'hidden h-8 w-[1px] bg-border transition-opacity md:block',
                                    scrolled ? 'opacity-100' : 'opacity-0',
                                )}
                            />
                            <DropdownDashboard />
                        </div>
                    )}

                    <div className="flex items-center gap-2 border-l border-border/20 pl-6">
                        <ThemeSwitcher />
                        <div className="md:hidden">
                            <MobileMenu />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
