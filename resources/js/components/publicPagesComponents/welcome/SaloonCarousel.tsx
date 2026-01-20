import { Link, usePage } from '@inertiajs/react';

// Utils
import { cn } from '@/lib/utils';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

// Icons
import { User } from 'lucide-react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

export function SaloonCarousel({ saloons }: { saloons: Saloon[] }) {
    /*
    |--------------------------------------------------------------------------
    | Data
    |--------------------------------------------------------------------------
    */
    const { auth } = usePage().props;
    const authId = auth.user?.id;
    console.log('Saloons:', saloons);

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    if (!saloons || !Array.isArray(saloons) || saloons.length === 0) {
        return (
            <div className="py-10 text-center">
                <p className="italic text-muted-foreground">
                    No saloons available at the moment.
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full">
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {saloons.map((saloon) => {
                        const isOwner = authId === saloon.user_id;

                        return (
                            <CarouselItem
                                key={saloon.id}
                                className="basis-[65%] pl-1 md:basis-[50%] lg:basis-[25%]"
                            >
                                {/* Background Image Layer */}
                                <div className="p-0">
                                    <Card
                                        className={cn(
                                            'relative h-72 overflow-hidden border-none', // border-none se vuoi un look più pulito
                                            isOwner &&
                                                'bg-amber-50 dark:bg-amber-950/20',
                                        )}
                                    >
                                        {/* Background Image Layer */}
                                        {saloon.main_photo ? (
                                            <div
                                                className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 hover:scale-110"
                                                style={{
                                                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.8)), url('/storage/${saloon.main_photo.path}')`,
                                                }}
                                            />
                                        ) : (
                                            <div className="absolute inset-0 z-0 bg-muted" />
                                        )}

                                        {/* Overlay opzionale per scurire leggermente e migliorare la leggibilità */}
                                        <div className="absolute inset-0 z-10 bg-black/40" />

                                        {/* Contenuto sopra l'immagine */}
                                        <div className="relative z-20 flex h-full flex-col items-center justify-center p-6 text-center text-white">
                                            {isOwner && (
                                                <Badge
                                                    className="absolute right-2 top-2 z-30"
                                                    variant="secondary"
                                                >
                                                    Your saloon
                                                </Badge>
                                            )}

                                            <span className="text-2xl font-black tracking-tight">
                                                {saloon.name}
                                            </span>

                                            <div className="mt-2 space-y-1 text-sm font-medium text-white/90">
                                                <p>
                                                    {saloon.region},{' '}
                                                    {saloon.city} (
                                                    {saloon.province})
                                                </p>
                                                <p>{saloon.address}</p>
                                                <p className="flex items-center justify-center gap-1 opacity-75">
                                                    <User className="h-3 w-3" />
                                                    {saloon.barber?.name}
                                                </p>
                                            </div>

                                            <Link
                                                href={route(
                                                    'saloons.show',
                                                    saloon.id,
                                                )}
                                                className="mt-6"
                                                prefetch
                                            >
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    className="rounded-full bg-black/40 px-6 text-white hover:bg-black/60"
                                                >
                                                    View Saloon
                                                </Button>
                                            </Link>
                                        </div>
                                    </Card>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
