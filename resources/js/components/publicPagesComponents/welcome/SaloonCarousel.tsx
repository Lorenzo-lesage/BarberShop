import { Badge } from '@/components/ui/badge';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { Saloon } from '@/interfaces/saloon';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, User } from 'lucide-react';

export function SaloonCarousel({ saloons }: { saloons: Saloon[] }) {
    const { auth } = usePage().props;
    const authId = auth.user?.id;

    if (!saloons || saloons.length === 0) {
        return (
            <div className="border border-dashed border-border py-20 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/50">
                    No active studios found in registry
                </p>
            </div>
        );
    }

    return (
        <div className="group relative mx-auto w-full">
            <Carousel
                className="w-full"
                opts={{
                    align: 'start',
                    loop: true,
                }}
            >
                <CarouselContent className="-ml-4">
                    {saloons.map((saloon) => {
                        const isOwner = authId === saloon.user_id;

                        return (
                            <CarouselItem
                                key={saloon.id}
                                className="basis-[85%] pl-4 sm:basis-[50%] lg:basis-[33.333%] xl:basis-[25%]"
                            >
                                <div className="group/card relative aspect-[4/5] w-full overflow-hidden bg-muted transition-all duration-500">
                                    {/* Background Image con Zoom */}
                                    {saloon.main_photo ? (
                                        <div
                                            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover/card:scale-110"
                                            style={{
                                                backgroundImage: `url('/storage/${saloon.main_photo.path}')`,
                                            }}
                                        />
                                    ) : (
                                        <div className="absolute inset-0 z-0 bg-neutral-900" />
                                    )}

                                    {/* Overlay Gradiente Tecnico */}
                                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity group-hover/card:opacity-90" />

                                    {/* Content Layer */}
                                    <div className="relative z-20 flex h-full flex-col justify-between p-8 text-white">
                                        {/* Top Meta */}
                                        <div className="flex items-start justify-between">
                                            <Badge
                                                className={cn(
                                                    'rounded-none border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em]',
                                                    isOwner
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-white/10 text-white backdrop-blur-md',
                                                )}
                                            >
                                                {isOwner
                                                    ? 'Your Studio'
                                                    : 'Verified'}
                                            </Badge>
                                        </div>

                                        {/* Bottom Meta */}
                                        <div className="space-y-4">
                                            <div className="space-y-1">
                                                <h3 className="text-2xl font-black uppercase italic leading-none tracking-tighter">
                                                    {saloon.name}
                                                </h3>
                                                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                                                    <span className="h-1 w-1 rounded-full bg-primary" />
                                                    {saloon.city} —{' '}
                                                    {saloon.province}
                                                </p>
                                            </div>

                                            {/* Divider Animato */}
                                            <div className="h-[1px] w-0 bg-primary transition-all duration-500 group-hover/card:w-full" />

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-none border border-white/20 bg-white/5 backdrop-blur-sm">
                                                        <User
                                                            size={12}
                                                            className="text-white/70"
                                                        />
                                                    </div>
                                                    <span className="text-[9px] font-black uppercase tracking-widest text-white/80">
                                                        {saloon.barber?.name}
                                                    </span>
                                                </div>

                                                <Link
                                                    href={route(
                                                        'saloons.show',
                                                        saloon.id,
                                                    )}
                                                    prefetch
                                                    className="translate-x-4 opacity-0 transition-all duration-500 group-hover/card:translate-x-0 group-hover/card:opacity-100"
                                                >
                                                    <div className="flex h-10 w-10 items-center justify-center bg-white text-black transition-colors hover:bg-primary hover:text-white">
                                                        <ArrowRight size={16} />
                                                    </div>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                {/* Navigazione Posizionata in modo Sartoriale */}
                <div className="absolute -top-16 right-4 flex gap-2">
                    <CarouselPrevious className="static h-10 w-10 translate-y-0 rounded-none border-border bg-background transition-all hover:bg-foreground hover:text-background" />
                    <CarouselNext className="static h-10 w-10 translate-y-0 rounded-none border-border bg-background transition-all hover:bg-foreground hover:text-background" />
                </div>
            </Carousel>
        </div>
    );
}
