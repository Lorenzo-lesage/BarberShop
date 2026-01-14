import { Link, usePage } from '@inertiajs/react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

// Utils
import { cn } from '@/lib/utils';

interface Props {
    saloons: Saloon[];
    routeName?: string;
}

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function SaloonsComponent({
    saloons,
    routeName = 'saloons.show',
}: Props) {
    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    const { auth } = usePage().props;
    const authId = auth.user?.id;

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */
    return (
        <div className="grid grid-cols-2 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {saloons.map((saloon) => {
                const isOwner = authId === saloon.user_id;

                return (
                    <Card
                        key={saloon.id}
                        className={cn(
                            'relative flex min-h-[300px] flex-col justify-end overflow-hidden border-none transition-shadow hover:shadow-xl',
                            isOwner ? 'ring-2 ring-amber-500' : '',
                        )}
                    >
                        {/* Background Image Layer */}
                        <div
                            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-500 hover:scale-105"
                            style={{
                                backgroundImage: saloon.main_photo
                                    ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.9)), url('/storage/${saloon.main_photo.path}')`
                                    : `linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.8)), url('/images/placeholder-saloon.jpg')`,
                                opacity: '0.6',
                            }}
                        />

                        {/* Content Layer (z-10 per stare sopra l'immagine) */}
                        <div className="relative z-10 flex h-full flex-col bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                            {isOwner && (
                                <div className="flex justify-end p-2">
                                    <Badge
                                        variant="secondary"
                                        className="border-none bg-amber-500 text-white"
                                    >
                                        Your saloon
                                    </Badge>
                                </div>
                            )}

                            <div className="mt-auto">
                                <CardHeader className="pb-2 text-white">
                                    <CardTitle className="text-xl shadow-sm">
                                        {saloon.name}
                                    </CardTitle>
                                    <div className="text-xs font-medium uppercase tracking-wider opacity-90">
                                        {saloon.city} ({saloon.province})
                                    </div>
                                    <CardDescription className="line-clamp-1 text-gray-200">
                                        {saloon.address}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="pt-0">
                                    <p className="mb-4 text-xs text-gray-300">
                                        Barber:{' '}
                                        <span className="font-semibold text-white">
                                            {saloon.barber?.name}
                                        </span>
                                    </p>
                                    <Link
                                        href={route(routeName, saloon.id)}
                                        prefetch
                                    >
                                        <Button
                                            className={cn(
                                                'w-full border-none bg-white text-black hover:bg-gray-200',
                                            )}
                                        >
                                            {isOwner
                                                ? 'Manage Salon'
                                                : auth.user?.is_barber
                                                  ? 'View'
                                                  : 'Book Now'}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </div>
                        </div>
                    </Card>
                );
            })}
        </div>
    );
}
