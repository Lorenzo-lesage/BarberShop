import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';

// Interfaces
import type { Saloon } from '@/interfaces/saloon';

// Components
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// Icons
import { ArrowRight, MapPin } from 'lucide-react';

interface SaloonCardProps {
    saloon: Saloon;
    isOwner: boolean;
    routeName?: string;
    className?: string;
}

export function SaloonCard({
    saloon,
    isOwner,
    routeName = 'saloons.show',
    className,
}: SaloonCardProps) {
    return (
        <div
            className={cn(
                'group relative aspect-[3/4] overflow-hidden bg-neutral-900',
                className,
            )}
        >
            {/* --- VISUAL LAYER --- */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-1000 ease-out group-hover:scale-110"
                style={{
                    backgroundImage: saloon.main_photo
                        ? `url('/storage/${saloon.main_photo.path}')`
                        : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Cinematic Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

            {/* --- CONTENT LAYER --- */}
            <div className="relative z-20 flex h-full flex-col justify-between p-6 text-white">
                {/* Header: Status Badge */}
                <div className="flex items-start justify-between">
                    <Badge
                        className={cn(
                            'rounded-none border-none bg-white/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl',
                            isOwner
                                ? 'bg-white text-black shadow-[0_0_10px_rgba(var(--primary),0.8)]'
                                : 'bg-white/10 text-white backdrop-blur-xl',
                        )}
                    >
                        {isOwner ? 'Your Studio' : 'Verified'}
                    </Badge>

                    {/* Active Indicator Dot */}
                    <div
                        className={cn(
                            'h-1.5 w-1.5 rounded-full bg-white/40 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_0_8px_#fff]',
                            isOwner
                                ? 'bg-black/40 group-hover:shadow-[0_0_10px_rgba(var(--primary),0.8)]'
                                : 'bg-white/40 group-hover:bg-primary group-hover:shadow-[0_0_8px_#fff]',
                        )}
                    />
                </div>

                {/* Footer: Info & Action */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="space-y-0">
                            <h3 className="text-3xl font-black uppercase italic leading-none tracking-tighter transition-transform duration-500 group-hover:-translate-y-1">
                                {saloon.name}
                            </h3>
                            <div className="flex items-center gap-2 pt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-white/50">
                                <MapPin size={10} className="text-primary" />
                                <span>
                                    {saloon.city} — {saloon.province}
                                </span>
                            </div>
                        </div>

                        {/* Artisan Divider */}
                        <div className="h-[1px] w-8 bg-white transition-all duration-700 ease-in-out group-hover:w-full group-hover:bg-white" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <p className="line-clamp-1 text-[10px] font-medium uppercase tracking-widest text-white/60">
                            Directed by{' '}
                            <span className="font-black italic text-white">
                                {saloon.barber?.name}
                            </span>
                        </p>

                        <Link
                            href={route(routeName, saloon.id)}
                            prefetch
                            className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                        >
                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-none border-white/20 bg-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-white backdrop-blur-md transition-all hover:border-white hover:bg-white hover:text-black"
                            >
                                {isOwner ? 'Manage Registry' : 'Secure Session'}
                                <ArrowRight className="ml-2 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Corner Accent (Solo visibile in hover) */}
            <div className="absolute bottom-0 right-0 h-1 w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
    );
}
