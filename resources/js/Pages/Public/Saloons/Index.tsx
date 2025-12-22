// Pages/Public/Saloons/Index.tsx
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function Index({ saloons }) {
    return (
        <div className="mx-auto max-w-7xl px-4 py-12">
            <h1 className="mb-8 text-4xl font-bold">Scegli il tuo Barbiere</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {saloons.map((saloon) => (
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
                                Gestito da: {saloon.barber?.name}
                            </p>
                            <Link href={route('saloons.show', saloon.id)}>
                                <Button className="w-full">Prenota ora</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
