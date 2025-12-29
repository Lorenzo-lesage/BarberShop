// Interfaces
import type { Saloons } from '@/interfaces/saloon';

interface Props extends Saloons {
    routeName?: string;
}

// Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link, usePage } from '@inertiajs/react';

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {saloons.map((saloon) => {
                const isOwner = authId === saloon.user_id;

                if (isOwner) return null;

                return (
                    <Card
                        key={saloon.id}
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardHeader>
                            <CardTitle>{saloon.name}</CardTitle>
                            <CardDescription>{saloon.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4 text-sm text-muted-foreground">
                                Barber: {saloon.barber?.name}
                            </p>
                            <Link href={route(routeName, saloon.id)}>
                                <Button className="w-full">
                                    {auth.user?.is_barber ? 'See saloon' : 'Book now'}
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
