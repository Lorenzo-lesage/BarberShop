import { Link } from '@inertiajs/react';

// Components
import { SaloonCarousel } from '@/components/publicPagesComponents/welcome/SaloonCarousel';

// Icons
import { ArrowUpRight } from 'lucide-react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

export function FeaturedSaloons({ saloons }: { saloons: Saloon[] }) {
    return (
        <section className="relative overflow-hidden bg-background py-40 transition-colors duration-500">
            <div className="container mx-auto px-6 md:px-12">
                <div className="relative mb-24 flex flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] w-12 bg-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary">
                                Curated Selection
                            </span>
                        </div>

                        <h2 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter sm:text-7xl md:text-8xl">
                            The Elite <br />
                            <span className="text-outline-adaptive italic opacity-20">
                                Network.
                            </span>
                        </h2>
                    </div>

                    <div className="flex flex-col items-start gap-6 lg:items-end">
                        <p className="max-w-[300px] text-sm font-light leading-relaxed text-muted-foreground lg:text-right">
                            Only the most prestigious studios, vetted for
                            technical excellence and atmosphere.
                        </p>
                        <Link
                            href={route('saloons.index')}
                            className="group flex items-center gap-4 border-b border-foreground/10 pb-2 text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:border-primary"
                        >
                            Explore all Studios
                            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                    </div>
                </div>

                {/* Carousel Container: eliminiamo il box grigio pesante e usiamo un'ombra soffusa */}
                <div className="relative">
                    <div className="absolute -inset-4 bg-primary/5 blur-3xl dark:bg-primary/[0.02]" />
                    <div className="relative z-10">
                        <SaloonCarousel saloons={saloons} />
                    </div>
                </div>
            </div>

            {/* Elemento decorativo verticale (stile editoriale) */}
            <div className="absolute right-12 top-1/2 hidden -translate-y-1/2 [writing-mode:vertical-rl] lg:block">
                <span className="text-[10px] font-medium uppercase tracking-[1em] text-muted-foreground/20">
                    Artisan Registry — 2026
                </span>
            </div>
        </section>
    );
}
