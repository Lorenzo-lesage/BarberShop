import { Link, usePage } from '@inertiajs/react';

// Interfaces
import type { Saloons } from '@/interfaces/saloon';

// Utils
import { cn } from '@/lib/utils';

interface Props extends Saloons {
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
                            'transition-shadow hover:shadow-lg',
                            isOwner
                                ? 'relative bg-amber-50 dark:bg-amber-950/20'
                                : 'bg-card',
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
                        <CardHeader>
                            <CardTitle>{saloon.name}</CardTitle>
                            <CardDescription>{saloon.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Barber: {saloon.barber?.name}
                            </p>
                            <Link href={route(routeName, saloon.id)}>
                                {isOwner && (
                                    <Button className="w-full">
                                        Look your saloon
                                    </Button>
                                )}
                                {!isOwner && (
                                    <Button className="w-full">
                                        {auth.user?.is_barber
                                            ? 'See saloon'
                                            : 'Book now'}
                                    </Button>
                                )}
                            </Link>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
