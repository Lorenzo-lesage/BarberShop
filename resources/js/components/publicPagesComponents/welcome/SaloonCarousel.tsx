import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';
import type { Saloon } from '@/interfaces/saloon';
import { usePage } from '@inertiajs/react';

import { SaloonCard } from '@/components/saloon/SaloonCard';

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
        <div className="relative mx-auto w-full">
            <Carousel
                className="w-full"
                opts={{
                    align: 'start',
                }}
            >
                <CarouselContent className="ml-0">
                    {saloons.map((saloon) => {
                        return (
                            <CarouselItem
                                key={saloon.id}
                                className="basis-[55%] pl-2 sm:basis-[29%] md:basis-[33.333%] lg:basis-[28%] xl:basis-[22%]"
                            >
                                <SaloonCard
                                    saloon={saloon}
                                    isOwner={authId === saloon.user_id}
                                />
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
