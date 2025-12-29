import { Link, usePage } from '@inertiajs/react';

// Utils
import { cn } from '@/lib/utils';

// Components
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from '@/components/ui/carousel';

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
        <div className="mx-auto w-full py-10">
            <div className="flex items-center justify-between">
                <h2 className="mb-6 text-center text-2xl font-bold">
                    Our Saloons
                </h2>
                <Link href={route('saloons.index')}>
                    <Badge variant="outline">View all Saloons</Badge>
                </Link>
            </div>
            <Carousel className="w-full">
                <CarouselContent className="-ml-1">
                    {saloons.map((saloon) => {
                        const isOwner = authId === saloon.user_id;

                        return (
                            <CarouselItem
                                key={saloon.id}
                                className="basis-[65%] pl-1 md:basis-[50%] lg:basis-[25%]"
                            >
                                <div className="p-0">
                                    <Card
                                        className={cn(
                                            isOwner &&
                                                'relative bg-amber-50 dark:bg-amber-950/20',
                                        )}
                                    >
                                        {isOwner && (
                                            <Badge
                                                className="absolute right-2 top-2"
                                                variant="secondary"
                                            >
                                                Your saloon
                                            </Badge>
                                        )}
                                        <CardContent className="flex h-40 flex-col items-center justify-center">
                                            <span className="text-xl font-semibold">
                                                {saloon.name}
                                            </span>
                                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                                {saloon.address}
                                            </p>
                                            <Link
                                                href={route(
                                                    'saloons.show',
                                                    saloon.id,
                                                )}
                                            >
                                                <Badge
                                                    className="mt-2"
                                                    variant="outline"
                                                >
                                                    View Saloon
                                                </Badge>
                                            </Link>
                                        </CardContent>
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
