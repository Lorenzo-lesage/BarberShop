import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Saloon } from '@/interfaces/saloon';
import { cn } from '@/lib/utils';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, MapPin } from 'lucide-react';

interface Props {
    saloons: Saloon[];
    routeName?: string;
}

export default function SaloonsComponent({
    saloons,
    routeName = 'saloons.show',
}: Props) {
    const { auth } = usePage().props;
    const authId = auth.user?.id;

    return (
        <div className="grid grid-cols-1 gap-px border border-border bg-border sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {saloons.map((saloon) => {
                const isOwner = authId === saloon.user_id;

                return (
                    <div
                        key={saloon.id}
                        className="group relative aspect-[3/4] overflow-hidden bg-background"
                    >
                        {/* Background Image con Zoom Effect */}
                        <div
                            className="absolute inset-0 z-0 transition-transform duration-700 ease-out group-hover:scale-110"
                            style={{
                                backgroundImage: saloon.main_photo
                                    ? `url('/storage/${saloon.main_photo.path}')`
                                    : 'none',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        />

                        {/* Overlay Gradiente: Sempre scuro per leggibilità, ma reagisce al tema */}
                        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                        {/* Content Layer */}
                        <div className="relative z-20 flex h-full flex-col justify-between p-6 text-white">
                            <div className="flex items-start justify-between">
                                <Badge
                                    className={cn(
                                        'rounded-none border-none px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em]',
                                        isOwner
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-white/10 text-white backdrop-blur-md',
                                    )}
                                >
                                    {isOwner ? 'Your Studio' : 'Verified'}
                                </Badge>

                                <div className="h-2 w-2 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black uppercase italic leading-none tracking-tighter">
                                        {saloon.name}
                                    </h3>
                                    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.2em] text-white/60">
                                        <MapPin
                                            size={10}
                                            className="text-primary"
                                        />
                                        {saloon.city}
                                    </div>
                                </div>

                                {/* Divider Animato */}
                                <div className="h-[1px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />

                                <div className="flex flex-col gap-4 overflow-hidden transition-all duration-500">
                                    <p className="line-clamp-2 text-xs font-light leading-relaxed text-white/70">
                                        {saloon.address} • Directed by{' '}
                                        <span className="font-bold text-white">
                                            {saloon.barber?.name}
                                        </span>
                                    </p>

                                    <Link
                                        href={route(routeName, saloon.id)}
                                        prefetch
                                    >
                                        <Button
                                            variant="outline"
                                            className="h-12 w-full rounded-none border-white/20 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-black"
                                        >
                                            {isOwner
                                                ? 'Manage Studio'
                                                : 'Book Session'}
                                            <ArrowRight className="ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
