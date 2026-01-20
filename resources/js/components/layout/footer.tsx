import { Link } from '@inertiajs/react';
import {
    ArrowUp,
    Facebook,
    Instagram,
    Linkedin,
    Mail,
    Twitter,
} from 'lucide-react';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="relative overflow-hidden border-t border-border bg-background px-6 pb-12 pt-24 md:px-12">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-4">
                    {/* Brand Section */}
                    <div className="space-y-8 lg:col-span-2">
                        <div className="space-y-4">
                            <h3 className="text-3xl font-black uppercase tracking-tighter">
                                BarberShop <br />
                                <span className="italic text-primary">
                                    Global
                                </span>
                            </h3>
                            <p className="max-w-xs text-sm font-light uppercase leading-relaxed tracking-widest text-muted-foreground">
                                The high-performance engine for the modern
                                grooming industry. Engineered for excellence.
                            </p>
                        </div>

                        {/* Social Links - Minimalist Icons */}
                        <div className="flex gap-6">
                            {[
                                {
                                    icon: <Linkedin size={18} />,
                                    href: 'https://www.linkedin.com/in/lorenzo-lesage-developer/',
                                    label: 'LinkedIn',
                                },
                                {
                                    icon: <Instagram size={18} />,
                                    href: '#',
                                    label: 'Instagram',
                                },
                                {
                                    icon: <Twitter size={18} />,
                                    href: '#',
                                    label: 'X',
                                },
                                {
                                    icon: <Facebook size={18} />,
                                    href: '#',
                                    label: 'Facebook',
                                },
                                {
                                    icon: <Mail size={18} />,
                                    href: 'mailto:lorenzo.lesage99@gmail.com',
                                    label: 'Email',
                                },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="text-muted-foreground transition-colors hover:text-primary"
                                    aria-label={social.label}
                                    target="blank"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation - Editorial Style */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
                            Navigation
                        </h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Find a Studio
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Become a Partner
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Legacy Journal
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support & Legal */}
                    <div className="space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">
                            Standard
                        </h4>
                        <ul className="space-y-4 text-[11px] font-bold uppercase tracking-widest">
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="#"
                                    className="transition-colors hover:text-primary"
                                >
                                    Support Center
                                </Link>
                            </li>
                            <li className="text-muted-foreground/40">
                                v2.0.26
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-24 flex flex-col items-center justify-between border-t border-border/50 pt-8 md:flex-row">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50">
                        © {new Date().getFullYear()} BarberShop — Built with{' '}
                        <span className="text-foreground">
                            Laravel & Inertia
                        </span>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group mt-8 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] md:mt-0"
                    >
                        Back to top
                        <div className="flex h-8 w-8 items-center justify-center border border-border transition-colors group-hover:bg-foreground group-hover:text-background">
                            <ArrowUp size={14} />
                        </div>
                    </button>
                </div>
            </div>

            {/* Background Decorative Text */}
            <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 select-none overflow-hidden whitespace-nowrap opacity-[0.02]">
                <span className="text-[15vw] font-black uppercase leading-none tracking-tighter">
                    The Artisan Standard
                </span>
            </div>
        </footer>
    );
}
