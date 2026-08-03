import { Link } from '@inertiajs/react';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icons
import { ArrowRight, Star } from 'lucide-react';

// Interfaces
import type { User } from '@/interfaces/auth';

// Utils
import { AkintuEmbed } from '@akintu/widget/react';

// Constants
const akintuApiKey = import.meta.env.AKINTU_API_KEY;

export function HeroSection({ user }: { user: User }) {
    return (
        <header className="container mx-auto mb-10 flex h-[95vh] flex-col justify-center px-6 md:px-12">
            <div className="max-w-5xl space-y-10">
                <Badge
                    variant="outline"
                    className="inline-flex items-center border-white/10 bg-white/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.3em] text-white backdrop-blur-xl"
                >
                    <Star className="mr-2 h-3 w-3 fill-primary text-primary" />
                    Engineered for Professionals • 2026
                </Badge>

                <div className="space-y-4">
                    <h1 className="text-7xl font-black uppercase leading-[0.85] tracking-tighter sm:text-8xl md:text-[11rem]">
                        Barber <br />
                        <span className="text-foreground/80 opacity-80">
                            Shop
                        </span>
                    </h1>
                </div>

                <p className="max-w-2xl text-xl font-light leading-relaxed text-muted-foreground/80 md:text-2xl">
                    Redefining the intersection of{' '}
                    <span className="font-medium italic text-foreground">
                        tradition
                    </span>{' '}
                    and{' '}
                    <span className="font-medium italic text-foreground">
                        technology
                    </span>
                    . A high-performance engine for your barbering business.
                </p>

                <div className="pt-12">
                    <AkintuEmbed apiKey={akintuApiKey} />
                </div>

                {!user && (
                    <div className="flex flex-col gap-6 pt-12 sm:flex-row">
                        <Link href={route('login')}>
                            <Button
                                size="lg"
                                className="group h-16 rounded-none bg-primary px-12 text-sm font-black uppercase tracking-widest transition-all hover:bg-white hover:text-black"
                            >
                                Get Started
                                <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
}
